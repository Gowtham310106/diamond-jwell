import type { Metadata } from "next";
import Link from "next/link";
import { Compass, X } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/site/ProductCard";
import SortSelect from "@/components/site/SortSelect";
import { getCategory, getCollection, getSettings, listCollections, queryProducts, type ProductQuery } from "@/lib/cms/repo";
import { CTA, igHref } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description: "Rings, chains, pendants, bracelets, earrings and watches. Natural and lab-grown, custom made in Chicago.",
};

type Params = Record<string, string | undefined>;

const PRICE_BUCKETS: { key: string; label: string; min?: number; max?: number }[] = [
  { key: "under-2500", label: "Under $2,500", max: 2499 },
  { key: "2500-5000", label: "$2,500 – $5,000", min: 2500, max: 5000 },
  { key: "5000-10000", label: "$5,000 – $10,000", min: 5001, max: 10000 },
  { key: "over-10000", label: "Over $10,000", min: 10001 },
];

const AVAIL_LABEL: Record<string, string> = { available: "Available now", inquire: "By enquiry", custom: "Made to order" };

/** Build a products URL from the current params with one key changed. Resets the page. */
function href(current: Params, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...current, ...patch })) {
    if (v && k !== "page") next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default async function ProductsPage(props: { searchParams: Promise<Params> }) {
  const sp = await props.searchParams;
  const bucket = PRICE_BUCKETS.find((b) => b.key === sp.price);

  const query: ProductQuery = {
    q: sp.q?.trim() || undefined,
    category: sp.category,
    collection: sp.collection,
    metal: sp.metal,
    stone: sp.stone,
    availability: sp.availability,
    badge: sp.badge,
    min: bucket?.min,
    max: bucket?.max,
    sort: (sp.sort as ProductQuery["sort"]) ?? "featured",
    page: Number(sp.page) || 1,
    perPage: 12,
  };

  const [result, settings, collections, category, collection] = await Promise.all([
    queryProducts(query),
    getSettings(),
    listCollections(),
    sp.category ? getCategory(sp.category) : null,
    sp.collection ? getCollection(sp.collection) : null,
  ]);

  const { items, total, page, pages, facets } = result;
  const current: Params = { q: sp.q, category: sp.category, collection: sp.collection, metal: sp.metal, stone: sp.stone, availability: sp.availability, badge: sp.badge, price: sp.price, sort: sp.sort };

  const heading = query.q ? `“${query.q}”` : collection?.name ?? category?.name ?? (sp.badge === "bestseller" ? "Best sellers" : sp.badge === "new" ? "New arrivals" : "Every piece");
  const intro = collection?.description || category?.description || "Natural and lab-grown, with the same expertise behind both. Every piece here can also be built to your own design.";

  const active: { label: string; clear: Record<string, undefined> }[] = [
    sp.q && { label: `Search: ${sp.q}`, clear: { q: undefined } },
    category && { label: category.name, clear: { category: undefined } },
    collection && { label: collection.name, clear: { collection: undefined } },
    sp.metal && { label: sp.metal, clear: { metal: undefined } },
    sp.stone && { label: sp.stone, clear: { stone: undefined } },
    sp.availability && { label: AVAIL_LABEL[sp.availability] ?? sp.availability, clear: { availability: undefined } },
    sp.badge && { label: sp.badge === "bestseller" ? "Best sellers" : sp.badge, clear: { badge: undefined } },
    bucket && { label: bucket.label, clear: { price: undefined } },
  ].filter(Boolean) as { label: string; clear: Record<string, undefined> }[];

  const Facet = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-line py-5 first:pt-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{title}</p>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
  const Opt = ({ on, to, label, count }: { on: boolean; to: string; label: string; count?: number }) => (
    <li>
      <Link href={to} aria-current={on ? "true" : undefined} className={`flex items-center justify-between gap-3 font-sans text-[13px] transition-colors ${on ? "text-rose-ink" : "text-ink-2 hover:text-ink"}`}>
        <span className="flex items-center gap-2.5">
          <span className={`h-3.5 w-3.5 rounded-sm border ${on ? "border-rose-ink bg-rose-ink" : "border-line-2"}`} aria-hidden />
          {label}
        </span>
        {count !== undefined && <span className="font-mono text-[10px] text-ink-3">{count}</span>}
      </Link>
    </li>
  );

  const sidebar = (
    <>
      <Facet title="Category">
        <Opt on={!sp.category} to={href(current, { category: undefined })} label="All" />
        {facets.categories.map((c) => (
          <Opt key={c.slug} on={sp.category === c.slug} to={href(current, { category: sp.category === c.slug ? undefined : c.slug })} label={c.name} count={c.count} />
        ))}
      </Facet>
      {collections.length > 0 && (
        <Facet title="Collection">
          {collections.map((c) => (
            <Opt key={c._id} on={sp.collection === c.slug} to={href(current, { collection: sp.collection === c.slug ? undefined : c.slug })} label={c.name} count={c.productIds.length} />
          ))}
        </Facet>
      )}
      <Facet title="Price">
        {PRICE_BUCKETS.map((b) => (
          <Opt key={b.key} on={sp.price === b.key} to={href(current, { price: sp.price === b.key ? undefined : b.key })} label={b.label} />
        ))}
      </Facet>
      {facets.metals.length > 0 && (
        <Facet title="Metal">
          {facets.metals.map((m) => (
            <Opt key={m.value} on={sp.metal === m.value} to={href(current, { metal: sp.metal === m.value ? undefined : m.value })} label={m.value} count={m.count} />
          ))}
        </Facet>
      )}
      {facets.stones.length > 0 && (
        <Facet title="Stone">
          {facets.stones.map((s) => (
            <Opt key={s.value} on={sp.stone === s.value} to={href(current, { stone: sp.stone === s.value ? undefined : s.value })} label={s.value} count={s.count} />
          ))}
        </Facet>
      )}
      <Facet title="Availability">
        {facets.availability.map((a) => (
          <Opt key={a.value} on={sp.availability === a.value} to={href(current, { availability: sp.availability === a.value ? undefined : a.value })} label={AVAIL_LABEL[a.value] ?? a.value} count={a.count} />
        ))}
      </Facet>
    </>
  );

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-16 lg:px-10 lg:pb-16 lg:pt-24">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              {total} piece{total === 1 ? "" : "s"}
              {facets.price.max > 0 && ` · ${formatPrice(facets.price.min)} to ${formatPrice(facets.price.max)}`}
            </p>
            <h1 className="display mt-4 max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] text-ink">{heading}</h1>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">{intro}</p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Filters: a collapsible on narrow screens, a sticky column from lg up. */}
          <aside className="lg:col-span-3">
            <details className="lg:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-line-2 px-5 py-2.5 text-center font-sans text-[11px] uppercase tracking-[0.16em] text-ink">Filters {active.length > 0 && `(${active.length})`}</summary>
              <div className="mt-6">{sidebar}</div>
            </details>
            <div className="hidden lg:sticky lg:top-48 lg:block">{sidebar}</div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {active.map((a) => (
                  <Link key={a.label} href={href(current, a.clear)} className="inline-flex items-center gap-1.5 rounded-full border border-rose bg-rose-soft px-3.5 py-1.5 font-sans text-[11px] text-ink">
                    {a.label}
                    <X size={11} />
                  </Link>
                ))}
                {active.length > 1 && (
                  <Link href="/products" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 hover:text-rose-ink">
                    Clear all
                  </Link>
                )}
              </div>
              <SortSelect value={query.sort ?? "featured"} params={Object.fromEntries(Object.entries(current).filter(([, v]) => v)) as Record<string, string>} />
            </div>

            {items.length === 0 ? (
              <EmptyCatalog label={heading} instagram={settings.contact.instagram} />
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p, i) => (
                  <Reveal key={p._id} index={i % 6}>
                    <ProductCard product={p} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw" priority={i < 3} />
                  </Reveal>
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={`${href(current, {})}${href(current, {}).includes("?") ? "&" : "?"}page=${n}`}
                    aria-current={n === page ? "page" : undefined}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border font-mono text-[12px] ${n === page ? "border-rose bg-rose text-ink" : "border-line-2 text-ink-2 hover:border-rose"}`}
                  >
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** The studio is custom-first, so an empty result is an opportunity, not a dead end. */
function EmptyCatalog({ label, instagram }: { label: string; instagram: string }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <Compass size={32} weight="light" className="mx-auto text-rose-ink" />
      <h2 className="display mt-7 text-[30px] text-ink">Nothing ready-made for {label.toLowerCase()} right now</h2>
      <p className="mt-5 font-sans text-[14.5px] leading-relaxed text-ink-2">Most pieces leave this studio as commissions. Tell us what you have in mind and we will design and source it against your budget.</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Button href={CTA.custom.href} variant="primary">
          {CTA.custom.label}
        </Button>
        <Button href="/products" variant="outline">
          See everything
        </Button>
      </div>
      <a href={igHref(instagram)} target="_blank" rel="noreferrer noopener" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-rose-ink">
        Recent work on {instagram}
      </a>
    </div>
  );
}
