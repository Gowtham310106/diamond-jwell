import type { MetadataRoute } from "next";
import { getSettings, listCategories, listPublished } from "@/lib/cms/repo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, products, categories] = await Promise.all([getSettings(), listPublished(), listCategories()]);
  const base = settings.brand.url;

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({ url: `${base}/products?category=${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/custom`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];
}
