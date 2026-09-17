"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react";
import type { HeroSlide } from "@/lib/cms/types";

/**
 * Hero carousel: full-bleed art, an editorial block on the left, arrows and
 * dots. Slides come from the admin panel and can be a still or a muted,
 * looping MP4 with a poster.
 *
 *  - Only the headline block is a link, so the arrows are ordinary buttons.
 *  - Autoplay pauses on hover and on focus, and stops under
 *    prefers-reduced-motion, instead of advancing under the reader.
 *  - The slide region is announced as a group with live-region politeness so
 *    screen readers are not spammed on every rotation.
 */
const INTERVAL = 6000;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = slides.length;
  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    timer.current = setInterval(() => go(1), INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go, paused, reduce, count]);

  if (count === 0) return null;
  const slide = slides[index] ?? slides[0];

  return (
    <section
      className="relative h-[440px] w-full overflow-hidden border-b border-line bg-deep sm:h-[520px] lg:h-[600px]"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {slide.kind === "video" && slide.src ? (
            <video
              key={slide.src}
              autoPlay
              muted
              loop
              playsInline
              poster={slide.poster || undefined}
              preload={index === 0 ? "auto" : "metadata"}
              aria-hidden="true"
              className="h-full w-full object-cover"
            >
              <source src={slide.src} />
            </video>
          ) : slide.src ? (
            <>
              {/* Desktop / Tablet: Wide 16:9 banner */}
              <div className="hidden sm:block absolute inset-0">
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                  className="object-cover object-right lg:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Mobile: 1:1 product shot so the full piece is clearly visible on narrow viewports */}
              <div className="block sm:hidden absolute inset-0 bg-deep">
                <Image
                  src={
                    slide.mobileSrc ||
                    slide.src.replace(/hero\.(png|webp)$/i, "front-white.$1")
                  }
                  alt=""
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain object-right-bottom scale-90 translate-y-6 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              </div>
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-5 sm:px-8 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="max-w-xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            aria-live="polite"
          >
            {slide.eyebrow && (
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                {slide.eyebrow}
              </span>
            )}
            <h2 className="display mt-5 text-[clamp(2.25rem,5.5vw,4rem)] text-white drop-shadow">{slide.title}</h2>
            {slide.description && <p className="mt-4 max-w-md font-sans text-[14px] leading-relaxed text-white/85">{slide.description}</p>}
            {slide.ctaHref && (
              <Link href={slide.ctaHref} className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-rose px-7 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-on-rose transition-colors duration-300 hover:bg-rose-soft">
                {slide.ctaLabel || "Explore"}
                <ArrowRight size={13} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:border-rose hover:bg-rose hover:text-on-rose">
            <CaretLeft size={16} weight="light" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:border-rose hover:bg-rose hover:text-on-rose">
            <CaretRight size={16} weight="light" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${b.title}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-400 ${i === index ? "w-7 bg-rose" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
