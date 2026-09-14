"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { bool, int, rows, str, urls } from "@/lib/cms/forms";
import { getCategory, listAllProducts, listCategories, remove, slugify, upsert } from "@/lib/cms/repo";
import type { Category } from "@/lib/cms/types";

export async function saveCategory(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const existing = id ? await getCategory(id) : null;
  const name = str(form, "name", 80);
  if (!name) redirect(`/admin/categories/${id || "new"}?error=${encodeURIComponent("A category needs a name.")}`);

  let slug = slugify(str(form, "slug", 80) || name);
  const others = (await listCategories()).filter((c) => c._id !== existing?._id);
  if (others.some((c) => c.slug === slug)) slug = `${slug}-2`;

  const saved = await upsert<Category>("categories", {
    _id: existing?._id,
    createdAt: existing?.createdAt,
    name,
    slug,
    description: str(form, "description", 300),
    image: urls(form, "image")[0] ?? "",
    bannerImage: urls(form, "bannerImage")[0] ?? "",
    bannerTitle: str(form, "bannerTitle", 120),
    children: rows<{ name: string; href: string }>(form, "children").filter((r) => r.name && r.href),
    sortOrder: int(form, "sortOrder", existing?.sortOrder ?? others.length + 1),
    showInNav: bool(form, "showInNav"),
    showInBento: bool(form, "showInBento"),
  });
  redirect(`/admin/categories/${saved._id}?saved=1`);
}

export async function deleteCategory(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const inUse = (await listAllProducts()).filter((p) => p.categoryId === id).length;
  if (inUse > 0) {
    redirect(`/admin/categories/${id}?error=${encodeURIComponent(`${inUse} product(s) still use this category. Move them first.`)}`);
  }
  await remove("categories", id);
  redirect("/admin/categories?saved=Category+deleted.");
}
