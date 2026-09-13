"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CATEGORIES, CATEGORY_ART } from "@/lib/products";

/**
 * Bluestone-derived bento field, the shape the reference build uses for "Shop
 * by Category": named grid areas, viewport-relative row heights, a lift-and-
 * shadow hover, and a directional scroll-in per tile.
 *
 * The reference had sixteen categories and a 23-row template. Fabulla has six,
 * so the field is retuned to a 6x6 template whose spans add to exactly 36
 * cells. No tile is empty and no area is orphaned:
 *   Rings 12 + Chains 6 + Pendants 6 + Bracelets 6 + Earrings 2 + Watches 4 = 36
 *
 * Tile sizes are deliberately unequal. An earlier 5-row version gave pendants
 * a single row, which rendered as a 104px strip beside a 327px neighbour and
 * left no room for the label to sit over the scrim. Every tile now spans at
 * least two rows, and the bottom band avoids three identical cells.
 *
 * The reveal keeps the reference's IntersectionObserver rather than moving to
 * Motion, because the animation is a plain CSS class toggle and pulling in a
 * motion component per tile would cost more than it buys.
 */

const AREAS = `
  'rings rings rings chains chains chains'
  'rings rings rings chains chains chains'
  'rings rings rings pendants pendants pendants'
  'rings rings rings pendants pendants pendants'
  'bracelets bracelets bracelets earrings watches watches'
  'bracelets bracelets bracelets earrings watches watches'
`;

const DIRECTIONS = ["from-left", "from-up", "from-right", "from-down"];

export default function CategoryBento() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const tiles = Array.from(root.querySelectorAll<HTMLElement>(".bento__tile"));
    tiles.forEach((tile, i) => tile.classList.add(DIRECTIONS[i % DIRECTIONS.length]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-canvas pb-16 pt-6" aria-labelledby="category-heading">
      <div className="mb-9 text-center md:mb-11">
        <h2
          id="category-heading"
          className="display text-[clamp(2rem,4vw,3rem)] text-ink"
        >
          Shop by category
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Six ways into the studio
        </p>
      </div>

      <div ref={ref} className="bento mx-auto w-full max-w-[1400px] px-2 md:px-8">
        <div className="bento__grid" style={{ gridTemplateAreas: AREAS }}>
          {CATEGORIES.map((category) => (
            <div
              key={category}
              className="bento__tile"
              style={{ gridArea: category.toLowerCase() }}
            >
              <Link
                href={`/products?category=${category}`}
                className="relative block h-full overflow-hidden rounded-md shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:z-10 md:rounded-2xl md:shadow-[0_6px_18px_rgba(15,23,42,0.14)] md:hover:-translate-y-[3px] md:hover:shadow-[0_22px_40px_rgba(15,23,42,0.24)]"
              >
                <Image
                  src={CATEGORY_ART[category]}
                  alt={`${category} by Fabulla Diamonds Co.`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105"
                />
                {/* Exactly half-height scrim, as in the reference. */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 z-[3] px-3 pb-3 pt-6 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-white transition-all duration-300 ease-out hover:tracking-[0.1em] md:text-[13.5px]">
                  {category}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
