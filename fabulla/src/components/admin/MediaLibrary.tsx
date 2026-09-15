"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch, CloudArrowUp, Copy, Trash } from "@phosphor-icons/react";
import type { MediaAsset } from "@/lib/cms/types";
import { btnOutline, btnQuiet, inputCls } from "./ui";
import { uploadFile } from "./upload";

export default function MediaLibrary({ initial }: { initial: MediaAsset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    try {
      for (const file of Array.from(files)) {
        setBusy(`Uploading ${file.name}`);
        const asset = await uploadFile(file, "media");
        setAssets((a) => [asset, ...a]);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  async function saveAlt(asset: MediaAsset, alt: string) {
    await fetch("/api/admin/media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: asset._id, alt }) });
    setAssets((a) => a.map((x) => (x._id === asset._id ? { ...x, alt } : x)));
  }

  async function remove(asset: MediaAsset) {
    if (!window.confirm(`Remove "${asset.name}" from the library? Pages still using it keep working until you replace it there.`)) return;
    await fetch(`/api/admin/media?id=${asset._id}`, { method: "DELETE" });
    setAssets((a) => a.filter((x) => x._id !== asset._id));
    router.refresh();
  }

  const shown = assets.filter((a) => !filter || `${a.name} ${a.alt} ${a.origin}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-line-2 bg-canvas px-5 py-5"
      >
        <input ref={input} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        <button type="button" onClick={() => input.current?.click()} className={btnOutline}>
          <CloudArrowUp size={14} /> Upload files
        </button>
        <span className="font-sans text-[12px] text-ink-3">or drop images and videos here</span>
        {busy && (
          <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            <CircleNotch size={13} className="animate-spin" /> {busy}
          </span>
        )}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by name" className={`${inputCls} ml-auto w-full sm:w-56`} />
      </div>
      {error && <p className="mb-4 font-sans text-[12.5px] text-rose-ink">{error}</p>}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((asset) => (
          <li key={asset._id} className="overflow-hidden rounded-2xl border border-line bg-canvas">
            <div className="relative aspect-square bg-canvas-2">
              {asset.kind === "video" ? (
                <video src={asset.url} muted controls className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.alt} className="h-full w-full object-cover" />
              )}
              {asset.origin === "ai" && <span className="absolute left-2 top-2 rounded-full bg-deep px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-on-deep">AI</span>}
            </div>
            <div className="p-3">
              <p className="truncate font-mono text-[10px] text-ink-3" title={asset.name}>
                {asset.name}
              </p>
              <input
                defaultValue={asset.alt}
                placeholder="Alt text (describe the piece)"
                onBlur={(e) => e.target.value !== asset.alt && saveAlt(asset, e.target.value)}
                className={`${inputCls} mt-2 px-2.5 py-1.5 text-[12px]`}
              />
              <div className="mt-2 flex items-center justify-between">
                <button type="button" onClick={() => navigator.clipboard.writeText(asset.url)} className={btnQuiet} title="Copy URL">
                  <Copy size={12} /> Copy URL
                </button>
                <button type="button" onClick={() => remove(asset)} className={btnQuiet} title="Remove">
                  <Trash size={12} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="font-sans text-[13px] text-ink-3">Nothing here yet.</p>}
    </div>
  );
}
