"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { MagnifyingGlass, Phone, CalendarBlank, List, X } from "@phosphor-icons/react";
import CategoryNav, { type NavEntry } from "./CategoryNav";
import type { Category, Settings } from "@/lib/cms/types";
import { CTA, telHref } from "@/lib/site";

/**
 * Two-tier header: a slim notice strip, a brand row with search and the two
 * actions a quote-based studio actually has (call, book), and the circular
 * category nav beneath. Fixed, cream, with the notice strip collapsing and the
 * circles shrinking once you scroll so the persistent chrome settles at about
 * 110px while the mega-menu stays reachable.
 *
 * Content is props: the layout reads the CMS once and hands it down.
 */
export default function Header({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    setScrolled((c) => (c === next ? c : next));
  });

  const nav: NavEntry[] = [
    {
      id: "all",
      name: "All Jewelry",
      image: categories[0]?.image ?? "",
      bannerImage: settings.hero[0]?.kind === "image" ? settings.hero[0].src : categories[0]?.bannerImage ?? "",
      bannerTitle: "Every piece in the studio, natural and lab-grown.",
      bannerHref: "/products",
      children: [
        { name: "All products", href: "/products" },
        ...categories.filter((c) => c.showInNav).map((c) => ({ name: c.name, href: `/products?category=${c.slug}` })),
        { name: "Custom work", href: "/custom" },
      ],
    },
    ...categories
      .filter((c) => c.showInNav)
      .map((c) => ({
        id: c.slug,
        name: c.name,
        image: c.image,
        bannerImage: c.bannerImage || c.image,
        bannerTitle: c.bannerTitle || c.description,
        bannerHref: `/products?category=${c.slug}`,
        children: c.children.length ? c.children : [{ name: `All ${c.name.toLowerCase()}`, href: `/products?category=${c.slug}` }],
      })),
    {
      id: "custom",
      name: "Custom",
      image: settings.process[2]?.image ?? categories[0]?.image ?? "",
      bannerImage: settings.process[2]?.image ?? "",
      bannerTitle: "From a sketch, a photo, or nothing at all.",
      bannerHref: "/custom",
      children: [
        { name: "How it works", href: "/custom" },
        { name: "Natural or lab-grown", href: "/custom#stones" },
        { name: CTA.custom.label, href: CTA.custom.href },
        { name: "Our story", href: "/about" },
      ],
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[2000] text-ink">
        {/* Tier 1: notice strip. Collapses on scroll. */}
        <AnimatePresence initial={false}>
          {!scrolled && settings.notice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 32, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden bg-ink text-canvas"
            >
              <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <p className="truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em]">{settings.notice}</p>
                <a href={telHref(settings.contact.phone)} className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70 sm:flex">
                  <Phone size={12} weight="light" />
                  {settings.contact.phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tier 2: brand row */}
        <div className="border-b border-line bg-canvas/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm">
          <div className="mx-auto flex h-[62px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} className="-ml-1 p-1 lg:hidden" aria-label="Open menu">
                <List size={24} weight="light" />
              </button>
              <Link href="/" className="flex items-baseline gap-2.5" aria-label={settings.brand.name}>
                <span className="display text-[24px] leading-none tracking-[0.1em] sm:text-[27px]">{settings.brand.shortName.toUpperCase()}</span>
                <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.3em] opacity-70 sm:block">
                  {settings.brand.name.replace(settings.brand.shortName, "").trim() || "Diamonds Co."}
                </span>
              </Link>
            </div>

            {/* Search: a plain GET so it works before hydration and is bookmarkable. */}
            <form action="/products" method="get" role="search" className="relative mx-6 hidden w-full max-w-md md:block">
              <label htmlFor="site-search" className="sr-only">
                Search the collection
              </label>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search rings, chains, solitaires"
                className="w-full rounded-full border border-line-2 bg-canvas py-2 pl-4 pr-10 font-sans text-[12px] text-ink transition-all placeholder-ink-3 focus:border-gold focus:bg-surface focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="absolute right-3 top-2 opacity-60 hover:opacity-100">
                <MagnifyingGlass size={16} weight="light" />
              </button>
            </form>

            <div className="flex items-center gap-4 sm:gap-6">
              <a href={telHref(settings.contact.phone)} className="group flex flex-col items-center transition-opacity hover:opacity-70">
                <Phone size={21} weight="light" />
                <span className="mt-0.5 hidden font-mono text-[8px] uppercase tracking-[0.16em] sm:block">Call</span>
              </a>
              <Link href={CTA.book.href} className="group flex flex-col items-center transition-opacity hover:opacity-70">
                <CalendarBlank size={21} weight="light" />
                <span className="mt-0.5 hidden font-mono text-[8px] uppercase tracking-[0.16em] sm:block">Book</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 3: circular category nav */}
        <div className="hidden lg:block">
          <CategoryNav entries={nav} compact={scrolled} />
        </div>
      </div>

      {/* The header is fixed; give the page its room back. */}
      <div aria-hidden className="h-[94px] lg:h-[180px]" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[3000] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-canvas px-6 pb-10 pt-5"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="display text-[22px] tracking-[0.1em] text-ink">{settings.brand.shortName.toUpperCase()}</span>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ink-2">
                  <X size={22} weight="light" />
                </button>
              </div>

              <form action="/products" method="get" role="search" className="relative mt-5">
                <input name="q" type="search" placeholder="Search the collection" aria-label="Search the collection" className="w-full rounded-full border border-line-2 bg-canvas py-2.5 pl-4 pr-10 font-sans text-[13px] text-ink placeholder-ink-3 focus:border-gold focus:outline-none" />
                <button type="submit" aria-label="Search" className="absolute right-3 top-2.5 opacity-60">
                  <MagnifyingGlass size={16} weight="light" />
                </button>
              </form>

              <nav className="mt-4" aria-label="Mobile">
                {nav.map((cat) => (
                  <div key={cat.id} className="border-b border-line py-4">
                    <Link href={cat.bannerHref} onClick={() => setMobileOpen(false)} className="display text-[21px] text-ink">
                      {cat.name}
                    </Link>
                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2">
                      {cat.children.slice(0, 5).map((child) => (
                        <Link key={child.name + child.href} href={child.href} onClick={() => setMobileOpen(false)} className="font-sans text-[12.5px] text-ink-2">
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-auto space-y-3 pt-8">
                <Link href={CTA.custom.href} onClick={() => setMobileOpen(false)} className="block rounded-full bg-rose px-6 py-3.5 text-center font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                  {CTA.custom.label}
                </Link>
                <a href={telHref(settings.contact.phone)} className="block text-center font-mono text-[11px] tracking-[0.14em] text-ink-3">
                  {settings.contact.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
