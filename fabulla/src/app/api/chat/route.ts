/**
 * POST /api/chat — the concierge endpoint.
 *
 * Takes the whole thread and returns one reply:
 *
 *   { reply: string, source: "claude" | "studio" }
 *
 * With ANTHROPIC_API_KEY set it answers with Claude under the system prompt in
 * `lib/concierge.ts`. Without one it answers from the same facts through
 * `studioAnswer`, and `source` says which happened so the panel can label it.
 * A missing key is a deploy state, not an error: the widget stays useful.
 *
 * The key is read here and nowhere else. It is never returned, logged, or sent
 * to the client in any form, including inside an error.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  LIMITS,
  STUDIO_NO_MATCH,
  buildSystemPrompt,
  studioAnswer,
  type ChatMessage,
  type ReplySource,
} from "@/lib/concierge";
import { CONTACT } from "@/lib/site";

/** The SDK needs Node built-ins, so this cannot run on the edge runtime. */
export const runtime = "nodejs";

/**
 * Opus is the default here because this is the studio's voice talking to a
 * customer, and the traffic is a handful of questions a day. One constant to
 * change if that stops being true.
 */
const MODEL = "claude-opus-5";

/**
 * Effort is low, not thinking-off: these are short grounded answers, so depth
 * buys nothing and costs a visitor seconds of staring at a spinner. Disabling
 * thinking outright on this model has its own failure modes, so it stays on.
 */
const EFFORT = "low";

/** Four sentences of jewellery talk. Well clear of any HTTP timeout. */
const MAX_TOKENS = 700;

/**
 * Per-IP throttle. In-memory, so it is per server instance and resets on
 * deploy — enough to stop a bored visitor looping the endpoint, and no
 * substitute for a real limiter at the edge if this ever gets traffic.
 */
const WINDOW_MS = 5 * 60_000;
const MAX_REQUESTS = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // The map would otherwise grow for the life of the process.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

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
    if (!trimmed) return null;
    if (trimmed.length > LIMITS.maxCharacters) return null;

    thread.push({ role, content: trimmed });
  }

  // Claude needs the thread to start with, and end on, the visitor.
  const recent = thread.slice(-LIMITS.maxTurns);
  while (recent.length && recent[0].role !== "user") recent.shift();
  if (!recent.length || recent[recent.length - 1].role !== "user") return null;

  return recent;
}

function reply(text: string, source: ReplySource) {
  return NextResponse.json({ reply: text, source });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error: `That is a lot of questions at once. Give it a few minutes, or call ${CONTACT.phone} and speak to someone now.`,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const thread = parseThread(body);
  if (!thread) {
    return NextResponse.json(
      { error: "That message could not be read. Try a shorter one." },
      { status: 400 }
    );
  }

  const question = thread[thread.length - 1].content;

  // No key configured: answer from the studio's own facts and say so.
  if (!process.env.ANTHROPIC_API_KEY) {
    return reply(studioAnswer(question) ?? STUDIO_NO_MATCH, "studio");
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: EFFORT },
      // The prompt is byte-stable across requests, so the prefix can cache.
      system: [
        {
          type: "text",
          text: buildSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: thread,
    });

    if (response.stop_reason === "refusal") {
      return reply(studioAnswer(question) ?? STUDIO_NO_MATCH, "studio");
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) return reply(studioAnswer(question) ?? STUDIO_NO_MATCH, "studio");

    return reply(text, "claude");
  } catch (error) {
    // Anything upstream — bad key, rate limit, outage — degrades to the studio
    // answer rather than a dead panel. The cause stays in the server log.
    if (error instanceof Anthropic.APIError) {
      console.error(`[concierge] Claude API error ${error.status}`);
    } else {
      console.error("[concierge] unexpected failure", error);
    }

    return reply(studioAnswer(question) ?? STUDIO_NO_MATCH, "studio");
  }
}
