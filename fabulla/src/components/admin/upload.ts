"use client";

import type { MediaAsset } from "@/lib/cms/types";

/**
 * Browser-side upload. Asks the server how to upload: a presigned PUT straight
 * to Cloudflare R2 when configured, otherwise a multipart POST through the
 * server. Either way the result is a registered media asset.
 */
export async function uploadFile(
  file: File,
  folder: string,
  onProgress?: (fraction: number) => void
): Promise<MediaAsset> {
  const presign = await fetch("/api/admin/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, folder }),
  });
  const plan = (await presign.json()) as
    | { mode: "r2"; uploadUrl: string; publicUrl: string; key: string }
    | { mode: "local" }
    | { error: string };

  if ("error" in plan) throw new Error(plan.error);

  if (plan.mode === "r2") {
    await putWithProgress(plan.uploadUrl, file, onProgress);
    const reg = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: plan.publicUrl, key: plan.key, name: file.name, size: file.size, contentType: file.type }),
    });
    const asset = (await reg.json()) as MediaAsset | { error: string };
    if ("error" in asset) throw new Error(asset.error);
    return asset;
  }

  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const res = await fetch("/api/admin/uploads/direct", { method: "POST", body: form });
  const asset = (await res.json()) as MediaAsset | { error: string };
  if ("error" in asset) throw new Error(asset.error);
  onProgress?.(1);
  return asset;
}

function putWithProgress(url: string, file: File, onProgress?: (f: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}). Check the bucket's CORS rule allows PUT from this origin.`)));
    xhr.onerror = () => reject(new Error("Upload failed. Check the bucket's CORS rule allows PUT from this origin."));
    xhr.send(file);
  });
}

export function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}
