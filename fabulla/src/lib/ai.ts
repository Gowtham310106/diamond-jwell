/**
 * Gemini.
 *
 * Two uses, one key (GEMINI_API_KEY):
 *
 *   chat    the concierge, grounded in the studio's settings, catalog and FAQs.
 *   image   the admin "enhance" button: an existing product photo in, a cleaner
 *           or re-angled version out. Generated files go to storage like any
 *           other upload and the admin picks which to keep.
 *
 * Model ids are env-overridable because Google rotates them faster than a
 * jewellery site is redeployed. Defaults are the current stable ids; the admin
 * Integrations page lists what the key can actually see.
 */

import { GoogleGenAI, type Content, type Part } from "@google/genai";

export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-3.8-flash";
export const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

function client(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

export function aiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export type ChatInput = {
  system: string;
  turns: { role: "user" | "assistant"; content: string }[];
  maxOutputTokens?: number;
};

/** Returns null when no key is configured; throws on an upstream failure. */
export async function chat(input: ChatInput): Promise<string | null> {
  const ai = client();
  if (!ai) return null;

  const contents: Content[] = input.turns.map((t) => ({
    role: t.role === "user" ? "user" : "model",
    parts: [{ text: t.content }],
  }));

  const response = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents,
    config: {
      systemInstruction: input.system,
      maxOutputTokens: input.maxOutputTokens ?? 700,
      temperature: 0.4,
    },
  });

  return response.text?.trim() || "";
}

export type ImageEdit = {
  /** Source photo. */
  image: { data: Buffer; mimeType: string };
  prompt: string;
  aspectRatio?: string;
};

export type GeneratedImage = { data: Buffer; mimeType: string };

/** Returns null when no key is configured; throws on an upstream failure. */
export async function editImage(input: ImageEdit): Promise<GeneratedImage | null> {
  const ai = client();
  if (!ai) return null;

  const parts: Part[] = [
    { inlineData: { mimeType: input.image.mimeType, data: input.image.data.toString("base64") } },
    { text: input.prompt },
  ];

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: input.aspectRatio ? { aspectRatio: input.aspectRatio } : undefined,
    },
  });

  for (const candidate of response.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData?.data) {
        return {
          data: Buffer.from(part.inlineData.data, "base64"),
          mimeType: part.inlineData.mimeType || "image/png",
        };
      }
    }
  }

  throw new Error("The model returned no image. Try a more specific prompt.");
}

export async function pingAi(): Promise<{ ok: boolean; detail: string; models: string[] }> {
  const ai = client();
  if (!ai) return { ok: false, detail: "GEMINI_API_KEY not set", models: [] };
  try {
    const pager = await ai.models.list();
    const names: string[] = [];
    for await (const m of pager) {
      if (m.name) names.push(m.name.replace(/^models\//, ""));
      if (names.length >= 60) break;
    }
    const haveChat = names.includes(CHAT_MODEL);
    const haveImage = names.includes(IMAGE_MODEL);
    const missing = [!haveChat && `chat model "${CHAT_MODEL}"`, !haveImage && `image model "${IMAGE_MODEL}"`]
      .filter(Boolean)
      .join(" and ");
    return {
      ok: !missing,
      detail: missing ? `Key works, but ${missing} not visible to it. Set GEMINI_CHAT_MODEL / GEMINI_IMAGE_MODEL to one listed below.` : `chat ${CHAT_MODEL} · image ${IMAGE_MODEL}`,
      models: names,
    };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error), models: [] };
  }
}
