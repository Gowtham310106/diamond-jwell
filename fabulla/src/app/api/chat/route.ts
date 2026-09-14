/**
 * POST /api/chat — the concierge endpoint, on Gemini.
 *
 *   { messages: [{role, content}], conversationId?, page? }
 *   → { reply, source: "gemini" | "studio", conversationId }
 *
 * Every exchange is logged so the admin can see what visitors ask; a
 * conversation whose last answer was a hand-off is flagged "unanswered",
 * which is the list of FAQs the studio has not written yet.
 */

import { NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { getStore } from "@/lib/cms/store";
import { getSettings, listFaqs, listPublished, upsert } from "@/lib/cms/repo";
import type { Conversation } from "@/lib/cms/types";
import { LIMITS, buildSystemPrompt, studioAnswer, type ChatMessage, type ReplySource } from "@/lib/concierge";

export const runtime = "nodejs";

const WINDOW_MS = 5 * 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

function parseThread(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const thread: ChatMessage[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > LIMITS.maxCharacters) return null;
    thread.push({ role, content: trimmed });
  }

  const recent = thread.slice(-LIMITS.maxTurns);
  while (recent.length && recent[0].role !== "user") recent.shift();
  if (!recent.length || recent[recent.length - 1].role !== "user") return null;
  return recent;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const settings = await getSettings();

  if (!settings.chatbot.enabled) {
    return NextResponse.json({ error: "The concierge is switched off." }, { status: 404 });
  }
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: `That is a lot of questions at once. Give it a few minutes, or call ${settings.contact.phone}.` },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => null)) as { conversationId?: string; page?: string } | null;
  const thread = parseThread(body);
  if (!thread) return NextResponse.json({ error: "That message could not be read. Try a shorter one." }, { status: 400 });

  const question = thread[thread.length - 1].content;
  const faqs = await listFaqs();

  let reply = "";
  let source: ReplySource = "studio";
  let matched = false;

  try {
    const products = await listPublished();
    const text = await chat({ system: buildSystemPrompt(settings, products, faqs), turns: thread });
    if (text) {
      reply = text;
      source = "gemini";
      matched = true;
    }
  } catch (error) {
    console.error("[chat] Gemini failed:", error instanceof Error ? error.message : error);
  }

  if (!reply) {
    const fallback = studioAnswer(question, faqs, settings);
    reply = fallback.answer;
    matched = fallback.matched;
  }

  // Log. Failure to log never fails the reply.
  let conversationId = body?.conversationId;
  try {
    const at = new Date().toISOString();
    const existing = conversationId ? await getStore().get("conversations", conversationId) : null;
    const turns = [...(existing?.turns ?? []), { role: "user" as const, content: question, at }, { role: "assistant" as const, content: reply, at }];
    const saved = await upsert<Conversation>("conversations", {
      _id: existing?._id,
      createdAt: existing?.createdAt,
      turns: turns.slice(-40),
      source,
      unanswered: !matched,
      page: (body?.page ?? existing?.page ?? "").slice(0, 200),
    });
    conversationId = saved._id;
  } catch (error) {
    console.error("[chat] could not log conversation:", error instanceof Error ? error.message : error);
  }

  return NextResponse.json({ reply, source, conversationId });
}
