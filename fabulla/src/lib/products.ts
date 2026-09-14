/**
 * Catalog.
 *
 * Slugs, names, categories and prices are copied verbatim from the client's
 * live site so that inbound links and existing SEO keep resolving. No extra
 * inventory has been invented: the studio lists six pieces, so this file lists
 * six pieces. The products grid is built to look composed at that count rather
 * than padded out with placeholder stock.
 *
 * IMAGES: the studio's own photography, supplied by the client and served from
 * /public/images. `A` builds those paths; `U` remains only for the one slot
 * with no real shot yet (Earrings), so that gap stays visible in a diff rather
 * than hiding behind a lookalike. See README "Image assets".
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

/** Client photography in /public/images. */
const A = (file: string) => `/images/${file}`;

/** Unsplash stand-in. Only Earrings still needs one. */
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
    image: A("ring-radiant-two-tone.jpg"),
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
    image: A("chain-cuban-yellow-gold.jpg"),
    orientation: "portrait",
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
    image: A("tennis-bracelet-watch-case.jpg"),
    orientation: "square",
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
    image: A("ring-round-halo-pave.jpg"),
    orientation: "landscape",
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
    image: A("watch-datejust-iced.jpg"),
    orientation: "portrait",
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
    image: A("ring-emerald-cut-pave.jpg"),
    orientation: "portrait",
    featured: true,
  },
];

export const CATEGORY_ART: Record<Category, string> = {
  Rings: A("ring-emerald-cut-pave.jpg"),
  Chains: A("chain-cuban-white-gold.jpg"),
  Pendants: A("pendant-gold-bead-set.jpg"),
  // The piece runs corner to corner in frame, so it survives the landscape
  // crop the bento tile and the banner both take. The boxed pave bangle does
  // not: a wide centre crop of it is mostly box lid.
  Bracelets: A("bracelet-cuban-crown-stones.jpg"),
  // No earring photography supplied yet. Stand-in until the client shoots one;
  // the category is live in the nav, so it cannot go empty.
  Earrings: U("photo-1535632066927-ab7c9ab60908", 900),
  Watches: A("watch-sky-dweller-iced.jpg"),
};

/**
 * Editorial art used outside the catalog.
 *
 * Keys name what the photograph shows, not where it happens to be used, so a
 * section can be re-pointed without the name going stale. Dark-ground frames
 * are the ones that can sit under overlaid type; the white-ground halo shot is
 * kept for the banner that carries its text beside the image, not over it.
 *
 * `surat` and `CATEGORY_ART.Bracelets` are deliberately the same frame: it is
 * the only supplied photograph with loose stones in it, and it is also the
 * bracelet that crops best. Split them when a second stone shot lands.
 *
 * The custom Interstate piece ships cropped to the pendant. The frame as
 * supplied has another jeweller's logo across the backdrop, which cannot run
 * on this site at any size; the crop keeps the piece and drops the backdrop.
 * It is small (345x301) after that, so it stays at highlight-tile size.
 */
export const ART = {
  /** Mixed inventory in one case: the "everything in the studio" frame. */
  hero: A("tennis-bracelet-watch-case.jpg"),
  halo: A("ring-round-halo-pave.jpg"),
  /** Emerald cut on black: the editorial frame in Campaign. */
  solitaire: A("ring-emerald-cut-pave.jpg"),
  /** Hand-engraved two-tone setting: the bench/custom story. */
  bench: A("ring-radiant-two-tone.jpg"),
  /** Loose stones beside a finished piece: the sourcing story. */
  surat: A("bracelet-cuban-crown-stones.jpg"),
  showroom: A("showroom-rope-chain-coins.jpg"),
  /** Boxed designer piece: the sourced-to-order side of the studio. */
  designer: A("bracelet-love-pave-boxed.jpg"),
  wide: A("watch-lineup-iced.jpg"),
} as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category?: string) {
  if (!category || category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export const FEATURED = PRODUCTS.filter((p) => p.featured);
