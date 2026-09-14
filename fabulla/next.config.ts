import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fabulla's own photography is served from /public/images and needs no
    // pattern here. This entry covers the single remaining stand-in, the
    // Earrings category art, and can be deleted with it. See README
    // "Image assets".
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    // Next 16 narrowed the default to [75]; we serve two tiers so hero art
    // can be sharper than grid thumbnails without unbounded enumeration.
    qualities: [70, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
