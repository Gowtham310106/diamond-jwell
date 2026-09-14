"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Category } from "@/lib/cms/types";

/**
 * Bluestone-derived bento field for "Shop by Category": named grid areas,
 * viewport-relative row heights, a lift-and-shadow hover, and a directional
 * scroll-in per tile.
 *
 * With exactly six categories the field is the tuned 6x6 template whose
 * spans add to 36 cells and where every tile has at least two rows:
 *   t0 12 + t1 6 + t2 6 + t3 6 + t4 2 + t5 4 = 36
 * Any other count falls back to a plain responsive grid, so adding or
 * removing a category in the admin never breaks the page.
 *
 * The reveal keeps a plain IntersectionObserver and a CSS class toggle.
 */

const AREAS_SIX = `
  't0 t0 t0 t1 t1 t1'
  't0 t0 t0 t1 t1 t1'
  't0 t0 t0 t2 t2 t2'
  't0 t0 t0 t2 t2 t2'
  't3 t3 t3 t4 t5 t5'
  't3 t3 t3 t4 t5 t5'
`;

const DIRECTIONS = ["from-left", "from-up", "from-right", "from-down"];

export default function CategoryBento({ title, subtitle, categories }: { title: string; subtitle?: string; categories: Category[] }) {
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
  }, [categories.length]);

  if (categories.length === 0) return null;
  const tuned = categories.length === 6;

  const tile = (category: Category, i: number) => (
    <div key={category._id} className="bento__tile" style={tuned ? { gridArea: `t${i}` } : { minHeight: 220 }}>
      <Link
        href={`/products?category=${category.slug}`}
        className="relative block h-full overflow-hidden rounded-md shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:z-10 md:rounded-2xl md:shadow-[0_6px_18px_rgba(15,23,42,0.14)] md:hover:-translate-y-[3px] md:hover:shadow-[0_22px_40px_rgba(15,23,42,0.24)]"
      >
        <Image src={category.image} alt={`${category.name} by Fabulla Diamonds Co.`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0) 100%)" }} />
        <span className="absolute inset-x-0 bottom-0 z-[3] px-3 pb-3 pt-6 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-white transition-all duration-300 ease-out hover:tracking-[0.1em] md:text-[13.5px]">
          {category.name}
        </span>
      </Link>
    </div>
  );

  return (
    <section className="bg-canvas pb-16 pt-6" aria-labelledby="category-heading">
      <div className="mb-9 text-center md:mb-11">
        <h2 id="category-heading" className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          {title}
        </h2>
        {subtitle && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
      </div>

      <div ref={ref} className="bento mx-auto w-full max-w-[1400px] px-2 md:px-8">
        {tuned ? (
          <div className="bento__grid" style={{ gridTemplateAreas: AREAS_SIX }}>
            {categories.map(tile)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">{categories.map(tile)}</div>
        )}
      </div>
    </section>
  );
}
