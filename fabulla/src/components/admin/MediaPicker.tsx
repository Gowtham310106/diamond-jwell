"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleNotch,
  CloudArrowUp,
  Images,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { ANGLE_SET, PRESET_LABELS } from "@/lib/ai-prompts";
import type { MediaAsset } from "@/lib/cms/types";
import { btnOutline, btnQuiet, inputCls } from "./ui";
import { isVideo, uploadFile } from "./upload";

/**
 * The one media control every admin form uses.
 *
 * Holds an ordered list of URLs in a hidden input (JSON) and offers three
 * ways to fill it: drop or pick files (uploaded straight to storage), choose
 * from the library, or generate an AI variant of an existing image with
 * Gemini. Generated images are added as candidates next to the original and
 * the admin decides which stays.
 */

type Props = {
  name: string;
  value: string[];
  multiple?: boolean;
  accept?: "image" | "video" | "both";
  folder?: string;
  label?: string;
  /** Lift the list to a parent editor that serialises it itself. */
  onChange?: (urls: string[]) => void;
  /** Set false when a parent owns the form field. */
  withInput?: boolean;
};

const AI_PRESETS = Object.entries(PRESET_LABELS).map(([key, label]) => ({ key, label }));

export default function MediaPicker({ name, value, multiple = false, accept = "image", folder = "media", label, onChange, withInput = true }: Props) {
  const [urls, setUrls] = useState<string[]>(value);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<MediaAsset[] | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [aiFor, setAiFor] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResults, setAiResults] = useState<MediaAsset[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  // Sync from props by content, not identity: a parent that rebuilds the
  // array every render (the hero editor does) must not restart this.
  const valueKey = value.join("\n");
  useEffect(() => {
    setUrls((current) => (current.join("\n") === valueKey ? current : valueKey ? valueKey.split("\n") : []));
  }, [valueKey]);

  /** Every user-driven change goes through here, so the parent hears about exactly those. */
  function update(fn: (current: string[]) => string[]) {
    setUrls((current) => {
      const next = fn(current);
      if (next !== current) queueMicrotask(() => onChange?.(next));
      return next;
    });
  }

  const mime = accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";

  function add(next: string[]) {
    update((current) => (multiple ? [...current, ...next.filter((u) => !current.includes(u))] : next.slice(0, 1)));
  }

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    if (!list.length) return;
    try {
      const added: string[] = [];
      for (const file of multiple ? list : list.slice(0, 1)) {
        setBusy(`Uploading ${file.name}`);
        setProgress(0);
        const asset = await uploadFile(file, folder, setProgress);
        added.push(asset.url);
      }
      add(added);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  async function openLibrary() {
    setShowLibrary(true);
    if (library) return;
    const res = await fetch(`/api/admin/media?kind=${accept === "both" ? "" : accept}`);
    setLibrary(((await res.json()) as MediaAsset[]) ?? []);
  }

  async function generate(preset: string): Promise<MediaAsset> {
    const res = await fetch("/api/admin/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceUrl: aiFor, preset, prompt: aiPrompt || undefined }),
    });
    const data = (await res.json()) as MediaAsset | { error: string };
    if ("error" in data) throw new Error(data.error);
    return data;
  }

  async function runAi(preset: string) {
    if (!aiFor) return;
    setError(null);
    setBusy("Generating with Gemini — 10 to 30 seconds");
    try {
      const asset = await generate(preset);
      setAiResults((r) => [asset, ...r]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setBusy(null);
    }
  }

  /**
   * One press, four angles: front, three-quarter, profile, macro. Runs them
   * one after another so a slow model does not fan out into four parallel
   * requests, and keeps whatever finished if a later one fails.
   */
  async function runAngleSet() {
    if (!aiFor) return;
    setError(null);
    try {
      let n = 0;
      for (const preset of ANGLE_SET) {
        n += 1;
        setBusy(`Angle ${n} of ${ANGLE_SET.length}: ${PRESET_LABELS[preset]} — about 20 seconds each`);
        const asset = await generate(preset);
        setAiResults((r) => [...r, asset]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed part-way; the angles that finished are below.");
    } finally {
      setBusy(null);
    }
  }

  function move(i: number, dir: -1 | 1) {
    update((current) => {
      const next = current.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return current;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      {label && <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">{label}</p>}
      {withInput && <input type="hidden" name={name} value={JSON.stringify(urls)} />}

      {urls.length > 0 && (
        <ul className={`grid gap-3 ${multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 sm:max-w-xs"}`}>
          {urls.map((url, i) => (
            <li key={url + i} className="group relative overflow-hidden rounded-xl border border-line bg-surface">
              <div className="relative aspect-square bg-canvas-2">
                {isVideo(url) ? (
                  <video src={url} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  // Plain img: admin thumbnails do not need the optimizer pipeline.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                )}
                {i === 0 && multiple && (
                  <span className="absolute left-2 top-2 rounded-full bg-deep px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-on-deep">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <div className="flex gap-1">
                  {multiple && (
                    <>
                      <button type="button" onClick={() => move(i, -1)} aria-label="Move earlier" className="rounded p-1 text-ink-3 hover:text-ink">
                        <ArrowLeft size={13} />
                      </button>
                      <button type="button" onClick={() => move(i, 1)} aria-label="Move later" className="rounded p-1 text-ink-3 hover:text-ink">
                        <ArrowRight size={13} />
                      </button>
                    </>
                  )}
                  {!isVideo(url) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAiFor(url);
                        setAiResults([]);
                        setAiPrompt("");
                      }}
                      title="Generate a variant with AI"
                      className="rounded p-1 text-ink-3 hover:text-rose-ink"
                    >
                      <Sparkle size={13} />
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => update((c) => c.filter((_, j) => j !== i))} aria-label="Remove" className="rounded p-1 text-ink-3 hover:text-rose-ink">
                  <X size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(multiple || urls.length === 0) && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-line-2 px-4 py-4"
        >
          <input ref={fileInput} type="file" accept={mime} multiple={multiple} hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <button type="button" onClick={() => fileInput.current?.click()} className={btnOutline}>
            <CloudArrowUp size={14} /> Upload {accept === "video" ? "video" : accept === "both" ? "file" : "image"}
          </button>
          <button type="button" onClick={openLibrary} className={btnQuiet}>
            <Images size={13} /> From library
          </button>
          <span className="font-sans text-[11.5px] text-ink-3">or drop files here</span>
        </div>
      )}

      {busy && (
        <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
          <CircleNotch size={13} className="animate-spin" /> {busy}
          {progress > 0 && progress < 1 && ` · ${Math.round(progress * 100)}%`}
        </p>
      )}
      {error && <p className="mt-3 font-sans text-[12.5px] text-rose-ink" role="alert">{error}</p>}

      {/* Library */}
      {showLibrary && (
        <div className="mt-3 rounded-xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Media library</p>
            <button type="button" onClick={() => setShowLibrary(false)} className={btnQuiet}>
              Close
            </button>
          </div>
          {!library ? (
            <p className="font-sans text-[12px] text-ink-3">Loading…</p>
          ) : library.length === 0 ? (
            <p className="font-sans text-[12px] text-ink-3">Nothing uploaded yet.</p>
          ) : (
            <ul className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5 md:grid-cols-6">
              {library.map((asset) => (
                <li key={asset._id}>
                  <button
                    type="button"
                    onClick={() => {
                      add([asset.url]);
                      if (!multiple) setShowLibrary(false);
                    }}
                    className="block aspect-square w-full overflow-hidden rounded-lg border border-line bg-canvas-2 hover:border-rose"
                    title={asset.name}
                  >
                    {asset.kind === "video" ? (
                      <video src={asset.url} muted className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.url} alt={asset.alt} className="h-full w-full object-cover" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* AI variant */}
      {aiFor && (
        <div className="mt-3 rounded-xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
              <Sparkle size={12} className="text-rose-ink" /> Generate a variant with Gemini
            </p>
            <button type="button" onClick={() => setAiFor(null)} className={btnQuiet}>
              Close
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aiFor} alt="" className="aspect-square w-full rounded-lg object-cover" />
            <div>
              {multiple && (
                <button type="button" disabled={Boolean(busy)} onClick={runAngleSet} className={`${btnOutline} border-rose text-rose-ink`}>
                  <Sparkle size={13} weight="fill" /> Generate angle set (front, ¾, profile, macro)
                </button>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {AI_PRESETS.map((p) => (
                  <button key={p.key} type="button" disabled={Boolean(busy)} onClick={() => runAi(p.key)} className={btnOutline}>
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Or describe the shot yourself (angle, surface, light) and press any button. The piece itself is always kept identical."
                className={`${inputCls} mt-3 min-h-[64px]`}
              />
              {aiResults.length > 0 && (
                <div className="mt-3">
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {aiResults.map((asset) => (
                      <li key={asset._id} className="overflow-hidden rounded-lg border border-line">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.url} alt="" className="aspect-square w-full object-cover" />
                        <button type="button" disabled={urls.includes(asset.url)} onClick={() => add([asset.url])} className="block w-full px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-rose-ink hover:bg-canvas-2 disabled:text-ink-3">
                          {urls.includes(asset.url) ? "Added" : multiple ? "Add to images" : "Use this image"}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center gap-3">
                    {multiple && aiResults.some((a) => !urls.includes(a.url)) && (
                      <button type="button" onClick={() => add(aiResults.map((a) => a.url))} className={btnQuiet}>
                        Add all
                      </button>
                    )}
                    <p className="font-sans text-[11.5px] text-ink-3">Every result is saved to the media library either way, so nothing is lost.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
