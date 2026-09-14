import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/cms/repo";

/**
 * TYPE SYSTEM
 *
 * Retired from the previous build: Fraunces (display) and Inter Tight (body).
 * Both are the default reach for this kind of brief and made the site read as
 * templated rather than as a jeweller.
 *
 * Cormorant Garamond replaces Fraunces. It is a high-contrast old-style face
 * whose sharp, engraved serifs and hairline strokes mirror the faceting of a
 * cut stone, which is the literal subject of the business, and it carries the
 * generational-craft half of the Surat story that a geometric face cannot.
 *
 * Geist replaces Inter Tight for body and UI: neutral, modern, and quiet
 * enough that it never competes with the display face.
 *
 * This root layout carries only fonts, metadata and the body. The storefront
 * chrome lives in (site)/layout.tsx and the admin panel in admin/(panel).
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, brand } = await getSettings();
  return {
    metadataBase: new URL(brand.url),
    title: { default: seo.title, template: `%s | ${brand.name}` },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: brand.name,
      locale: "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // Next 16 stopped neutralising CSS smooth-scroll during route changes.
      // This attribute restores the snappy navigation behaviour while keeping
      // smooth scrolling for in-page anchors.
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/*
          Scroll-reveal elements are server-rendered at opacity 0 and only
          become visible once Motion hydrates. If JavaScript is blocked, fails,
          or a crawler renders without it, the page would otherwise be blank.
          This forces every tagged element visible when scripting is off.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
