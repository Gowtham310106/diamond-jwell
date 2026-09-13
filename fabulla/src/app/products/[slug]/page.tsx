import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { PRODUCTS, getProduct } from "@/lib/products";
import { CTA, CONTACT, METRICS } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

// Next 16: params is a Promise in every route-level export, metadata included.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece not found" };

  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: `${product.name} | Fabulla Diamonds Co.`,
      description: product.blurb,
      images: [{ url: product.image }],
    },
  };
}

const AVAILABILITY: Record<string, string> = {
  available: "Available now",
  inquire: "By enquiry",
  custom: "Made to order",
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 pt-10 lg:px-10 lg:pt-14">
        <Link
          href="/products"
          className="group inline-flex items-center gap-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors duration-300 hover:text-rose-ink"
        >
          <ArrowLeft
            size={13}
            weight="light"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          All products
        </Link>
      </div>

      <article className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Plate */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
              <Image
                src={product.image}
                alt={`${product.name} by Fabulla Diamonds Co.`}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{product.category}</p>

              <h1 className="display mt-5 text-[clamp(2.25rem,4vw,3.25rem)] text-ink">
                {product.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-mono text-[24px] text-ink">
                  {product.price !== null
                    ? formatPrice(product.price)
                    : product.priceNote}
                </span>
                {product.price !== null && product.priceNote && (
                  <span className="font-sans text-[12px] text-ink-3">
                    {product.priceNote}
                  </span>
                )}
              </div>

              <p className="mt-2 font-sans text-[12px] uppercase tracking-[0.14em] text-rose-ink">
                {AVAILABILITY[product.availability]}
              </p>

              <p className="mt-8 font-sans text-[15px] leading-relaxed text-ink-2">
                {product.detail}
              </p>

              {/* Four specs. Grouped in a two-up field rather than a stack of
                  hairline rows. */}
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8">
                {product.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                      {s.label}
                    </dt>
                    <dd className="mt-2 font-sans text-[14px] text-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-col gap-3">
                <Button href={CTA.custom.href} variant="primary">
                  Enquire about this piece
                  <ArrowRight
                    size={14}
                    weight="light"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
                <a
                  href={CONTACT.phoneHref}
                  className="rounded-full border border-line-2 px-7 py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-rose hover:text-rose-ink"
                >
                  {CONTACT.phone}
                </a>
              </div>

              <p className="mt-6 font-sans text-[12.5px] leading-relaxed text-ink-3">
                Want this in a different stone, metal or size? Every piece here
                can be rebuilt to your specification in {METRICS.customTimeline}.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* More */}
      <section className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <h2 className="display text-[30px] text-ink lg:text-[36px]">
            More from the studio
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} index={i}>
                <Link href={`/products/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                    <Image
                      src={p.image}
                      alt={`${p.name} by Fabulla Diamonds Co.`}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-4 display text-[20px] text-ink transition-colors duration-300 group-hover:text-rose-ink">
                    {p.name}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
