"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { bool, csv, int, json, list, num, rows, str, urls } from "@/lib/cms/forms";
import { getProduct, listAllProducts, remove, slugify, upsert } from "@/lib/cms/repo";
import type { Availability, Badge, Orientation, Product, ProductStatus } from "@/lib/cms/types";

const AVAILABILITY: Availability[] = ["available", "inquire", "custom"];
const STATUS: ProductStatus[] = ["draft", "published"];
const ORIENTATION: Orientation[] = ["portrait", "landscape", "square"];
const BADGES: Badge[] = ["new", "bestseller", "sale", "custom"];

export async function saveProduct(form: FormData) {
  await requireAdmin();

  const id = str(form, "id", 64);
  const existing = id ? await getProduct(id) : null;
  const name = str(form, "name", 160);
  if (!name) redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent("A product needs a name.")}`);

  // Slug: keep what the admin typed, else derive; never collide with another piece.
  let slug = slugify(str(form, "slug", 160) || name);
  const others = (await listAllProducts()).filter((p) => p._id !== existing?._id);
  if (others.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const availability = str(form, "availability", 20) as Availability;
  const status = str(form, "status", 20) as ProductStatus;
  const orientation = str(form, "orientation", 20) as Orientation;

  const product = await upsert<Product>("products", {
    _id: existing?._id,
    createdAt: existing?.createdAt,
    slug,
    name,
    sku: str(form, "sku", 80),
    categoryId: str(form, "categoryId", 64),
    collectionIds: list(form, "collectionIds"),
    price: num(form, "price"),
    compareAtPrice: num(form, "compareAtPrice"),
    priceNote: str(form, "priceNote", 80),
    blurb: str(form, "blurb", 200),
    detail: str(form, "detail", 4000),
    specs: rows<{ label: string; value: string }>(form, "specs"),
    metal: str(form, "metal", 80),
    stone: str(form, "stone", 80),
    caratWeight: str(form, "caratWeight", 40),
    availability: AVAILABILITY.includes(availability) ? availability : "available",
    status: STATUS.includes(status) ? status : "draft",
    images: urls(form, "images"),
    video: urls(form, "video")[0] ?? "",
    orientation: ORIENTATION.includes(orientation) ? orientation : "portrait",
    badges: list(form, "badges").filter((b): b is Badge => BADGES.includes(b as Badge)),
    featured: bool(form, "featured"),
    tags: csv(form, "tags"),
    stockCount: num(form, "stockCount"),
    sortOrder: int(form, "sortOrder", existing?.sortOrder ?? 0),
  });

  redirect(`/admin/products/${product._id}?saved=1`);
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  if (id) await remove("products", id);
  redirect("/admin/products?saved=Product+deleted.");
}

/** Quick toggles from the list view. */
export async function setProductStatus(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const status = str(form, "status", 20) as ProductStatus;
  const p = await getProduct(id);
  if (p && STATUS.includes(status)) {
    const { category: _c, image: _i, ...plain } = p;
    void _c;
    void _i;
    await upsert<Product>("products", { ...plain, status });
  }
  redirect("/admin/products");
}

export async function duplicateProduct(form: FormData) {
  await requireAdmin();
  const p = await getProduct(str(form, "id", 64));
  if (!p) redirect("/admin/products");
  const { category: _c, image: _i, _id: _id, createdAt: _ca, updatedAt: _ua, ...plain } = p;
  void _c;
  void _i;
  void _id;
  void _ca;
  void _ua;
  const copy = await upsert<Product>("products", {
    ...plain,
    name: `${p.name} (copy)`,
    slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`,
    status: "draft",
  });
  redirect(`/admin/products/${copy._id}?saved=Duplicated+as+a+draft.`);
}

export type _Unused = ReturnType<typeof json>;
