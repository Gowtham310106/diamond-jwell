import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/cms/repo";
import { formatPrice } from "@/lib/utils";

const BADGE_LABEL: Record<string, string> = { new: "New", bestseller: "Best seller", sale: "Sale", custom: "Custom" };

/**
 * The one product card. Image, badge, name, price with compare-at, and the
 * category or blurb underneath. Used in the homepage rows, the catalog grid
 * and "more from the studio".
 */
export default function ProductCard({
  product,
  ratio = "auto",
  sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 22vw",
  priority = false,
}: {
  product: ProductView;
  /** "auto" follows the product's orientation; "square" is for uniform rows. */
  ratio?: "auto" | "square" | "portrait";
  sizes?: string;
  priority?: boolean;
}) {
  const aspect =
    ratio === "square"
      ? "aspect-square"
      : ratio === "portrait"
        ? "aspect-[4/5]"
        : product.orientation === "landscape"
          ? "aspect-[4/3]"
          : product.orientation === "square"
            ? "aspect-square"
            : "aspect-[4/5]";

  const onSale = product.compareAtPrice !== null && product.price !== null && product.compareAtPrice > product.price;
  const badge = product.badges[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className={`relative ${aspect} overflow-hidden rounded-2xl border border-line bg-canvas-2`}>
        {product.image && (
          <Image
            src={product.image}
            alt={`${product.name} by Fabulla Diamonds Co.`}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        )}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {(badge || onSale) && (
          <span className="absolute left-3 top-3 rounded-full bg-deep/85 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-on-deep backdrop-blur-sm">
            {onSale ? "Sale" : BADGE_LABEL[badge] ?? badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="display text-[20px] leading-tight text-ink transition-colors duration-300 group-hover:text-rose-ink">{product.name}</h3>
        <span className="shrink-0 text-right font-mono text-[12px] text-ink-2">
          {product.price !== null ? (
            <>
              {product.priceNote && <span className="mr-1 text-[10px] text-ink-3">{product.priceNote}</span>}
              {formatPrice(product.price)}
              {onSale && <span className="ml-1.5 text-[10px] text-ink-3 line-through">{formatPrice(product.compareAtPrice!)}</span>}
            </>
          ) : (
            product.priceNote || "Quote"
          )}
        </span>
      </div>
      <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-ink-3">{product.blurb || product.category?.name}</p>
    </Link>
  );
}
