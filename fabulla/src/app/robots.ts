import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/repo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { brand } = await getSettings();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin and APIs, plus catalog URLs with a sort, a page number or
        // more than one filter: every one of those is a server render, and
        // the single-filter pages plus the sitemap already reach every product.
        disallow: ["/admin", "/api", "/*?*sort=", "/*?*page=", "/*?*q=", "/products?*&"],
      },
    ],
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
