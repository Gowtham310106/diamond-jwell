"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, InstagramLogo, Play, X, ArrowUpRight } from "@phosphor-icons/react";
import type { Highlight } from "@/lib/cms/types";
import { igHref } from "@/lib/site";

/**
 * Instagram highlights on a 3D coverflow. Highlights are shot 9:16, exactly
 * the card ratio the carousel wants, and the circular tray above doubles as
 * the navigation.
 *
 * Each highlight handles both data states: with no video the card is a still
 * that opens the profile and shows no play affordance; with a video (set in
 * the admin) the same card becomes a player.
 */

const AUTO_MS = 4500;

export default function InstagramHighlights({ title, subtitle, highlights, instagram }: { title: string; subtitle?: string; highlights: Highlight[]; instagram: string }) {
  const items = highlights.filter((h) => h.cover);
  const [index, setIndex] = useState(items.length > 1 ? 1 : 0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const total = items.length;
  const open = items.find((h) => h.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);
  const go = useCallback((dir: 1 | -1) => setIndex((i) => (total ? (i + dir + total) % total : 0)), [total]);

  useEffect(() => {
    if (reduce || paused || openId || total < 2) return;
    const t = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(t);
  }, [go, paused, reduce, openId, total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (total === 0) return null;

  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const profile = igHref(instagram);

  return (
    <section className="bg-canvas-2 py-16 md:py-20" aria-labelledby="highlights-heading" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center md:mb-11">
          <h2 id="highlights-heading" className="display text-[clamp(2rem,4vw,3rem)] text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
        </div>

        <div className="rail mb-10 flex justify-start gap-6 overflow-x-auto pb-1 sm:justify-center sm:gap-9">
          {items.map((h, i) => (
            <button key={h.id} type="button" onClick={() => setIndex(i)} aria-label={`Show ${h.title}`} aria-current={i === index} className="group flex w-[74px] shrink-0 flex-col items-center gap-2.5 sm:w-[88px]">
              <span className={`relative block h-[60px] w-[60px] rounded-full p-[2.5px] transition-all duration-500 sm:h-[70px] sm:w-[70px] ${i === index ? "bg-gradient-to-tr from-rose via-gold to-rose-soft" : "bg-line-2 group-hover:bg-rose"}`}>
                <span className="relative block h-full w-full overflow-hidden rounded-full border-2 border-canvas-2">
                  <Image src={h.cover} alt="" fill sizes="70px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </span>
              </span>
              <span className={`text-center font-sans text-[10.5px] leading-tight transition-colors ${i === index ? "font-semibold text-ink" : "text-ink-3"}`}>{h.title}</span>
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center" style={{ minHeight: 470 }}>
          <button type="button" onClick={() => go(-1)} aria-label="Previous highlight" className="absolute left-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-surface text-ink transition-all hover:border-rose hover:shadow-md md:left-6">
            <CaretLeft size={16} weight="light" />
          </button>

          <div className="relative flex h-[440px] w-full items-center justify-center">
            {items.map((h, i) => {
              const offset = offsetOf(i);
              const abs = Math.abs(offset);
              if (abs > 2) return null;
              const isCenter = offset === 0;
              const scale = isCenter ? 1 : abs === 1 ? 0.82 : 0.64;
              const x = offset * (abs === 1 ? 172 : 262);
              const z = isCenter ? 20 : abs === 1 ? 10 : 5;
              const opacity = isCenter ? 1 : abs === 1 ? 0.72 : 0.4;
              const blur = isCenter ? 0 : abs === 1 ? 1 : 3;
              return (
                <div
                  key={h.id}
                  className="absolute"
                  style={{ transform: `translateX(${x}px) scale(${scale})`, zIndex: z, opacity, filter: `blur(${blur}px)`, transition: reduce ? "none" : "transform .7s cubic-bezier(.16,1,.3,1), opacity .7s, filter .7s" }}
                  aria-hidden={!isCenter}
                >
                  <Card highlight={h} interactive={isCenter} profile={profile} onOpen={() => (h.video ? setOpenId(h.id) : undefined)} onFocusCard={() => setIndex(i)} />
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => go(1)} aria-label="Next highlight" className="absolute right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-surface text-ink transition-all hover:border-rose hover:shadow-md md:right-6">
            <CaretRight size={16} weight="light" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <a href={profile} target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-2.5 rounded-full border border-line-2 px-6 py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-rose hover:text-rose-ink">
            <InstagramLogo size={15} weight="light" />
            {instagram}
            <ArrowUpRight size={12} weight="light" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {open && open.video && (
          <motion.div className="fixed inset-0 z-[3000] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }} role="dialog" aria-modal="true" aria-label={`${open.title} highlight`}>
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={close} />
            <motion.div className="relative aspect-[9/16] h-[min(84vh,740px)] overflow-hidden rounded-2xl border border-line-2 bg-ink" initial={reduce ? false : { scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={reduce ? undefined : { scale: 0.96, y: 12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <video key={open.id} src={open.video} poster={open.cover} controls autoPlay playsInline className="h-full w-full object-cover" />
            </motion.div>
            <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-rose hover:text-rose">
              <X size={18} weight="light" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Card({ highlight, interactive, profile, onOpen, onFocusCard }: { highlight: Highlight; interactive: boolean; profile: string; onOpen: () => void; onFocusCard: () => void }) {
  const body = (
    <>
      <Image src={highlight.cover} alt={`${highlight.title} from the studio`} fill sizes="248px" className="object-cover" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
      {highlight.video && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/35 backdrop-blur-sm transition-all duration-300 group-hover:border-rose group-hover:bg-black/55">
            <Play size={18} weight="fill" className="ml-0.5 text-white" />
          </span>
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 p-4 text-left">
        <span className="block font-sans text-[13.5px] font-semibold text-white">{highlight.title}</span>
        <span className="mt-1 block font-sans text-[11.5px] leading-snug text-white/80">{highlight.caption}</span>
      </span>
    </>
  );

  const cls = "group relative block h-[420px] w-[236px] overflow-hidden rounded-2xl border border-line-2 shadow-[0_18px_40px_rgba(15,23,42,0.22)]";

  if (!interactive) {
    return (
      <div className={cls} aria-hidden="true">
        {body}
      </div>
    );
  }

  return highlight.video ? (
    <button type="button" onClick={onOpen} onFocus={onFocusCard} className={cls}>
      {body}
    </button>
  ) : (
    <a href={profile} target="_blank" rel="noreferrer noopener" onFocus={onFocusCard} className={cls}>
      {body}
    </a>
  );
}
