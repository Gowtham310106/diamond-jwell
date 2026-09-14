import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Certificate, ArrowsClockwise, CreditCard } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/site/ProductCard";
import ProductGallery from "@/components/site/ProductGallery";
import { getProduct, getSettings, listPublished } from "@/lib/cms/repo";
import { telHref } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await listPublished()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status !== "published") return { title: "Piece not found" };
  return {
    title: product.name,
    description: product.blurb,
    openGraph: { title: product.name, description: product.blurb, images: product.image ? [{ url: product.image }] : [] },
  };
}

const AVAILABILITY: Record<string, string> = { available: "Available now", inquire: "By enquiry", custom: "Made to order" };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings, all] = await Promise.all([getProduct(slug), getSettings(), listPublished()]);
  if (!product || product.status !== "published") notFound();

  const related = [...all.filter((p) => p.slug !== product.slug && p.categoryId === product.categoryId), ...all.filter((p) => p.slug !== product.slug && p.categoryId !== product.categoryId)].slice(0, 3);
  const onSale = product.compareAtPrice !== null && product.price !== null && product.compareAtPrice > product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    image: product.images.map((i) => (i.startsWith("http") ? i : `${settings.brand.url}${i}`)),
    sku: product.sku || undefined,
    brand: { "@type": "Brand", name: settings.brand.name },
    material: product.metal || undefined,
    offers:
      product.price !== null
        ? {
            "@type": "Offer",
            priceCurrency: "USD",
            price: product.price,
            availability: product.availability === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            url: `${settings.brand.url}/products/${product.slug}`,
          }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[1400px] px-5 pt-10 lg:px-10 lg:pt-14">
        <Link href={product.category ? `/products?category=${product.category.slug}` : "/products"} className="group inline-flex items-center gap-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors duration-300 hover:text-rose-ink">
          <ArrowLeft size={13} weight="light" className="transition-transform duration-300 group-hover:-translate-x-1" />
          {product.category ? `All ${product.category.name.toLowerCase()}` : "All products"}
        </Link>
      </div>

      <article className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} video={product.video} name={product.name} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-48">
              <p className="eyebrow">{product.category?.name ?? "Custom"}</p>
              <h1 className="display mt-5 text-[clamp(2.25rem,4vw,3.25rem)] text-ink">{product.name}</h1>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[24px] text-ink">{product.price !== null ? formatPrice(product.price) : product.priceNote || "Request a quote"}</span>
                {onSale && <span className="font-mono text-[14px] text-ink-3 line-through">{formatPrice(product.compareAtPrice!)}</span>}
                {product.price !== null && product.priceNote && <span className="font-sans text-[12px] text-ink-3">{product.priceNote}</span>}
              </div>
              <p className="mt-2 font-sans text-[12px] uppercase tracking-[0.14em] text-rose-ink">
                {AVAILABILITY[product.availability]}
                {product.stockCount !== null && product.stockCount > 0 && product.stockCount <= 3 && ` · only ${product.stockCount} left`}
              </p>

              {settings.financing.enabled && (
                <Link href={settings.financing.href || "/contact"} className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 font-sans text-[11.5px] text-ink-2 transition-colors hover:border-rose hover:text-rose-ink">
                  <CreditCard size={14} weight="light" />
                  {settings.financing.text}
                </Link>
              )}

              <p className="mt-8 font-sans text-[15px] leading-relaxed text-ink-2">{product.detail}</p>

              {product.specs.length > 0 && (
                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8">
                  {product.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{s.label}</dt>
                      <dd className="mt-2 font-sans text-[14px] text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-10 flex flex-col gap-3">
                <Button href={`/contact?kind=product&product=${product.slug}`} variant="primary">
                  Enquire about this piece
                  <ArrowRight size={14} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button href={`/contact?kind=appointment&product=${product.slug}`} variant="outline">
                  See it in the showroom
                </Button>
                <a href={telHref(settings.contact.phone)} className="text-center font-mono text-[12px] tracking-[0.14em] text-ink-3 transition-colors duration-300 hover:text-rose-ink">
                  {settings.contact.phone}
                </a>
              </div>

              <ul className="mt-8 space-y-2.5 border-t border-line pt-6 font-sans text-[12.5px] text-ink-2">
                <li className="flex items-center gap-2.5">
                  <Certificate size={15} weight="light" className="text-gold" /> GIA or IGI graded, with laser inscription
                </li>
                <li className="flex items-center gap-2.5">
                  <ArrowsClockwise size={15} weight="light" className="text-gold" /> Rebuilt to your stone, metal or size in {settings.metrics.customTimeline}
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck size={15} weight="light" className="text-gold" /> Cleaning, tightening and resizing for life
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="display text-[30px] text-ink lg:text-[36px]">More from the studio</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p._id} index={i}>
                  <ProductCard product={p} ratio="portrait" sizes="(max-width: 640px) 100vw, 30vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
