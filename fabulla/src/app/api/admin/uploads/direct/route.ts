/**
 * POST /api/admin/uploads/direct  (multipart: file, folder)
 *
 * The file passes through the server and lands wherever storage points —
 * .data/uploads locally, R2 when configured. Used when there is no presigned
 * path, and fine for anything small. Registers the asset and returns it.
 */

import { NextResponse } from "next/server";
import { upsert } from "@/lib/cms/repo";
import type { MediaAsset } from "@/lib/cms/types";
import { objectKey, putObject } from "@/lib/storage";
import { acceptable } from "../presign/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });

  const problem = acceptable(file.type, file.size);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const folder = String(form?.get("folder") ?? "media").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "media";
  const key = objectKey(folder, file.name);
  const url = await putObject(key, Buffer.from(await file.arrayBuffer()), file.type);

  const asset = await upsert<MediaAsset>("media", {
    url,
    key,
    kind: file.type.startsWith("video/") ? "video" : "image",
    name: file.name,
    size: file.size,
    contentType: file.type,
    alt: "",
    origin: "upload",
  });

  return NextResponse.json(asset);
}
