import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The client's existing site sources its photography from Unsplash.
    // Preserved so the redesign renders the same asset set until real
    // Fabulla product photography is shot. See README "Image assets".
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
