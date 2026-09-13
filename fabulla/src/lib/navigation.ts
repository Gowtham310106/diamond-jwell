/**
 * Circular category nav + mega-menu content.
 *
 * Mirrors the structure of the reference build's CATEGORIES export: each entry
 * drives one circle in the nav, the subcategory grid inside its mega panel,
 * and the editorial banner on the panel's right.
 *
 * Every `href` resolves to a real route on this site. The reference used "#"
 * placeholders throughout; dead links in a mega-menu are worse than a smaller
 * menu, so the lists here are scoped to filters that actually exist.
 */

import { ART, CATEGORY_ART } from "./products";

export type NavChild = { name: string; href: string };

export type NavCategory = {
  id: string;
  name: string;
  /** Circle thumbnail. */
  image: string;
  children: NavChild[];
  bannerImage: string;
  bannerTitle: string;
  bannerHref: string;
};

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "all",
    name: "All Jewelry",
    image: ART.wide,
    bannerImage: ART.hero,
    bannerTitle: "Every piece in the studio, natural and lab-grown.",
    bannerHref: "/products",
    children: [
      { name: "All products", href: "/products" },
      { name: "Rings", href: "/products?category=Rings" },
      { name: "Chains", href: "/products?category=Chains" },
      { name: "Pendants", href: "/products?category=Pendants" },
      { name: "Bracelets", href: "/products?category=Bracelets" },
      { name: "Earrings", href: "/products?category=Earrings" },
      { name: "Watches", href: "/products?category=Watches" },
      { name: "Custom work", href: "/custom" },
    ],
  },
  {
    id: "rings",
    name: "Rings",
    image: CATEGORY_ART.Rings,
    bannerImage: ART.halo,
    bannerTitle: "Engagement rings, built around your stone.",
    bannerHref: "/products?category=Rings",
    children: [
      { name: "All rings", href: "/products?category=Rings" },
      { name: "Solitaire", href: "/products/radiant-cut-solitaire-ring" },
      { name: "Halo", href: "/products/halo-engagement-ring" },
      { name: "Custom engagement", href: "/products/custom-engagement-ring" },
      { name: "Design your own", href: "/custom" },
      { name: "Book a consultation", href: "/contact" },
    ],
  },
  {
    id: "chains",
    name: "Chains",
    image: CATEGORY_ART.Chains,
    bannerImage: CATEGORY_ART.Chains,
    bannerTitle: "Solid links, soldered and stress-tested by hand.",
    bannerHref: "/products?category=Chains",
    children: [
      { name: "All chains", href: "/products?category=Chains" },
      { name: "Cuban link", href: "/products/cuban-link-chain-10k" },
      { name: "Custom chains", href: "/custom" },
      { name: "Pendants", href: "/products?category=Pendants" },
    ],
  },
  {
    id: "pendants",
    name: "Pendants",
    image: CATEGORY_ART.Pendants,
    bannerImage: CATEGORY_ART.Pendants,
    bannerTitle: "Pendants cut and set to your own drawing.",
    bannerHref: "/products?category=Pendants",
    children: [
      { name: "All pendants", href: "/products?category=Pendants" },
      { name: "Custom pendants", href: "/custom" },
      { name: "Pair with a chain", href: "/products?category=Chains" },
    ],
  },
  {
    id: "bracelets",
    name: "Bracelets",
    image: CATEGORY_ART.Bracelets,
    bannerImage: CATEGORY_ART.Bracelets,
    bannerTitle: "Tennis bracelets, matched across the full line.",
    bannerHref: "/products?category=Bracelets",
    children: [
      { name: "All bracelets", href: "/products?category=Bracelets" },
      { name: "Tennis", href: "/products/pave-diamond-tennis-bracelet" },
      { name: "Custom bracelets", href: "/custom" },
    ],
  },
  {
    id: "earrings",
    name: "Earrings",
    image: CATEGORY_ART.Earrings,
    bannerImage: CATEGORY_ART.Earrings,
    bannerTitle: "Studs and drops, set to your carat weight.",
    bannerHref: "/products?category=Earrings",
    children: [
      { name: "All earrings", href: "/products?category=Earrings" },
      { name: "Custom earrings", href: "/custom" },
      { name: "Book a consultation", href: "/contact" },
    ],
  },
  {
    id: "watches",
    name: "Watches",
    image: CATEGORY_ART.Watches,
    bannerImage: CATEGORY_ART.Watches,
    bannerTitle: "Bezel and dial work on your watch, or one we source.",
    bannerHref: "/products?category=Watches",
    children: [
      { name: "All watches", href: "/products?category=Watches" },
      { name: "Diamond bezel", href: "/products/presidential-rolex-custom" },
      { name: "Bring your own", href: "/contact" },
    ],
  },
  {
    id: "custom",
    name: "Custom",
    image: ART.bench,
    bannerImage: ART.bench,
    bannerTitle: "From a sketch, a photo, or nothing at all.",
    bannerHref: "/custom",
    children: [
      { name: "How it works", href: "/custom" },
      { name: "Natural or lab-grown", href: "/custom" },
      { name: "Start a custom piece", href: "/contact" },
      { name: "Our story", href: "/about" },
    ],
  },
];

/**
 * Cinematic intro. Four full-viewport screens that stack and pin, the pattern
 * the reference build opens with. Screens one to three are macro footage;
 * the fourth is a still so the sequence resolves onto a photograph.
 */
export type IntroScreen = {
  kind: "video" | "image";
  src: string;
  title: string;
  subtitle: string;
};

export const INTRO_SCREENS: IntroScreen[] = [
  {
    kind: "video",
    src: "/video/intro-solitaire.mp4",
    title: "Fabulla",
    subtitle: "Diamonds crafted beyond compare",
  },
  {
    kind: "video",
    src: "/video/intro-couture.mp4",
    title: "The Diamond Edit",
    subtitle: "Natural and lab-grown, certified either way",
  },
  {
    kind: "video",
    src: "/video/intro-bench.mp4",
    title: "At the Bench",
    subtitle: "Set and finished by hand in Chicago",
  },
  {
    kind: "image",
    src: ART.hero,
    title: "Made For You",
    subtitle: "Concept to completion in two to four weeks",
  },
];

/** Hero carousel banners, shown once the intro has scrolled past. */
export type Banner = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

export const BANNERS: Banner[] = [
  {
    image: ART.halo,
    eyebrow: "Signature",
    title: "The Engagement Edit",
    description:
      "Solitaires and halos built around a stone we source to your budget, natural or lab-grown.",
    href: "/products?category=Rings",
  },
  {
    image: CATEGORY_ART.Chains,
    eyebrow: "Hand-finished",
    title: "Solid Cuban Links",
    description:
      "Every link individually soldered and stress-tested, so it keeps its shape for a lifetime.",
    href: "/products?category=Chains",
  },
  {
    image: ART.bench,
    eyebrow: "Bespoke",
    title: "Your Vision, Our Craft",
    description:
      "Bring a sketch, a photo, or a feeling. We design, source and build it in two to four weeks.",
    href: "/custom",
  },
  {
    image: CATEGORY_ART.Bracelets,
    eyebrow: "Matched line",
    title: "Pave Tennis Bracelets",
    description:
      "Colour and clarity matched across the full length. That matching is the slow part.",
    href: "/products?category=Bracelets",
  },
];
