"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, Play } from "@phosphor-icons/react";

/**
 * Product gallery: one large plate with every image stacked behind it and
 * cross-faded, arrows on hover, a counter, swipe on touch, arrow keys when
 * the plate has focus, thumbnails beneath, and an optional video as the last
 * slide. No autoplay: on a product page the visitor is looking, not browsing.
 *
 * Images are all mounted so a step never waits on the network; the video is
 * mounted only while it is the active slide, so it does not download or
 * play behind a picture.
 */

type Item = { kind: "image"; src: string } | { kind: "video"; src: string };

const SWIPE_PX = 40;

export default function ProductGallery({ images, video, name }: { images: string[]; video: string; name: string }) {
  const items: Item[] = [...images.map((src) => ({ kind: "image" as const, src })), ...(video ? [{ kind: "video" as const, src: video }] : [])];
  const count = items.length;
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const thumbs = useRef<HTMLUListElement>(null);

  const go = useCallback((to: number) => setActive(((to % count) + count) % count), [count]);
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // Keep the active thumbnail in view when the strip overflows.
  useEffect(() => {
    thumbs.current?.children[active]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  if (count === 0) {
    return <div className="aspect-[4/5] rounded-2xl border border-line bg-canvas-2" />;
  }

  const current = items[active] ?? items[0];

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
        tabIndex={count > 1 ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); next(); }
          if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
        }}
        onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < SWIPE_PX) return;
          if (dx < 0) next(); else prev();
        }}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-canvas-2 outline-none focus-visible:ring-2 focus-visible:ring-rose"
      >
        {items.map((item, i) =>
          item.kind === "image" ? (
            <Image
              key={item.src + i}
              src={item.src}
              alt={i === active ? `${name} by Fabulla Diamonds Co., view ${i + 1} of ${count}` : ""}
              fill
              priority={i === 0}
              quality={90}
              sizes="(max-width: 1024px) 100vw, 55vw"
              aria-hidden={i !== active}
              className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ) : (
            i === active && (
              <video key={item.src} src={item.src} controls autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
            )
          )
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
            >
              <CaretRight size={18} weight="bold" />
            </button>
            <span
              aria-live="polite"
              className={`absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white backdrop-blur-sm ${current.kind === "video" ? "hidden" : ""}`}
            >
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul ref={thumbs} className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <li key={item.src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={item.kind === "video" ? "Play video" : `View image ${i + 1}`}
                aria-current={i === active}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border transition-colors ${i === active ? "border-rose" : "border-line hover:border-line-2"}`}
              >
                {item.kind === "video" ? (
                  <span className="flex h-full w-full items-center justify-center bg-deep text-on-deep">
                    <Play size={18} weight="fill" />
                  </span>
                ) : (
                  <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
