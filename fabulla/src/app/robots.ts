import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/repo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { brand } = await getSettings();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
