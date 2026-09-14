import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/site/ProductCard";
import type { ProductView } from "@/lib/cms/repo";

/**
 * A showcase row: heading on the left, "view all" on the right, cards in a
 * scroll-snapping rail on narrow screens and a four-up grid from tablet up.
 * The homepage runs two — New Arrivals and Best Sellers — fed by badges.
 */
export default function ProductRow({
  title,
  subtitle,
  products,
  href,
  hrefLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  products: ProductView[];
  href: string;
  hrefLabel?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-canvas py-14 sm:py-16" aria-label={title}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">{title}</h2>
            {subtitle && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
          </div>
          <Link href={href} className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-rose-ink">
            {hrefLabel}
            <ArrowRight size={13} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="rail -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <Reveal key={p._id} index={i} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} ratio="square" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
