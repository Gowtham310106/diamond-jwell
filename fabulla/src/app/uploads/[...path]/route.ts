/**
 * GET /uploads/<key>
 *
 * Serves the local-storage fallback. When Cloudflare R2 is configured every
 * upload URL is an https link to the bucket and this route never runs; without
 * it, files live in .data/uploads and this streams them with the right type.
 * public/ is not used because Next only serves public files that existed at
 * build time.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { LOCAL_UPLOAD_DIR } from "@/lib/storage";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(_request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const key = parts.join("/");
  const file = path.resolve(LOCAL_UPLOAD_DIR, key);

  // Never leave the upload directory, whatever the URL says.
  if (!file.startsWith(path.resolve(LOCAL_UPLOAD_DIR) + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(file);
    const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
