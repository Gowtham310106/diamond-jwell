import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import { FEATURED, ART } from "@/lib/products";
import { CTA, METRICS } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

/**
 * Campaign split: a full-height editorial card on the left, a product grid on
 * the right. The reference build's "Mark Your Moment" block.
 *
 * The reference floated two large blurred colour orbs behind this section. On
 * a cream ground they read as a smudge rather than as light, so the depth here
 * comes from the photographic card itself.
 */
export default function Campaign() {
  const products = FEATURED.slice(0, 4);

  return (
    <section
      className="border-t border-line bg-canvas py-16 md:py-20"
      aria-labelledby="campaign-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Editorial card */}
          <Reveal className="lg:col-span-5">
            <div className="relative flex h-full min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-line p-8 md:p-10">
              <Image
                src={ART.solitaire}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/65 to-ink/85" />

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  Mark the moment
                </span>
                <h2
                  id="campaign-heading"
                  className="display mt-5 text-[34px] leading-[1.05] text-white sm:text-[42px]"
                >
                  A piece for the
                  <br />
                  moment that <em className="text-rose">lasts</em>
                </h2>
                <p className="mt-5 max-w-sm font-sans text-[13.5px] leading-relaxed text-white/80">
                  Engagements, anniversaries, the thing you have been saving
                  for. Bring the occasion and we will build around it.
                </p>
              </div>

              <div className="relative z-10 mt-8 space-y-5 border-t border-white/20 pt-6">
                <p className="flex items-center gap-2.5 font-sans text-[11.5px] text-white/75">
                  <ShieldCheck size={17} weight="light" className="text-rose" />
                  Free consultation · {METRICS.customTimeline} from concept
                </p>
                <Link
                  href={CTA.custom.href}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white px-6 py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  {CTA.custom.label}
                  <ArrowRight
                    size={13}
                    weight="light"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Product grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {products.map((p, i) => (
                <Reveal key={p.slug} index={i}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-500 hover:border-rose hover:shadow-[0_10px_34px_rgba(15,23,42,0.1)]"
                  >
                    <div className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-2xl border border-line bg-canvas">
                      <Image
                        src={p.image}
                        alt={`${p.name} by Fabulla Diamonds Co.`}
                        fill
                        sizes="(max-width: 640px) 100vw, 28vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-canvas">
                        {p.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h3 className="display text-[20px] leading-tight text-ink transition-colors group-hover:text-rose-ink">
                          {p.name}
                        </h3>
                        <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-ink-3">
                          {p.blurb}
                        </p>
                      </div>
                      <p className="mt-4 font-mono text-[13px] text-ink">
                        {p.price !== null ? formatPrice(p.price) : p.priceNote}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
