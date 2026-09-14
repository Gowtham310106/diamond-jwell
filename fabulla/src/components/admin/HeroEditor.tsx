"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "@phosphor-icons/react";
import type { HeroSlide } from "@/lib/cms/types";
import MediaPicker from "./MediaPicker";
import { btnOutline, inputCls, labelCls } from "./ui";

/**
 * Hero slides. Each slide is an image or a video with its own copy and
 * button. Serialised to one hidden JSON input.
 */
export default function HeroEditor({ name, value }: { name: string; value: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(value);

  function patch(i: number, p: Partial<HeroSlide>) {
    setSlides((s) => s.map((slide, j) => (j === i ? { ...slide, ...p } : slide)));
  }
  function move(i: number, dir: -1 | 1) {
    setSlides((s) => {
      const next = s.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(slides)} />
      <ul className="space-y-4">
        {slides.map((slide, i) => (
          <li key={slide.id} className={`rounded-2xl border bg-surface p-5 ${slide.enabled ? "border-line" : "border-dashed border-line-2 opacity-70"}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
                Slide {i + 1}
                {!slide.enabled && " · hidden"}
              </p>
              <div className="flex items-center gap-1">
                <label className="mr-3 flex items-center gap-2 font-sans text-[12px] text-ink-2">
                  <input type="checkbox" checked={slide.enabled} onChange={(e) => patch(i, { enabled: e.target.checked })} className="accent-[#a45656]" />
                  Shown
                </label>
                <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 text-ink-3 hover:text-ink">
                  <ArrowUp size={13} />
                </button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 text-ink-3 hover:text-ink">
                  <ArrowDown size={13} />
                </button>
                <button type="button" onClick={() => setSlides((s) => s.filter((_, j) => j !== i))} aria-label="Remove slide" className="rounded p-1 text-ink-3 hover:text-rose-ink">
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[260px_1fr]">
              <div className="space-y-4">
                <div>
                  <span className={labelCls}>Media type</span>
                  <div className="mt-1.5 flex gap-2">
                    {(["image", "video"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => patch(i, { kind: k, src: "" })}
                        className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${slide.kind === k ? "border-rose bg-rose-soft text-ink" : "border-line-2 text-ink-2"}`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
                <MediaPicker
                  name={`hero_src_${i}`}
                  withInput={false}
                  value={slide.src ? [slide.src] : []}
                  accept={slide.kind}
                  folder="hero"
                  label={slide.kind === "video" ? "Video (MP4, under 80MB)" : "Image"}
                  onChange={(urls) => patch(i, { src: urls[0] ?? "" })}
                />
                {slide.kind === "video" && (
                  <MediaPicker
                    name={`hero_poster_${i}`}
                    withInput={false}
                    value={slide.poster ? [slide.poster] : []}
                    accept="image"
                    folder="hero"
                    label="Poster still (shown while the video loads)"
                    onChange={(urls) => patch(i, { poster: urls[0] ?? "" })}
                  />
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Eyebrow</span>
                  <input value={slide.eyebrow} onChange={(e) => patch(i, { eyebrow: e.target.value })} className={`${inputCls} mt-1.5`} placeholder="Signature" />
                </label>
                <label className="block">
                  <span className={labelCls}>Title</span>
                  <input value={slide.title} onChange={(e) => patch(i, { title: e.target.value })} className={`${inputCls} mt-1.5`} placeholder="The Engagement Edit" />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelCls}>Description</span>
                  <textarea value={slide.description} onChange={(e) => patch(i, { description: e.target.value })} className={`${inputCls} mt-1.5 min-h-[64px]`} />
                </label>
                <label className="block">
                  <span className={labelCls}>Button label</span>
                  <input value={slide.ctaLabel} onChange={(e) => patch(i, { ctaLabel: e.target.value })} className={`${inputCls} mt-1.5`} placeholder="Explore collection" />
                </label>
                <label className="block">
                  <span className={labelCls}>Button link</span>
                  <input value={slide.ctaHref} onChange={(e) => patch(i, { ctaHref: e.target.value })} className={`${inputCls} mt-1.5`} placeholder="/products?category=rings" />
                </label>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {slides.length < 8 && (
        <button
          type="button"
          onClick={() =>
            setSlides((s) => [
              ...s,
              { id: `hero_${Date.now().toString(36)}`, kind: "image", src: "", poster: "", eyebrow: "", title: "", description: "", ctaLabel: "Explore collection", ctaHref: "/products", enabled: true },
            ])
          }
          className={`${btnOutline} mt-4`}
        >
          <Plus size={13} /> Add slide
        </button>
      )}
    </div>
  );
}
