import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aura | Premium Fine Jewellery, Gold & Diamonds",
  description: "Explore Aura: gold jewellery, diamond rings, necklaces, earrings and bespoke craftsmanship.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Aura | Premium Fine Jewellery",
    description: "Hand-crafted certified diamond jewelry, loose solitaires, and luxury bridal collections.",
    siteName: "Aura Diamonds & Jewellery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
