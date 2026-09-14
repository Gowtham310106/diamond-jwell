"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { bool, int, list, str, urls } from "@/lib/cms/forms";
import { getCollection, listCollections, remove, slugify, upsert } from "@/lib/cms/repo";
import type { Collection } from "@/lib/cms/types";

export async function saveCollection(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const existing = id ? await getCollection(id) : null;
  const name = str(form, "name", 80);
  if (!name) redirect(`/admin/collections/${id || "new"}?error=${encodeURIComponent("A collection needs a name.")}`);

  let slug = slugify(str(form, "slug", 80) || name);
  const others = (await listCollections()).filter((c) => c._id !== existing?._id);
  if (others.some((c) => c.slug === slug)) slug = `${slug}-2`;

  const saved = await upsert<Collection>("collections", {
    _id: existing?._id,
    createdAt: existing?.createdAt,
    name,
    slug,
    description: str(form, "description", 300),
    image: urls(form, "image")[0] ?? "",
    productIds: list(form, "productIds"),
    sortOrder: int(form, "sortOrder", existing?.sortOrder ?? others.length + 1),
    featured: bool(form, "featured"),
  });
  redirect(`/admin/collections/${saved._id}?saved=1`);
}

export async function deleteCollection(form: FormData) {
  await requireAdmin();
  await remove("collections", str(form, "id", 64));
  redirect("/admin/collections?saved=Collection+deleted.");
}
