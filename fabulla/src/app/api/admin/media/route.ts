/**
 * Media registry.
 *
 * GET    list the library
 * POST   register an object that was uploaded straight to R2 via a presigned URL
 * PATCH  update alt text
 * DELETE remove from the registry (the object itself stays in the bucket; a
 *        product may still reference the URL, and storage is cheap next to a
 *        broken image)
 */

import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";
import { listMedia, remove, upsert } from "@/lib/cms/repo";
import type { MediaAsset } from "@/lib/cms/types";

export const runtime = "nodejs";

/** GET ?kind=image|video — the library, newest first. */
export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const all = await listMedia();
  return NextResponse.json(kind ? all.filter((m) => m.kind === kind) : all);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<MediaAsset> | null;
  if (!body?.url || !body.key || !body.contentType) {
    return NextResponse.json({ error: "url, key and contentType are required." }, { status: 400 });
  }
  const asset = await upsert<MediaAsset>("media", {
    url: body.url,
    key: body.key,
    kind: body.contentType.startsWith("video/") ? "video" : "image",
    name: body.name ?? body.key.split("/").pop() ?? "file",
    size: body.size ?? 0,
    contentType: body.contentType,
    alt: body.alt ?? "",
    origin: "upload",
  });
  return NextResponse.json(asset);
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string; alt?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  const asset = await getStore().get("media", body.id);
  if (!asset) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const next = await upsert<MediaAsset>("media", { ...asset, alt: body.alt ?? asset.alt });
  return NextResponse.json(next);
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
  await remove("media", id);
  return NextResponse.json({ ok: true });
}
