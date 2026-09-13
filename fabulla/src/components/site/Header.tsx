"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  MagnifyingGlass,
  Heart,
  User,
  Handbag,
  List,
  X,
  Phone,
} from "@phosphor-icons/react";
import CategoryNav from "./CategoryNav";
import { NAV_CATEGORIES } from "@/lib/navigation";
import { CONTACT, CTA, SITE } from "@/lib/site";

/**
 * Two-tier header, following the reference build: a slim notice strip, a brand
 * row with search and account actions, and the circular category nav beneath.
 * The whole unit is fixed and floats transparently over the cinematic intro on
 * the homepage, then takes a cream ground once you scroll past it.
 *
 * One deviation from the reference, and it is deliberate. Keeping all three
 * tiers expanded forever costs roughly 180px of viewport on every scroll. Here
 * the notice strip hides and the category circles shrink to 44px with their
 * labels dropped once you scroll, so the persistent chrome settles at about
 * 110px while the mega-menu stays reachable the whole way down the page.
 */
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastIntro, setPastIntro] = useState(!isHome);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const nextScrolled = v > 24;
    setScrolled((c) => (c === nextScrolled ? c : nextScrolled));

    if (!isHome) return;
    // The intro is four screen-heights tall; the chrome goes solid just before
    // its last screen finishes so it never sits transparent over the page.
    const threshold = window.innerHeight * 3.25;
    const next = v > threshold;
    setPastIntro((c) => (c === next ? c : next));
  });

  const overMedia = isHome && !pastIntro;

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[2000] transition-colors duration-500 ${
          overMedia ? "text-white" : "text-ink"
        }`}
      >
        {/* Tier 1: notice strip. Collapses on scroll. */}
        <AnimatePresence initial={false}>
          {!scrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 32, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`overflow-hidden ${
                overMedia ? "bg-black/25" : "bg-ink text-canvas"
              }`}
            >
              <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <p className="truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em]">
                  Natural &amp; lab-grown
                  <span className="hidden sm:inline">
                    {" "}· GIA and IGI certified · Custom pieces in 2 to 4 weeks
                  </span>
                </p>
                <a
                  href={CONTACT.phoneHref}
                  className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70 sm:flex"
                >
                  <Phone size={12} weight="light" />
                  {CONTACT.phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tier 2: brand row */}
        <div
          className={`transition-all duration-500 ${
            overMedia
              ? "bg-transparent"
              : "border-b border-line bg-canvas/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm"
          }`}
        >
          <div className="mx-auto flex h-[62px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="-ml-1 p-1 lg:hidden"
                aria-label="Open menu"
              >
                <List size={24} weight="light" />
              </button>

              <Link href="/" className="flex items-baseline gap-2.5" aria-label={SITE.name}>
                <span className="display text-[24px] leading-none tracking-[0.1em] sm:text-[27px]">
                  FABULLA
                </span>
                <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.3em] opacity-70 sm:block">
                  Diamonds Co.
                </span>
              </Link>
            </div>

            {/* Search */}
            <div className="relative mx-6 hidden w-full max-w-md md:block">
              <label htmlFor="site-search" className="sr-only">
                Search the collection
              </label>
              <input
                id="site-search"
                type="search"
                placeholder="Search rings, chains, solitaires"
                className={`w-full rounded-full border py-2 pl-4 pr-10 font-sans text-[12px] transition-all focus:outline-none ${
                  overMedia
                    ? "border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-white focus:bg-white/20"
                    : "border-line-2 bg-canvas text-ink placeholder-ink-3 focus:border-gold focus:bg-surface"
                }`}
              />
              <MagnifyingGlass
                size={16}
                weight="light"
                className="pointer-events-none absolute right-3.5 top-2.5 opacity-60"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {[
                { Icon: Heart, label: "Wishlist", href: "/products" },
                { Icon: User, label: "Account", href: "/contact" },
                { Icon: Handbag, label: "Bag", href: "/products" },
              ].map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center transition-opacity hover:opacity-70"
                >
                  <Icon size={21} weight="light" />
                  <span className="mt-0.5 hidden font-mono text-[8px] uppercase tracking-[0.16em] sm:block">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tier 3: circular category nav */}
        <div className="hidden lg:block">
          <CategoryNav overMedia={overMedia} compact={scrolled} />
        </div>
      </div>

      {/* Spacer: the header is fixed, so non-home pages need the room back.
          The homepage does not, because the intro starts beneath it. */}
      {!isHome && <div aria-hidden className="h-[94px] lg:h-[180px]" />}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[3000] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-canvas px-6 pb-10 pt-5"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="display text-[22px] tracking-[0.1em] text-ink">
                  FABULLA
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-ink-2"
                >
                  <X size={22} weight="light" />
                </button>
              </div>

              <nav className="mt-7" aria-label="Mobile">
                {NAV_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="border-b border-line py-4">
                    <p className="display text-[21px] text-ink">{cat.name}</p>
                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2">
                      {cat.children.slice(0, 5).map((child) => (
                        <Link
                          key={child.name + child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="font-sans text-[12.5px] text-ink-2"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-auto space-y-3 pt-8">
                <Link
                  href={CTA.custom.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full bg-rose px-6 py-3.5 text-center font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink"
                >
                  {CTA.custom.label}
                </Link>
                <a
                  href={CONTACT.phoneHref}
                  className="block text-center font-mono text-[11px] tracking-[0.14em] text-ink-3"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
