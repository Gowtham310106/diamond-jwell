/**
 * Media storage.
 *
 *   Cloudflare R2  when R2_* is configured. The browser uploads straight to
 *                  the bucket through a presigned PUT, so a 40MB video never
 *                  passes through a Vercel function. Server-side writes (AI
 *                  generated images) go through putObject.
 *   Local          otherwise: files land in .data/uploads and are served by
 *                  the /uploads/[...path] route (public/ is only served for
 *                  files present at build time). Works on a laptop; on
 *                  serverless the disk is ephemeral, which is why production
 *                  needs R2.
 *
 * Public URLs come from R2_PUBLIC_URL — the bucket's custom domain or its
 * r2.dev URL — so every stored `url` is a plain https link the site can render
 * with next/image.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type StorageMode = "r2" | "local";

/** Where the local fallback writes. Gitignored with the rest of .data. */
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

function r2Config(): R2Config | null {
  const {
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_BUCKET: bucket,
    R2_PUBLIC_URL: publicUrl,
  } = process.env;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/+$/, "") };
}

let client: S3Client | null = null;

function s3(config: R2Config): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return client;
}

export function storageMode(): StorageMode {
  return r2Config() ? "r2" : "local";
}

/** The host next/image must be allowed to load from. */
export function publicMediaHost(): string | null {
  const config = r2Config();
  if (!config) return null;
  try {
    return new URL(config.publicUrl).hostname;
  } catch {
    return null;
  }
}

const SAFE = /[^a-z0-9.-]+/g;

/** `products/2026/09/abcd1234-ring.jpg` — dated so a bucket listing stays readable. */
export function objectKey(folder: string, filename: string): string {
  const d = new Date();
  const stamp = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const clean = filename.toLowerCase().replace(SAFE, "-").replace(/^-+|-+$/g, "") || "file";
  const rand = crypto.randomUUID().slice(0, 8);
  return `${folder}/${stamp}/${rand}-${clean}`;
}

export type PresignedUpload = {
  mode: "r2";
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

export async function presignUpload(key: string, contentType: string): Promise<PresignedUpload | { mode: "local" }> {
  const config = r2Config();
  if (!config) return { mode: "local" };
  const uploadUrl = await getSignedUrl(
    s3(config),
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }),
    { expiresIn: 600 }
  );
  return { mode: "r2", uploadUrl, publicUrl: `${config.publicUrl}/${key}`, key };
}

/** Server-side write. Used for AI-generated images and the local fallback. */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const config = r2Config();
  if (config) {
    await s3(config).send(
      new PutObjectCommand({ Bucket: config.bucket, Key: key, Body: body, ContentType: contentType })
    );
    return `${config.publicUrl}/${key}`;
  }
  const target = path.join(LOCAL_UPLOAD_DIR, key);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body);
  return `/uploads/${key}`;
}

export async function pingStorage(): Promise<{ ok: boolean; mode: StorageMode; detail: string }> {
  const config = r2Config();
  if (!config) return { ok: true, mode: "local", detail: ".data/uploads on the server disk (set R2_* for Cloudflare)" };
  try {
    await s3(config).send(new HeadBucketCommand({ Bucket: config.bucket }));
    return { ok: true, mode: "r2", detail: `${config.bucket} → ${config.publicUrl}` };
  } catch (error) {
    return { ok: false, mode: "r2", detail: error instanceof Error ? error.message : String(error) };
  }
}
