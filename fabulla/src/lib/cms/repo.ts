/**
 * Domain queries over the store.
 *
 * Everything the pages and the admin need, in one place, in plain JavaScript
 * over the loaded collections. Reads go through `loadAll`, which is memoised
 * per request, so a page can call these freely.
 */

import { revalidatePath } from "next/cache";
import { getStore, loadAll, newId, now } from "./store";
import { DEFAULT_SETTINGS } from "./seed";
import type {
  Admin,
  Category,
  Collection,
  Conversation,
  Enquiry,
  Faq,
  MediaAsset,
  Product,
  Settings,
} from "./types";

/* ------------------------------------------------------------------------ */
/* Settings                                                                  */
/* ------------------------------------------------------------------------ */

export async function getSettings(): Promise<Settings> {
  const [doc] = await loadAll("settings");
  // A partial document (older shape, hand-edited) still renders: defaults fill the gaps.
  return { ...DEFAULT_SETTINGS, ...(doc ?? {}), _id: "site" };
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, ...patch, _id: "site", updatedAt: now() };
  await getStore().put("settings", next);
  revalidateSite();
  return next;
}

/* ------------------------------------------------------------------------ */
/* Catalog                                                                   */
/* ------------------------------------------------------------------------ */

const bySort = <T extends { sortOrder: number; name: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);

export async function listCategories(): Promise<Category[]> {
  return (await loadAll("categories")).slice().sort(bySort);
}

export async function getCategory(idOrSlug: string): Promise<Category | null> {
  const all = await loadAll("categories");
  return all.find((c) => c._id === idOrSlug || c.slug === idOrSlug) ?? null;
}

export async function listCollections(): Promise<Collection[]> {
  return (await loadAll("collections")).slice().sort(bySort);
}

export async function getCollection(idOrSlug: string): Promise<Collection | null> {
  const all = await loadAll("collections");
  return all.find((c) => c._id === idOrSlug || c.slug === idOrSlug) ?? null;
}

export type ProductView = Product & {
  category: Category | null;
  image: string;
};

async function decorate(products: Product[]): Promise<ProductView[]> {
  const categories = await loadAll("categories");
  return products.map((p) => ({
    ...p,
    category: categories.find((c) => c._id === p.categoryId) ?? null,
    image: p.images[0] ?? "",
  }));
}

/** Published products only, the storefront's view. */
export async function listPublished(): Promise<ProductView[]> {
  const all = await loadAll("products");
  return decorate(all.filter((p) => p.status === "published").sort(bySort));
}

/** Everything, for the admin. */
export async function listAllProducts(): Promise<ProductView[]> {
  return decorate((await loadAll("products")).slice().sort(bySort));
}

export async function getProduct(idOrSlug: string): Promise<ProductView | null> {
  const all = await loadAll("products");
  const p = all.find((x) => x._id === idOrSlug || x.slug === idOrSlug);
  return p ? (await decorate([p]))[0] : null;
}

export async function productsIn(collection: Collection, limit?: number): Promise<ProductView[]> {
  const published = await listPublished();
  const ordered = collection.productIds
    .map((id) => published.find((p) => p._id === id))
    .filter((p): p is ProductView => Boolean(p));
  return limit ? ordered.slice(0, limit) : ordered;
}

export type ProductQuery = {
  q?: string;
  category?: string;
  collection?: string;
  metal?: string;
  stone?: string;
  availability?: string;
  badge?: string;
  min?: number;
  max?: number;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "name";
  page?: number;
  perPage?: number;
};

export type Facets = {
  categories: { slug: string; name: string; count: number }[];
  metals: { value: string; count: number }[];
  stones: { value: string; count: number }[];
  availability: { value: string; count: number }[];
  price: { min: number; max: number };
};

export type ProductPage = {
  items: ProductView[];
  total: number;
  page: number;
  pages: number;
  facets: Facets;
};

