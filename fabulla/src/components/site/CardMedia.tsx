"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The image area of a product card. One image is a plain picture; more than
 * one becomes a slideshow that runs only while the pointer is over it,
 * stepping every 900ms through up to four frames and snapping back to the
 * cover on leave. Dots show where you are. Touch screens, which have no
 * hover, get the cover and the dots as a hint that the product page has more.
 *
 * Every frame is in the DOM and stacked, so a step is an opacity change and
 * never a network wait; `next/image` lazy-loads the hidden ones like any
 * other off-screen picture.
 */

const MAX_FRAMES = 4;
const STEP_MS = 900;

export default function CardMedia({
  images,
  alt,
  sizes,
  priority = false,
  className = "relative",
}: {
  images: string[];
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Positioning of the box; the frames fill it. The card passes "absolute inset-0". */
  className?: string;
}) {
  const frames = images.slice(0, MAX_FRAMES);
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function start() {
    if (frames.length < 2 || timer.current) return;
    setActive(1);
    timer.current = setInterval(() => setActive((i) => (i + 1) % frames.length), STEP_MS);
  }

  function leave() {
    stop();
    setActive(0);
  }

  useEffect(() => stop, []);

  return (
    <div className={`overflow-hidden ${className}`} onMouseEnter={start} onMouseLeave={leave}>
      {frames.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={i === 0 ? alt : ""}
          fill
          priority={priority && i === 0}
          sizes={sizes}
          className={`object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {frames.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
          {frames.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)] transition-all duration-300 ${i === active ? "w-4 opacity-100" : "w-1.5 opacity-60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
