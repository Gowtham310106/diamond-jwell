"use client";

import { useRouter } from "next/navigation";

/** Sort dropdown that navigates on change, keeping every other filter. */
export default function SortSelect({ value, params }: { value: string; params: Record<string, string> }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
      Sort
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams({ ...params, sort: e.target.value });
          next.delete("page");
          router.push(`/products?${next.toString()}`);
        }}
        className="rounded-full border border-line-2 bg-canvas px-3 py-1.5 font-sans text-[12px] normal-case tracking-normal text-ink focus:border-rose focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name</option>
      </select>
    </label>
  );
}
