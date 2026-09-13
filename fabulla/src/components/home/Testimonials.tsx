import { Quotes } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import { TESTIMONIALS } from "@/lib/site";

/**
 * Client stories. Quotes trimmed to a single readable thought; the full
 * reviews live on the profile.
 *
 * Typographic quote marks, and the attribution uses a plain hyphen rather than
 * a dash rule.
 */
export default function Testimonials() {
  return (
    <section
      className="border-t border-line bg-canvas-2 py-16 md:py-20"
      aria-labelledby="stories-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-11 text-center">
          <h2
            id="stories-heading"
            className="display text-[clamp(2rem,4vw,3rem)] text-ink"
          >
            Worn with pride
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            From clients across Chicagoland
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} index={i}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:border-rose hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
                <div>
                  <Quotes size={24} weight="fill" className="text-rose-soft" />
                  <blockquote className="display mt-4 text-[20px] leading-[1.42] text-ink">
                    {t.quote}
                  </blockquote>
                </div>
                <figcaption className="mt-7 border-t border-line pt-5">
                  <span className="block font-sans text-[13px] font-semibold text-ink">
                    {t.name}
                  </span>
                  <span className="mt-0.5 block font-sans text-[12px] text-ink-3">
                    {t.location}
                  </span>
                  <span className="mt-3 block font-mono text-[9.5px] uppercase tracking-[0.2em] text-rose-ink">
                    {t.piece}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
