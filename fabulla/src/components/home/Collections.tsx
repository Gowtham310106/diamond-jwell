import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ART, CATEGORY_ART } from "@/lib/products";

/**
 * Collections bento: one tall plate on the left, two stacked on the right.
 * The reference build's "Aura Collections" block, rebuilt on Fabulla's own
 * edits and routed to real pages.
 */

const FEATURE = {
  tag: "Fabulla Signature",
  title: "The Engagement Edit",
  body: "Solitaires and halos built around a stone sourced to your budget, natural or lab-grown.",
  image: ART.halo,
  href: "/products?category=Rings",
};

const SIDE = [
  {
    tag: "Hand-finished",
    title: "Cuban Links & Chains",
    image: CATEGORY_ART.Chains,
    href: "/products?category=Chains",
  },
  {
    tag: "Made to order",
    title: "Bespoke Commissions",
    image: ART.bench,
    href: "/custom",
  },
];

export default function Collections() {
  return (
    <section className="bg-canvas py-14 sm:py-16" aria-labelledby="collections-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-9 text-center md:mb-12">
          <h2
            id="collections-heading"
            className="display text-[clamp(2rem,4vw,3rem)] text-ink"
          >
            Fabulla Collections
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            Curated edits from the Chicago studio
          </p>
        </Reveal>

        <div className="grid items-stretch gap-4 sm:gap-6 md:grid-cols-2">
          {/* Feature plate */}
          <Reveal>
            <Link
              href={FEATURE.href}
              className="group relative block aspect-[3/2] overflow-hidden rounded-2xl border border-line shadow-sm sm:aspect-[4/3] md:h-full md:min-h-[360px]"
            >
              <Image
                src={FEATURE.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                <span className="rounded-full bg-rose px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-ink">
                  {FEATURE.tag}
                </span>
                <h3 className="display mt-3 text-[26px] text-white sm:text-[32px]">
                  {FEATURE.title}
                </h3>
                <p className="mt-2 max-w-sm font-sans text-[12.5px] leading-relaxed text-white/85">
                  {FEATURE.body}
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Stacked plates */}
          <div className="flex flex-col justify-between gap-4 sm:gap-6">
            {SIDE.map((item, i) => (
              <Reveal key={item.title} index={i + 1} className="flex-1">
                <Link
                  href={item.href}
                  className="group relative block h-full min-h-[150px] overflow-hidden rounded-2xl border border-line shadow-sm sm:min-h-[168px]"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5">
                    <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {item.tag}
                    </span>
                    <h3 className="display mt-2.5 text-[21px] text-white sm:text-[25px]">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
