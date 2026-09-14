"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "@phosphor-icons/react";

export type NavEntry = {
  id: string;
  name: string;
  image: string;
  children: { name: string; href: string }[];
  bannerImage: string;
  bannerTitle: string;
  bannerHref: string;
};

/**
 * Circular category nav with a full-width mega-menu.
 *
 * Hover opens on pointer devices with a close delay so the cursor can travel
 * from the circle into the panel, tap toggles on touch, and the panel spans
 * the whole container rather than the circle (which is why .cat-item is
 * position:static in CSS). The pointer test happens once, and the panel is
 * closable with Escape, so it is reachable and dismissable by keyboard.
 *
 * Entries are built by the header from the CMS categories.
 */
export default function CategoryNav({ entries, compact }: { entries: NavEntry[]; compact: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = entries.find((c) => c.id === openId) ?? null;

  const canHover = useCallback(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), 180);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <div
      ref={rootRef}
      className="megamenu w-full border-b border-line bg-canvas/95 backdrop-blur-sm"
      onMouseLeave={() => {
        if (!canHover()) return;
        scheduleClose();
      }}
    >
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <ul className="firstlevel-menu">
          {entries.map((cat) => (
            <li
              key={cat.id}
              className={`cat-item ${openId === cat.id ? "cat-item--active" : ""}`}
              onMouseEnter={() => {
                if (!canHover()) return;
                cancelClose();
                setOpenId(cat.id);
              }}
            >
              <button type="button" className="cat-trigger" aria-expanded={openId === cat.id} aria-haspopup="true" onClick={() => setOpenId((id) => (id === cat.id ? null : cat.id))}>
                <span className="cat-ring" style={compact ? { width: 44, height: 44, transition: "all .35s" } : undefined}>
                  <span className="cat-ring__img">
                    {cat.image && <Image src={cat.image} alt="" width={80} height={80} className="h-full w-full object-cover" />}
                  </span>
                </span>
                {!compact && <span className="cat-label">{cat.name}</span>}
              </button>
            </li>
          ))}
        </ul>

        {active && (
          <div
            className="absolute inset-x-0 top-full z-[2100] px-0 pt-1.5 sm:px-6 lg:px-8"
            onMouseEnter={cancelClose}
            onMouseLeave={() => {
              if (!canHover()) return;
              scheduleClose();
            }}
          >
            <div className="flex max-h-[78vh] flex-col overflow-y-auto border border-line bg-surface shadow-[0_24px_60px_rgba(15,23,42,0.14)] sm:max-h-none sm:flex-row sm:overflow-visible sm:rounded-2xl">
              <button type="button" onClick={() => setOpenId(null)} className="flex w-full items-center justify-between border-b border-line bg-canvas px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-ink sm:hidden">
                {active.name}
                <X size={16} weight="light" />
              </button>

              <div className="flex-1 p-5 md:p-8">
                <h3 className="mb-5 hidden border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3 sm:block">Shop {active.name}</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-y-4">
                  {active.children.map((child) => (
                    <li key={child.name + child.href}>
                      <Link href={child.href} onClick={() => setOpenId(null)} className="group/item flex items-center gap-2.5 py-1 text-left">
                        <span className="h-[3px] w-[3px] rounded-full bg-gold transition-all duration-300 group-hover/item:w-3" />
                        <span className="font-sans text-[13px] text-ink-2 transition-colors group-hover/item:text-ink">{child.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col justify-between border-t border-line bg-canvas p-5 sm:w-72 sm:border-l sm:border-t-0 md:p-6">
                <div className="space-y-4">
                  <Link href={active.bannerHref} onClick={() => setOpenId(null)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-line">
                    {active.bannerImage && <Image src={active.bannerImage} alt="" fill sizes="288px" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                  </Link>
                  <p className="display text-[19px] leading-snug text-ink">{active.bannerTitle}</p>
                </div>
                <Link href={active.bannerHref} onClick={() => setOpenId(null)} className="group mt-5 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.18em] text-rose-ink">
                  Explore
                  <ArrowRight size={12} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
