/**
 * POST /api/admin/ai/image  { sourceUrl, prompt, aspectRatio? }
 *
 * The admin "enhance" button. Takes an existing photo, asks Gemini's image
 * model for a variant (cleaner background, a different angle, a hero crop),
 * stores the result like any upload and returns the registered asset. The
 * admin then chooses whether it goes on the product. Nothing is replaced
 * automatically.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { aiConfigured, editImage } from "@/lib/ai";
import { upsert } from "@/lib/cms/repo";
import type { MediaAsset } from "@/lib/cms/types";
import { LOCAL_UPLOAD_DIR, objectKey, putObject } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Prompts the studio can pick from; a free-text box sits beside them. */
export const PRESETS: Record<string, string> = {
  studio:
    "Re-shoot this exact piece of jewelry as a professional product photograph: pure white seamless studio background, soft even lighting, sharp focus on every stone, no hands, no props, no text, no logos, the piece centered and filling the frame. Keep the design, metal colour and stone layout identical.",
  dark:
    "Re-shoot this exact piece of jewelry on black velvet with dramatic soft light, catching the facets. Same design, metal and stones. No hands, props, text or logos.",
  angle:
    "Show this exact piece of jewelry from a three-quarter angle, slightly above, as a luxury catalog photograph. Same design, metal colour and stone layout. Clean neutral background, no text or logos.",
  hero:
    "Create a wide, cinematic hero image of this exact piece of jewelry for a website banner: the piece to the right third of the frame on a dark, softly lit surface with room for text on the left. Same design and materials. No text or logos.",
};

async function loadSource(url: string): Promise<{ data: Buffer; mimeType: string }> {
  if (url.startsWith("/")) {
    // A file the site serves itself: /images/… from public, /uploads/… from the local store.
    const safe = path.normalize(url).replace(/^(\.\.[/\\])+/, "");
    const file = safe.startsWith("/uploads/") ? path.join(LOCAL_UPLOAD_DIR, safe.slice("/uploads/".length)) : path.join(process.cwd(), "public", safe);
    const data = await fs.readFile(file);
    const ext = path.extname(file).toLowerCase();
    return { data, mimeType: ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg" };
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch the source image (${res.status}).`);
  return {
    data: Buffer.from(await res.arrayBuffer()),
    mimeType: res.headers.get("content-type")?.split(";")[0] || "image/jpeg",
  };
}

export async function POST(request: Request) {
  if (!aiConfigured()) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not set. Add it in Vercel and redeploy." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as
    | { sourceUrl?: string; prompt?: string; preset?: string; aspectRatio?: string }
    | null;
  if (!body?.sourceUrl) return NextResponse.json({ error: "sourceUrl is required." }, { status: 400 });

  const prompt = (body.prompt?.trim() || (body.preset && PRESETS[body.preset]) || PRESETS.studio).slice(0, 2000);

  try {
    const source = await loadSource(body.sourceUrl);
    const out = await editImage({ image: source, prompt, aspectRatio: body.aspectRatio });
    if (!out) return NextResponse.json({ error: "AI is not configured." }, { status: 503 });

    const ext = out.mimeType.includes("png") ? "png" : out.mimeType.includes("webp") ? "webp" : "jpg";
    const base = body.sourceUrl.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") || "image";
    const key = objectKey("ai", `${base}-${body.preset ?? "edit"}.${ext}`);
    const url = await putObject(key, out.data, out.mimeType);

    const asset = await upsert<MediaAsset>("media", {
      url,
      key,
      kind: "image",
      name: key.split("/").pop() ?? key,
      size: out.data.length,
      contentType: out.mimeType,
      alt: "",
      origin: "ai",
    });

    return NextResponse.json(asset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed.";
    console.error("[ai/image]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
