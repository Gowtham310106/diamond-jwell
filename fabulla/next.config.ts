import type { NextConfig } from "next";

/**
 * Remote image hosts next/image may optimise from:
 *   - the Cloudflare R2 public URL (custom domain or *.r2.dev), read from the
 *     same env var storage.ts uses, so there is one place to set it;
 *   - images.unsplash.com, only for the Earrings stand-in that has no
 *     photograph yet.
 */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "*.r2.dev", pathname: "/**" },
];

try {
  const host = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  if (host && !host.endsWith(".r2.dev")) remotePatterns.push({ protocol: "https", hostname: host, pathname: "/**" });
} catch {
  // A malformed R2_PUBLIC_URL is reported by the admin Integrations page.
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Next 16 narrowed the default to [75]; we serve two tiers so hero art
    // can be sharper than grid thumbnails without unbounded enumeration.
    qualities: [70, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