function tally(values: string[]) {
  const map = new Map<string, number>();
  for (const v of values) if (v) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

export async function queryProducts(query: ProductQuery): Promise<ProductPage> {
  const published = await listPublished();
  const collections = await loadAll("collections");

  // Facets describe the whole catalog, not the current slice, so a visitor
  // can always see what else exists.
  const facets: Facets = {
    categories: (await listCategories())
      .map((c) => ({ slug: c.slug, name: c.name, count: published.filter((p) => p.categoryId === c._id).length }))
      .filter((c) => c.count > 0),
    metals: tally(published.map((p) => p.metal)),
    stones: tally(published.map((p) => p.stone)),
    availability: tally(published.map((p) => p.availability)),
    price: {
      min: Math.min(...published.map((p) => p.price ?? Infinity), Infinity) === Infinity ? 0 : Math.min(...published.filter((p) => p.price !== null).map((p) => p.price as number)),
      max: Math.max(0, ...published.filter((p) => p.price !== null).map((p) => p.price as number)),
    },
  };

  let items = published;

  if (query.category) {
    const c = query.category.toLowerCase();
    items = items.filter((p) => p.category?.slug === c || p.category?.name.toLowerCase() === c);
  }
  if (query.collection) {
    const col = collections.find((x) => x.slug === query.collection || x._id === query.collection);
    items = col ? items.filter((p) => col.productIds.includes(p._id) || p.collectionIds.includes(col._id)) : [];
  }
  if (query.metal) items = items.filter((p) => p.metal === query.metal);
  if (query.stone) items = items.filter((p) => p.stone === query.stone);
  if (query.availability) items = items.filter((p) => p.availability === query.availability);
  if (query.badge) items = items.filter((p) => p.badges.includes(query.badge as never));
  if (query.min !== undefined) items = items.filter((p) => p.price !== null && p.price >= query.min!);
  if (query.max !== undefined) items = items.filter((p) => p.price !== null && p.price <= query.max!);

  if (query.q) {
    const terms = query.q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (p: ProductView) =>
      [p.name, p.blurb, p.detail, p.metal, p.stone, p.sku, p.category?.name ?? "", ...p.tags, ...p.specs.map((s) => `${s.label} ${s.value}`)]
        .join(" ")
        .toLowerCase();
    items = items
      .map((p) => ({ p, score: terms.filter((t) => hay(p).includes(t)).length + (p.name.toLowerCase().includes(query.q!.toLowerCase()) ? 2 : 0) }))
      .filter((x) => x.score >= Math.min(terms.length, 1))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }

  switch (query.sort) {
    case "newest":
      items = items.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price-asc":
      items = items.slice().sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      items = items.slice().sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      break;
    case "name":
      items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      if (!query.q) items = items.slice().sort((a, b) => Number(b.featured) - Number(a.featured) || bySort(a, b));
  }

  const perPage = query.perPage ?? 12;
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), pages);

  return { items: items.slice((page - 1) * perPage, page * perPage), total: items.length, page, pages, facets };
}

export async function newArrivals(limit = 8): Promise<ProductView[]> {
  const published = await listPublished();
  const flagged = published.filter((p) => p.badges.includes("new"));
  const rest = published.filter((p) => !p.badges.includes("new")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return [...flagged, ...rest].slice(0, limit);
}

export async function bestSellers(limit = 8): Promise<ProductView[]> {
  const published = await listPublished();
  const flagged = published.filter((p) => p.badges.includes("bestseller"));
  const rest = published.filter((p) => !p.badges.includes("bestseller") && p.featured);
  return [...flagged, ...rest].slice(0, limit);
}

export async function featuredProducts(limit = 4): Promise<ProductView[]> {
  return (await listPublished()).filter((p) => p.featured).slice(0, limit);
}

/* ------------------------------------------------------------------------ */
/* Generic writes                                                            */
/* ------------------------------------------------------------------------ */

export async function upsert<T extends { _id: string; createdAt: string; updatedAt: string }>(
  col: "categories" | "collections" | "products" | "faqs" | "enquiries" | "conversations" | "admins" | "media",
  doc: Omit<T, "_id" | "createdAt" | "updatedAt"> & Partial<Pick<T, "_id" | "createdAt">>
): Promise<T> {
  const stamp = now();
  const full = { ...doc, _id: doc._id ?? newId(), createdAt: doc.createdAt ?? stamp, updatedAt: stamp } as T;
  await getStore().put(col, full as never);
  if (col !== "conversations" && col !== "enquiries" && col !== "admins") revalidateSite();
  return full;
}

export async function remove(col: "categories" | "collections" | "products" | "faqs" | "enquiries" | "conversations" | "admins" | "media", id: string) {
  await getStore().remove(col, id);
  revalidateSite();
}

/** Every public page reads the store, so any admin write refreshes the lot. */
export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Outside a request scope (scripts, tests) there is nothing to revalidate.
  }
}

/* ------------------------------------------------------------------------ */
/* Inbox, FAQ, chat, team, media                                             */
/* ------------------------------------------------------------------------ */

export async function listEnquiries(): Promise<Enquiry[]> {
  return (await loadAll("enquiries")).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listFaqs(): Promise<Faq[]> {
  return (await loadAll("faqs")).slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listConversations(): Promise<Conversation[]> {
  return (await loadAll("conversations")).slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listAdmins(): Promise<Admin[]> {
  return (await loadAll("admins")).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function findAdmin(email: string): Promise<Admin | null> {
  const all = await loadAll("admins");
  const e = email.trim().toLowerCase();
  return all.find((a) => a.email.toLowerCase() === e) ?? null;
}

export async function listMedia(): Promise<MediaAsset[]> {
  return (await loadAll("media")).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
