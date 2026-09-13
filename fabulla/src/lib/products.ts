/**
 * Catalog.
 *
 * Slugs, names, categories and prices are copied verbatim from the client's
 * live site so that inbound links and existing SEO keep resolving. No extra
 * inventory has been invented: the studio lists six pieces, so this file lists
 * six pieces. The products grid is built to look composed at that count rather
 * than padded out with placeholder stock.
 *
 * IMAGES: the live site sources all photography from Unsplash. Those exact
 * photo IDs are preserved here so the redesign is a like-for-like visual
 * comparison. They are stand-ins, not Fabulla's work. See README.
 */

export const CATEGORIES = [
  "Rings",
  "Chains",
  "Pendants",
  "Bracelets",
  "Earrings",
  "Watches",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Availability = "available" | "inquire" | "custom";

export type Product = {
  slug: string;
  name: string;
  category: Category | "Custom Pieces";
  /** null when the piece is quote-only. */
  price: number | null;
  priceNote?: string;
  blurb: string;
  detail: string;
  specs: { label: string; value: string }[];
  availability: Availability;
  image: string;
  /** Portrait / landscape drives the products grid rhythm. */
  orientation: "portrait" | "landscape" | "square";
  featured?: boolean;
};

const U = (id: string, w = 1200, q = 80) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=${q}`;

export const PRODUCTS: Product[] = [
  {
    slug: "radiant-cut-solitaire-ring",
    name: "Radiant Cut Solitaire Ring",
    category: "Rings",
    price: 4800,
    blurb: "2.5ct radiant cut in 18k white gold.",
    detail:
      "A single radiant-cut stone carried on a tapered 18k white gold band. The radiant cut keeps the brilliance of a round with the footprint of an emerald, which is why it reads larger than its carat weight across a room.",
    specs: [
      { label: "Centre stone", value: "2.5ct radiant cut" },
      { label: "Metal", value: "18k white gold" },
      { label: "Certification", value: "GIA" },
      { label: "Setting", value: "Four-claw solitaire" },
    ],
    availability: "available",
    image: U("photo-1605100804763-247f67b3557e"),
    orientation: "portrait",
    featured: true,
  },
  {
    slug: "cuban-link-chain-10k",
    name: "Cuban Link Chain 10mm",
    category: "Chains",
    price: 3200,
    blurb: "Solid 10mm Cuban link, hand-finished.",
    detail:
      "Solid links, hand-polished and box-clasped. Every link is individually soldered and stress-tested before finishing, which is the difference between a chain that keeps its shape and one that flattens inside a year.",
    specs: [
      { label: "Width", value: "10mm" },
      { label: "Construction", value: "Solid, hand-soldered" },
      { label: "Clasp", value: "Box clasp with safety latch" },
      { label: "Finish", value: "High polish" },
    ],
    availability: "available",
    image: U("photo-1611591437281-460bfbe1220a"),
    orientation: "square",
    featured: true,
  },
  {
    slug: "pave-diamond-tennis-bracelet",
    name: "Pave Diamond Tennis Bracelet",
    category: "Bracelets",
    price: 6500,
    blurb: "Continuous pave line, secured double clasp.",
    detail:
      "An unbroken line of pave-set stones on a flexible track, closed with a double clasp so it sits flat against the wrist. Matched for colour and clarity across the full length, which is the slow part of building one properly.",
    specs: [
      { label: "Setting", value: "Continuous pave" },
      { label: "Closure", value: "Double clasp" },
      { label: "Metal", value: "14k white gold" },
      { label: "Certification", value: "IGI" },
    ],
    availability: "available",
    image: U("photo-1763029513623-37d488cb97b1"),
    orientation: "portrait",
    featured: true,
  },
  {
    slug: "halo-engagement-ring",
    name: "Halo Engagement Ring",
    category: "Rings",
    price: 7200,
    blurb: "1.5ct round brilliant, double halo, platinum.",
    detail:
      "A round brilliant centre ringed by two concentric halos in platinum. The second halo is what carries the light outward, so the piece holds its presence in low light as well as it does under a showroom lamp.",
    specs: [
      { label: "Centre stone", value: "1.5ct round brilliant" },
      { label: "Metal", value: "Platinum" },
      { label: "Setting", value: "Double halo" },
      { label: "Certification", value: "GIA" },
    ],
    availability: "available",
    image: U("photo-1695238856436-caaa0e926030"),
    orientation: "portrait",
    featured: true,
  },
  {
    slug: "presidential-rolex-custom",
    name: "Custom Diamond Bezel Watch",
    category: "Watches",
    price: 18500,
    priceNote: "Starting at",
    blurb: "Bring your watch, or let us source one.",
    detail:
      "Bezel, lugs and dial work on a watch you already own, or on one we source for you. Stones are set by hand into a bezel cut to the reference, never a drop-in aftermarket part.",
    specs: [
      { label: "Service", value: "Bezel, lugs, dial" },
      { label: "Sourcing", value: "Yours or ours" },
      { label: "Setting", value: "Hand-set" },
      { label: "Timeline", value: "3 to 5 weeks" },
    ],
    availability: "inquire",
    image: U("photo-1523275335684-37898b6baf30"),
    orientation: "landscape",
  },
  {
    slug: "custom-engagement-ring",
    name: "Custom Engagement Ring",
    category: "Custom Pieces",
    price: null,
    priceNote: "Request a quote",
    blurb: "Fully custom, consultation to creation.",
    detail:
      "Start from a sketch, a photograph, or nothing at all. We design the piece, source the stone against your budget, and hand it over in two to four weeks.",
    specs: [
      { label: "Starting point", value: "Sketch, photo, or idea" },
      { label: "Stone", value: "Natural or lab-grown" },
      { label: "Timeline", value: "2 to 4 weeks" },
      { label: "Consultation", value: "Free" },
    ],
    availability: "custom",
    image: U("photo-1669859129504-b5bd6f844ade"),
    orientation: "portrait",
    featured: true,
  },
];

export const CATEGORY_ART: Record<Category, string> = {
  Rings: U("photo-1605100804763-247f67b3557e", 900),
  Chains: U("photo-1611591437281-460bfbe1220a", 900),
  Pendants: U("photo-1617038260897-41a1f14a8ca0", 900),
  Bracelets: U("photo-1763029513623-37d488cb97b1", 900),
  Earrings: U("photo-1535632066927-ab7c9ab60908", 900),
  Watches: U("photo-1523275335684-37898b6baf30", 900),
};

/** Editorial art used outside the catalog. */
export const ART = {
  hero: U("photo-1515562141207-7a88fb7ce338", 1600, 90),
  halo: U("photo-1695238856436-caaa0e926030", 1400, 90),
  solitaire: U("photo-1605100804763-247f67b3557e", 1400, 90),
  bench: U("photo-1596944924616-7b38e7cfac36", 1400, 85),
  surat: U("photo-1589128777073-263566ae5e4d", 1200),
  showroom: U("photo-1515562141207-7a88fb7ce338", 1200, 85),
  wide: U("photo-1653316889237-b5cc78e719c1", 1920),
} as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category?: string) {
  if (!category || category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export const FEATURED = PRODUCTS.filter((p) => p.featured);
