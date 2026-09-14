/**
 * POST /api/admin/uploads/presign
 *
 * Body: { filename, contentType, size, folder }
 * Reply: { mode: "r2", uploadUrl, publicUrl, key } — PUT the file at uploadUrl,
 *        then register it with POST /api/admin/media.
 *        { mode: "local" } — R2 is not configured; send the file to
 *        /api/admin/uploads/direct instead.
 */

import { NextResponse } from "next/server";
import { objectKey, presignUpload } from "@/lib/storage";

export const runtime = "nodejs";

export const MAX_IMAGE = 15 * 1024 * 1024;
export const MAX_VIDEO = 80 * 1024 * 1024;

export function acceptable(contentType: string, size: number): string | null {
  if (contentType.startsWith("image/")) return size <= MAX_IMAGE ? null : "Images must be under 15MB.";
  if (contentType.startsWith("video/")) return size <= MAX_VIDEO ? null : "Videos must be under 80MB.";
  return "Only images and videos can be uploaded.";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { filename?: string; contentType?: string; size?: number; folder?: string }
    | null;

  if (!body?.filename || !body.contentType || typeof body.size !== "number") {
    return NextResponse.json({ error: "filename, contentType and size are required." }, { status: 400 });
  }

  const problem = acceptable(body.contentType, body.size);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const folder = (body.folder ?? "media").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "media";
  const key = objectKey(folder, body.filename);
  const result = await presignUpload(key, body.contentType);
  return NextResponse.json(result);
}
