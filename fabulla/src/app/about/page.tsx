import type { Metadata } from "next";
import Image from "next/image";
import ClosingCta from "@/components/home/ClosingCta";
import Reveal from "@/components/ui/Reveal";
import { METRICS, SITE } from "@/lib/site";
import { ART } from "@/lib/products";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Fabulla Diamonds Co. is built on generations of diamond craftsmanship rooted in Surat, India, with a studio in Chicago since 2021.",
};

/**
 * Our story.
 *
 * Facts and voice preserved from the client's existing About copy. Nothing
 * here is invented.
 */

const DIFFERENCES = [
  {
    title: "Direct from the source",
    body: "You work with the designer, the sourcer and the craftsman. One team, your vision, full attention.",
  },
  {
    title: "Global diamond access",
    body: "Surat connections open the world's inventory to us, so we find the right stone for the piece and the budget.",
  },
  {
    title: "Natural or lab-grown",
    body: `Both, with equal expertise. Lab-grown brings the same brilliance at ${METRICS.labGrownSaving} less. You decide what matters.`,
  },
  {
    title: "Personal, not corporate",
    body: `No call centre. Every enquiry gets a real answer from our team, usually inside ${METRICS.responseTime}.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
          <Reveal>
            <p className="eyebrow">Est. {SITE.founded}</p>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] text-ink">
              Built on generations of diamond craftsmanship
            </h1>
          </Reveal>
        </div>
      </header>

      {/* Story: plate beside text. */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                <Image
                  src={ART.surat}
                  alt="Rough and polished diamonds from Surat, India"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal index={1}>
                <p className="font-sans text-[16px] leading-relaxed text-ink">
                  Fabulla Diamonds is built on generations of craftsmanship
                  rooted in {SITE.origin}, the largest diamond manufacturing hub
                  in the world, where close to {METRICS.diamondsFromSurat} of
                  the world&rsquo;s diamonds are cut and polished.
                </p>
              </Reveal>
              <Reveal index={2}>
                <p className="mt-7 font-sans text-[15px] leading-relaxed text-ink-2">
                  Four years ago we expanded to {SITE.city}, pairing that
                  traditional expertise with modern practice. With manufacturing
                  in both India and the United States, we specialise in custom
                  pieces designed with precision and care.
                </p>
              </Reveal>
              <Reveal index={3}>
                <p className="mt-7 font-sans text-[15px] leading-relaxed text-ink-2">
                  The mission is simple: beautiful, meaningful jewelry that
                  lasts a lifetime, and stays reachable for every style and
                  budget.
                </p>
              </Reveal>

              <Reveal index={4}>
                <div className="mt-12 grid grid-cols-3 gap-px border-t border-line-2">
                  {[
                    { v: METRICS.yearsInChicago, l: "Years in Chicago" },
                    { v: METRICS.diamondsFromSurat, l: "Cut in Surat" },
                    { v: "100%", l: "Custom capable" },
                  ].map((f) => (
                    <div key={f.l} className="pt-7">
                      <p className="font-mono text-[26px] leading-none text-ink lg:text-[32px]">
                        {f.v}
                      </p>
                      <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-ink-3">
                        {f.l}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Differences: 2x2 hairline field, not four cards. */}
      <section
        className="border-t border-line py-20 lg:py-28"
        aria-labelledby="difference-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Reveal>
            <h2
              id="difference-heading"
              className="display max-w-xl text-[clamp(2rem,4vw,3.25rem)] text-ink"
            >
              A different kind of jewelry experience
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-14 gap-y-px md:grid-cols-2">
            {DIFFERENCES.map((d, i) => (
              <Reveal
                key={d.title}
                index={i}
                className="border-t border-line py-9"
              >
                <h3 className="display text-[26px] text-ink">{d.title}</h3>
                <p className="mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-ink-2">
                  {d.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
