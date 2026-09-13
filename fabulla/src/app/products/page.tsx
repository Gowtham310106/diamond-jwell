import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { CTA, CONTACT } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Rings, chains, pendants, bracelets, earrings and watches. Natural and lab-grown, custom made in Chicago.",
};

/**
 * Products index.
 *
 * The filter reads from the query string, which is the pattern the existing
 * site already uses (/products?category=Rings). Those URLs are preserved so
 * inbound links keep resolving.
 *
 * Next 16 makes searchParams a Promise, so the page is async.
 */
export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await props.searchParams;
  const active = category && CATEGORIES.includes(category as never) ? category : null;
  const shown = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
          <Reveal>
            <h1 className="display max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
              {active ?? "Every piece"}
            </h1>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">
              Natural and lab-grown, with the same expertise behind both. Every
              piece here can also be built to your own design.
            </p>
          </Reveal>

          {/* Filter. Scroll-snap pills on narrow screens rather than a
              wrapping row of buttons. */}
          <Reveal index={1}>
            <nav
              className="rail mt-11 flex gap-2.5 overflow-x-auto pb-1"
              aria-label="Filter by category"
            >
              <FilterPill href="/products" label="All" active={!active} />
              {CATEGORIES.map((c) => (
                <FilterPill
                  key={c}
                  href={`/products?category=${c}`}
                  label={c}
                  active={active === c}
                />
              ))}
            </nav>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
        {shown.length === 0 ? (
          <EmptyCategory category={active!} />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.slug} index={i}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`shrink-0 rounded-full border px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
        active
          ? "border-rose bg-rose text-ink"
          : "border-line-2 text-ink-2 hover:border-rose hover:text-rose-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function ProductCard({ product }: { product: Product }) {
  const ratio =
    product.orientation === "landscape"
      ? "aspect-[4/3]"
      : product.orientation === "square"
        ? "aspect-square"
        : "aspect-[4/5]";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className={`relative ${ratio} overflow-hidden rounded-2xl border border-line`}
      >
        <Image
          src={product.image}
          alt={`${product.name} by Fabulla Diamonds Co.`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent opacity-70" />
        <ArrowUpRight
          size={20}
          weight="light"
          className="absolute right-4 top-4 translate-y-1 text-rose-ink opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h2 className="display text-[22px] leading-tight text-ink transition-colors duration-300 group-hover:text-rose-ink">
          {product.name}
        </h2>
        <span className="shrink-0 font-mono text-[12px] text-ink-2">
          {product.price !== null
            ? `${product.priceNote ? `${product.priceNote} ` : ""}${formatPrice(product.price)}`
            : product.priceNote}
        </span>
      </div>
      <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-ink-3">
        {product.blurb}
      </p>
    </Link>
  );
}

/**
 * Empty state. The studio is custom-first, so a category with nothing in stock
 * is a genuine opportunity rather than a dead end. It says what to do next.
 */
function EmptyCategory({ category }: { category: string }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <Compass size={32} weight="light" className="mx-auto text-rose-ink" />
      <h2 className="display mt-7 text-[30px] text-ink">
        Nothing ready-made in {category.toLowerCase()} right now
      </h2>
      <p className="mt-5 font-sans text-[14.5px] leading-relaxed text-ink-2">
        Most {category.toLowerCase()} leave this studio as commissions. Tell us
        what you have in mind and we will design and source it against your
        budget.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Button href={CTA.custom.href} variant="primary">
          {CTA.custom.label}
        </Button>
        <Button href="/products" variant="outline">
          See everything
        </Button>
      </div>
      <a
        href={CONTACT.instagramHref}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-rose-ink"
      >
        Recent work on {CONTACT.instagram}
      </a>
    </div>
  );
}
