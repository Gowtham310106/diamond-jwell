"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import type { HomeSection } from "@/lib/cms/types";
import { inputCls } from "./ui";

const LABELS: Record<HomeSection["key"], string> = {
  hero: "Hero slides",
  categories: "Shop by category",
  collections: "Featured collections",
  newArrivals: "New arrivals row",
  bestSellers: "Best sellers row",
  highlights: "Instagram highlights",
  assurance: "Assurance badges",
  campaign: "Campaign card + featured grid",
  craftsmanship: "Craftsmanship",
  testimonials: "Testimonials",
  faq: "FAQ",
  closing: "Closing call to action",
};

/** Order and switch the homepage sections; titles for the ones that carry a heading. */
export default function SectionsEditor({ name, value }: { name: string; value: HomeSection[] }) {
  const [sections, setSections] = useState<HomeSection[]>(value);

  function patch(i: number, p: Partial<HomeSection>) {
    setSections((s) => s.map((x, j) => (j === i ? { ...x, ...p } : x)));
  }
  function move(i: number, dir: -1 | 1) {
    setSections((s) => {
      const next = s.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(sections)} />
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {sections.map((s, i) => (
          <li key={s.key} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${s.enabled ? "" : "opacity-60"}`}>
            <label className="flex w-52 shrink-0 items-center gap-2.5 font-sans text-[13px] text-ink">
              <input type="checkbox" checked={s.enabled} onChange={(e) => patch(i, { enabled: e.target.checked })} className="accent-[#a45656]" />
              {LABELS[s.key] ?? s.key}
            </label>
            {["hero", "campaign", "craftsmanship", "closing"].includes(s.key) ? (
              <span className="flex-1 font-sans text-[11.5px] text-ink-3">Copy for this section is edited below or in Settings.</span>
            ) : (
              <span className="flex flex-1 flex-wrap gap-2">
                <input value={s.title} onChange={(e) => patch(i, { title: e.target.value })} placeholder="Heading" aria-label="Heading" className={`${inputCls} min-w-[160px] flex-1`} />
                <input value={s.subtitle} onChange={(e) => patch(i, { subtitle: e.target.value })} placeholder="Small line under it" aria-label="Subtitle" className={`${inputCls} min-w-[160px] flex-1`} />
              </span>
            )}
            <span className="flex gap-0.5">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 text-ink-3 hover:text-ink">
                <ArrowUp size={13} />
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 text-ink-3 hover:text-ink">
                <ArrowDown size={13} />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
