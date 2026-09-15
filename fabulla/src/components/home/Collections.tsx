import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { Collection } from "@/lib/cms/types";

/**
 * Collections bento: one tall plate on the left, two stacked on the right.
 * Fed by the featured collections in the admin, first three in order.
 */
export default function Collections({ title, subtitle, collections }: { title: string; subtitle?: string; collections: Collection[] }) {
  const [feature, ...side] = collections.filter((c) => c.image).slice(0, 3);
  if (!feature) return null;

  return (
    <section className="bg-canvas py-14 sm:py-16" aria-labelledby="collections-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-9 text-center md:mb-12">
          <h2 id="collections-heading" className="display text-[clamp(2rem,4vw,3rem)] text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Link href={`/products?collection=${feature.slug}`} className="group relative block h-[420px] overflow-hidden rounded-2xl border border-line lg:h-full lg:min-h-[500px]">
              <Image src={feature.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="inline-block rounded-full bg-rose px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-on-rose">Featured</span>
                <h3 className="display mt-4 text-[32px] leading-tight text-white">{feature.name}</h3>
                {feature.description && <p className="mt-2 max-w-md font-sans text-[13px] leading-relaxed text-white/80">{feature.description}</p>}
              </div>
            </Link>
          </Reveal>

          <div className="grid gap-5">
            {side.map((c, i) => (
              <Reveal key={c._id} index={i + 1}>
                <Link href={`/products?collection=${c.slug}`} className="group relative block h-[240px] overflow-hidden rounded-2xl border border-line">
                  <Image src={c.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-block rounded-full border border-white/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white">{c.productIds.length} pieces</span>
                    <h3 className="display mt-3 text-[26px] leading-tight text-white">{c.name}</h3>
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
