/**
 * Seed content.
 *
 * What an empty collection is filled with on first read: the studio's real
 * catalog, photography and copy. Ids are deterministic (`cat_rings`,
 * `prod_round-halo-engagement-ring`) so environments line up.
 */

import type {
  Category,
  Collection,
  CollectionName,
  Faq,
  MediaAsset,
  Product,
  Settings,
} from "./types";

const T = "2026-09-16T00:00:00.000Z";
const stamp = { createdAt: T, updatedAt: T };
const pImg = (folder: string, shot: string) => `/images/products/${folder}/${shot}.png`;

/* ------------------------------------------------------------------------ */
/* Categories                                                                */
/* ------------------------------------------------------------------------ */

const categories: Category[] = [
  {
    _id: "cat_rings",
    name: "Rings",
    slug: "rings",
    description: "Solitaires, halos and fully custom engagement rings.",
    image: pImg("05-emerald-cut-ring", "front-white"),
    bannerImage: pImg("01-round-halo-ring", "front-white"),
    bannerTitle: "Engagement rings, built around your stone.",
    children: [
      { name: "All rings", href: "/products?category=rings" },
      { name: "Solitaire", href: "/products/radiant-cut-solitaire-ring" },
      { name: "Round Halo", href: "/products/round-halo-engagement-ring" },
      { name: "Emerald Cut", href: "/products/emerald-cut-double-pave-ring" },
      { name: "Design your own", href: "/custom" },
      { name: "Book a consultation", href: "/contact" },
    ],
    sortOrder: 1,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
  {
    _id: "cat_chains",
    name: "Chains",
    slug: "chains",
    description: "Solid links, soldered and stress-tested by hand.",
    image: pImg("04-white-cuban-chain", "front-white"),
    bannerImage: pImg("08-gold-cuban-clasp", "front-white"),
    bannerTitle: "Solid links, soldered and stress-tested by hand.",
    children: [
      { name: "All chains", href: "/products?category=chains" },
      { name: "Yellow Gold Cuban", href: "/products/cuban-link-chain-10k" },
      { name: "White Gold Cuban", href: "/products/white-gold-cuban-link-chain" },
      { name: "Crown Cuban", href: "/products/crown-motif-diamond-cuban-chain" },
      { name: "Graduated Collar", href: "/products/graduated-baguette-diamond-necklace" },
      { name: "Custom chains", href: "/custom" },
    ],
    sortOrder: 2,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
  {
    _id: "cat_pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Pendants cut and set to your own drawing.",
    image: pImg("06-gold-bead-pendant", "front-white"),
    bannerImage: pImg("03-shield-pendant-chain", "front-white"),
    bannerTitle: "Pendants cut and set to your own drawing.",
    children: [
      { name: "All pendants", href: "/products?category=pendants" },
      { name: "Shield Pendant", href: "/products/shield-motif-diamond-pendant" },
      { name: "Calligraphy Medallion", href: "/products/gold-bead-calligraphy-pendant" },
      { name: "Custom Nameplate", href: "/products/custom-nameplate-diamond-pendant" },
      { name: "Pair with a chain", href: "/products?category=chains" },
    ],
    sortOrder: 3,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
  {
    _id: "cat_bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Tennis lines, cuffs and bangles, matched stone for stone.",
    image: pImg("11-rose-gold-bangle", "front-white"),
    bannerImage: pImg("12-three-clover-bracelet", "front-white"),
    bannerTitle: "Bracelets, matched stone for stone.",
    children: [
      { name: "All bracelets", href: "/products?category=bracelets" },
      { name: "Rose Gold Pave Bangle", href: "/products/rose-gold-pave-screw-bangle" },
      { name: "Three Clover Bracelet", href: "/products/three-clover-motif-bracelet" },
      { name: "Custom bracelets", href: "/custom" },
    ],
    sortOrder: 4,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
  {
    _id: "cat_earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Studs and drops, set to your carat weight.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&auto=format&fit=crop&q=80",
    bannerTitle: "Studs and drops, set to your carat weight.",
    children: [
      { name: "All earrings", href: "/products?category=earrings" },
      { name: "Custom earrings", href: "/custom" },
      { name: "Book a consultation", href: "/contact" },
    ],
    sortOrder: 5,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
  {
    _id: "cat_watches",
    name: "Watches",
    slug: "watches",
    description: "Bezel and dial diamond work on your watch, or one we source.",
    image: pImg("09-rolex-datejust-corrected", "front-white"),
    bannerImage: pImg("14-black-dial-watch", "front-white"),
    bannerTitle: "Bezel and dial work on your watch, or one we source.",
    children: [
      { name: "All watches", href: "/products?category=watches" },
      { name: "Rolex Datejust 41", href: "/products/custom-diamond-rolex-datejust" },
      { name: "Rolex Sky-Dweller", href: "/products/rolex-sky-dweller-diamond-black-dial" },
      { name: "Bring your own", href: "/contact" },
    ],
    sortOrder: 6,
    showInNav: true,
    showInBento: true,
    ...stamp,
  },
];

/* ------------------------------------------------------------------------ */
/* Products                                                                  */
/* ------------------------------------------------------------------------ */

const product = (
  p: Partial<Product> &
    Pick<
      Product,
      | "slug"
      | "name"
      | "categoryId"
      | "price"
      | "blurb"
      | "detail"
      | "specs"
      | "availability"
      | "images"
      | "orientation"
    >
): Product => ({
  _id: `prod_${p.slug}`,
  sku: "",
  collectionIds: [],
  compareAtPrice: null,
  priceNote: "",
  metal: "",
  stone: "",
  caratWeight: "",
  status: "published",
  video: "",
  badges: [],
  featured: false,
  tags: [],
  stockCount: null,
  sortOrder: 0,
  ...stamp,
  ...p,
});

const products: Product[] = [
  product({
    slug: "round-halo-engagement-ring",
    name: "Round Halo Diamond Engagement Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit"],
    price: 7200,
    blurb: "1.5ct round brilliant centre in a double halo setting, platinum.",
    detail:
      "A round brilliant centre ringed by two concentric halos in platinum with a multi-row pave band. The second halo carries the light outward, ensuring the piece holds its brilliant presence across the room and under showroom lights.",
    specs: [
      { label: "Centre stone", value: "1.5ct round brilliant" },
      { label: "Metal", value: "Platinum" },
      { label: "Setting", value: "Double halo, multi-row pave band" },
      { label: "Certification", value: "GIA" },
    ],
    metal: "Platinum",
    stone: "Natural diamond",
    caratWeight: "1.5ct",
    availability: "available",
    images: [
      pImg("01-round-halo-ring", "front-white"),
      pImg("01-round-halo-ring", "three-quarter-white"),
      pImg("01-round-halo-ring", "side-white"),
      pImg("01-round-halo-ring", "macro-white"),
    ],
    orientation: "square",
    badges: ["bestseller"],
    featured: true,
    sortOrder: 1,
  }),
  product({
    slug: "radiant-cut-solitaire-ring",
    name: "Radiant Cut Scrollwork Solitaire Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit", "col_bespoke"],
    price: 4800,
    blurb: "2.5ct radiant cut in hand-engraved 18k yellow gold.",
    detail:
      "A single elongated radiant-cut stone carried on a hand-engraved scrollwork 18k yellow gold band with white-metal corner prongs. The radiant cut keeps the fire of a brilliant with the elegant footprint of an emerald cut.",
    specs: [
      { label: "Centre stone", value: "2.5ct radiant cut" },
      { label: "Metal", value: "18k yellow gold & white metal" },
      { label: "Band", value: "Hand-engraved scrollwork" },
      { label: "Certification", value: "GIA" },
    ],
    metal: "18k yellow gold",
    stone: "Natural diamond",
    caratWeight: "2.5ct",
    availability: "available",
    images: [
      pImg("02-gold-rectangular-ring", "front-white"),
      pImg("02-gold-rectangular-ring", "three-quarter-white"),
      pImg("02-gold-rectangular-ring", "side-white"),
      pImg("02-gold-rectangular-ring", "macro-white"),
    ],
    orientation: "square",
    badges: ["new"],
    featured: true,
    sortOrder: 2,
  }),
  product({
    slug: "shield-motif-diamond-pendant",
    name: "Two-Tone Shield Motif Diamond Pendant & Chain",
    categoryId: "cat_pendants",
    collectionIds: ["col_bespoke"],
    price: 5400,
    blurb: "Two-tone angular diamond link necklace with sculpted shield pendant.",
    detail:
      "A bespoke two-tone necklace featuring angular pave diamond links, rose-gold architectural ornaments, a sculpted leaf-shaped bail, and a dimensional shield pendant with horse relief in full diamond pave.",
    specs: [
      { label: "Pendant", value: "Sculpted shield with horse relief" },
      { label: "Metal", value: "14k two-tone gold (yellow & rose)" },
      { label: "Stone", value: "Hand-set brilliant diamonds" },
      { label: "Chain", value: "Custom angular diamond link" },
    ],
    metal: "14k two-tone gold",
    stone: "Natural diamond",
    caratWeight: "3.2ct",
    availability: "available",
    images: [
      pImg("03-shield-pendant-chain", "front-white"),
      pImg("03-shield-pendant-chain", "three-quarter-white"),
      pImg("03-shield-pendant-chain", "side-white"),
      pImg("03-shield-pendant-chain", "macro-white"),
    ],
    orientation: "portrait",
    badges: ["custom"],
    featured: true,
    sortOrder: 3,
  }),
  product({
    slug: "white-gold-cuban-link-chain",
    name: "White Gold Diamond Cuban Link Chain 12mm",
    categoryId: "cat_chains",
    collectionIds: ["col_cuban-links"],
    price: 8900,
    blurb: "Solid 12mm white gold links with broad rectangular pave clasp.",
    detail:
      "Solid 14k white gold Cuban links with an unbroken setting of brilliant round diamonds and a signature heavy box clasp. Each link is hand-soldered, aligned, and stress-tested in the Chicago workshop.",
    specs: [
      { label: "Width", value: "12mm" },
      { label: "Metal", value: "14k white gold" },
      { label: "Setting", value: "Full pave, hand-set" },
      { label: "Clasp", value: "Rectangular box clasp with dual safety" },
    ],
    metal: "14k white gold",
    stone: "Natural diamond",
    caratWeight: "18.5ct",
    availability: "available",
    images: [
      pImg("04-white-cuban-chain", "front-white"),
      pImg("04-white-cuban-chain", "three-quarter-white"),
      pImg("04-white-cuban-chain", "side-white"),
      pImg("04-white-cuban-chain", "macro-white"),
    ],
    orientation: "square",
    badges: ["bestseller"],
    featured: true,
    sortOrder: 4,
  }),
  product({
    slug: "emerald-cut-double-pave-ring",
    name: "Emerald Cut Double Pave Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit"],
    price: 6400,
    blurb: "2.0ct emerald cut flanked by a double-row pave band.",
    detail:
      "An elongated emerald-cut diamond in four corner prongs, resting on a white-metal band split into two rows of micro-pave diamonds. The step-cut faceting creates hall-of-mirrors clarity paired with intense scintillation along the shank.",
    specs: [
      { label: "Centre stone", value: "2.0ct emerald cut" },
      { label: "Metal", value: "18k white gold" },
      { label: "Band", value: "Double-row micro-pave" },
      { label: "Certification", value: "GIA" },
    ],
    metal: "18k white gold",
    stone: "Natural diamond",
    caratWeight: "2.0ct",
    availability: "available",
    images: [
      pImg("05-emerald-cut-ring", "front-white"),
      pImg("05-emerald-cut-ring", "three-quarter-white"),
      pImg("05-emerald-cut-ring", "side-white"),
      pImg("05-emerald-cut-ring", "macro-white"),
    ],
    orientation: "square",
    badges: ["new"],
    featured: true,
    sortOrder: 5,
  }),
  product({
    slug: "gold-bead-calligraphy-pendant",
    name: "Gold Bead Calligraphy Medallion Pendant",
    categoryId: "cat_pendants",
    collectionIds: ["col_bespoke"],
    price: 3600,
    blurb: "Solid yellow gold bead chain with diamond calligraphy medallion.",
    detail:
      "Handmade solid gold beaded necklace carrying a circular medallion inscribed with intricate Arabic calligraphy and framed with round brilliant diamond accents.",
    specs: [
      { label: "Pendant", value: "Circular calligraphy medallion" },
      { label: "Chain", value: "Hand-beaded 18k yellow gold" },
      { label: "Metal", value: "18k yellow gold" },
      { label: "Accent stones", value: "Brilliant diamonds" },
    ],
    metal: "18k yellow gold",
    stone: "Natural diamond",
    caratWeight: "1.2ct",
    availability: "available",
    images: [
      pImg("06-gold-bead-pendant", "front-white"),
      pImg("06-gold-bead-pendant", "three-quarter-white"),
      pImg("06-gold-bead-pendant", "side-white"),
      pImg("06-gold-bead-pendant", "macro-white"),
    ],
    orientation: "portrait",
    badges: ["custom"],
    featured: false,
    sortOrder: 6,
  }),
  product({
    slug: "cuban-link-chain-10k",
    name: "Yellow Gold Pave Cuban Link Chain 10mm",
    categoryId: "cat_chains",
    collectionIds: ["col_cuban-links"],
    price: 3200,
    blurb: "Solid 10mm yellow gold Cuban links with diamond pave box clasp.",
    detail:
      "Solid links, hand-polished and fitted with our signature rectangular pave diamond box clasp. Every link is individually soldered and stress-tested before finishing, guaranteeing lifetime structure.",
    specs: [
      { label: "Width", value: "10mm" },
      { label: "Construction", value: "Solid, hand-soldered" },
      { label: "Clasp", value: "Diamond pave box clasp with safety latch" },
      { label: "Finish", value: "High polish" },
    ],
    metal: "14k yellow gold",
    stone: "Pave diamonds",
    caratWeight: "4.5ct",
    availability: "available",
    images: [
      pImg("08-gold-cuban-clasp", "front-white"),
      pImg("08-gold-cuban-clasp", "three-quarter-white"),
      pImg("08-gold-cuban-clasp", "side-white"),
      pImg("08-gold-cuban-clasp", "macro-white"),
    ],
    orientation: "square",
    badges: ["bestseller"],
    featured: true,
    sortOrder: 7,
  }),
  product({
    slug: "custom-diamond-rolex-datejust",
    name: "Custom Diamond Rolex Datejust 41",
    categoryId: "cat_watches",
    collectionIds: ["col_bespoke"],
    price: 22500,
    priceNote: "Starting at",
    blurb: "Diamond pave case, baguette & pave bracelet, custom datejust.",
    detail:
      "Custom diamond setting on a Rolex Datejust 41. Fully paved round case with hand-set brilliant stones, bespoke bezel, and integrated Oyster bracelet with alternating baguette and round pave center links. Available on your watch or sourced by our Chicago studio.",
    specs: [
      { label: "Base watch", value: "Rolex Datejust 41" },
      { label: "Setting", value: "Full pave case, baguette & pave bracelet" },
      { label: "Metal", value: "Stainless steel & white gold" },
      { label: "Diamond quality", value: "VS1-VS2, F-G colour" },
    ],
    metal: "Stainless steel & white gold",
    stone: "Natural diamond",
    caratWeight: "15.0ct",
    availability: "inquire",
    images: [
      pImg("09-rolex-datejust-corrected", "front-white"),
      pImg("09-rolex-datejust-corrected", "three-quarter-white"),
      pImg("09-rolex-datejust-corrected", "side-white"),
      pImg("09-rolex-datejust-corrected", "macro-white"),
    ],
    orientation: "portrait",
    badges: ["custom"],
    featured: true,
    sortOrder: 8,
  }),
  product({
    slug: "crown-motif-diamond-cuban-chain",
    name: "Crown Motif Diamond Cuban Chain",
    categoryId: "cat_chains",
    collectionIds: ["col_cuban-links"],
    price: 7800,
    blurb: "Two-tone diamond Cuban link chain with sculpted crown centerpiece.",
    detail:
      "Solid Cuban chain with high-grade pave diamonds, highlighted by a sculpted imperial crown centerpiece and custom box closure in two-tone rose and yellow gold.",
    specs: [
      { label: "Feature", value: "Sculpted imperial crown motif" },
      { label: "Metal", value: "14k rose and yellow gold" },
      { label: "Setting", value: "Full pave brilliant diamonds" },
      { label: "Clasp", value: "Integrated hidden box clasp" },
    ],
    metal: "14k rose and yellow gold",
    stone: "Natural diamond",
    caratWeight: "8.5ct",
    availability: "available",
    images: [
      pImg("10-crown-chain", "front-white"),
      pImg("10-crown-chain", "three-quarter-white"),
      pImg("10-crown-chain", "side-white"),
      pImg("10-crown-chain", "macro-white"),
    ],
    orientation: "square",
    badges: ["bestseller"],
    featured: false,
    sortOrder: 9,
  }),
  product({
    slug: "rose-gold-pave-screw-bangle",
    name: "Rose Gold Pave Screw Bangle",
    categoryId: "cat_bracelets",
    collectionIds: ["col_bespoke"],
    price: 4200,
    blurb: "18k rose gold oval bangle precision set with brilliant diamond rows.",
    detail:
      "Oval ergonomic bangle in solid 18k rose gold, adorned with alternating screw motifs and double-row brilliant cut diamond pave. Fitted with a secure concealed hinge mechanism.",
    specs: [
      { label: "Metal", value: "18k rose gold" },
      { label: "Setting", value: "Multi-row precision pave" },
      { label: "Motif", value: "Alternating screw design" },
      { label: "Closure", value: "Concealed hinge and push-lock" },
    ],
    metal: "18k rose gold",
    stone: "Natural diamond",
    caratWeight: "2.8ct",
    availability: "available",
    images: [
      pImg("11-rose-gold-bangle", "front-white"),
      pImg("11-rose-gold-bangle", "three-quarter-white"),
      pImg("11-rose-gold-bangle", "side-white"),
      pImg("11-rose-gold-bangle", "macro-white"),
    ],
    orientation: "square",
    badges: ["new"],
    featured: true,
    sortOrder: 10,
  }),
  product({
    slug: "three-clover-motif-bracelet",
    name: "Three Clover Motif Chain Bracelet",
    categoryId: "cat_bracelets",
    collectionIds: ["col_bespoke"],
    price: 2800,
    blurb: "Delicate yellow gold cable chain with three diamond pave clover motifs.",
    detail:
      "Three four-lobed clover motifs finished with beaded golden rims and full micro-pave diamond centers, linked along a fine 18k yellow gold cable chain.",
    specs: [
      { label: "Metal", value: "18k yellow gold" },
      { label: "Motifs", value: "Three clover stations with beaded edging" },
      { label: "Setting", value: "Micro-pave diamonds" },
      { label: "Clasp", value: "Lobster clasp with sizing rings" },
    ],
    metal: "18k yellow gold",
    stone: "Natural diamond",
    caratWeight: "1.5ct",
    availability: "available",
    images: [
      pImg("12-three-clover-bracelet", "front-white"),
      pImg("12-three-clover-bracelet", "three-quarter-white"),
      pImg("12-three-clover-bracelet", "side-white"),
      pImg("12-three-clover-bracelet", "macro-white"),
    ],
    orientation: "square",
    badges: ["bestseller"],
    featured: false,
    sortOrder: 11,
  }),
  product({
    slug: "rolex-sky-dweller-diamond-black-dial",
    name: "Rolex Sky-Dweller Diamond Black Dial",
    categoryId: "cat_watches",
    collectionIds: ["col_bespoke"],
    price: 34000,
    priceNote: "Starting at",
    blurb: "Fully iced Rolex Sky-Dweller with black Arabic dial & 24-hr ring.",
    detail:
      "Custom high-carat setting on a Rolex Sky-Dweller. Deep black dial with iced Arabic numerals, contrasting 24-hour off-center disc, diamond-pave bezel, case, and solid Jubilee-style links.",
    specs: [
      { label: "Base watch", value: "Rolex Sky-Dweller" },
      { label: "Dial", value: "Black dial, iced Arabic numerals, 24-hr ring" },
      { label: "Metal", value: "White gold & stainless steel" },
      { label: "Diamond setting", value: "Full case, bezel & bracelet" },
    ],
    metal: "White gold & stainless steel",
    stone: "Natural diamond",
    caratWeight: "22.0ct",
    availability: "inquire",
    images: [
      pImg("14-black-dial-watch", "front-white"),
      pImg("14-black-dial-watch", "three-quarter-white"),
      pImg("14-black-dial-watch", "side-white"),
      pImg("14-black-dial-watch", "macro-white"),
    ],
    orientation: "portrait",
    badges: ["custom"],
    featured: true,
    sortOrder: 12,
  }),
  product({
    slug: "custom-nameplate-diamond-pendant",
    name: "Custom Script Nameplate Diamond Pendant",
    categoryId: "cat_pendants",
    collectionIds: ["col_bespoke"],
    price: null,
    priceNote: "Request a quote",
    blurb: "Fully custom 3D script nameplate set with VS diamonds on link chain.",
    detail:
      "Multi-layered custom 3D script pendant crafted from customer artwork or lettering, fully iced with round brilliant diamonds and held by an oversized pave shield bail on an angular-link chain.",
    specs: [
      { label: "Starting point", value: "Client sketch or lettering" },
      { label: "Construction", value: "3D layered solid metal" },
      { label: "Metal", value: "14k white, yellow or rose gold" },
      { label: "Timeline", value: "2 to 4 weeks" },
    ],
    metal: "14k white gold",
    stone: "Natural diamond",
    caratWeight: "Custom",
    availability: "custom",
    images: [
      pImg("16-name-pendant-chain", "front-white"),
      pImg("16-name-pendant-chain", "three-quarter-white"),
      pImg("16-name-pendant-chain", "side-white"),
      pImg("16-name-pendant-chain", "macro-white"),
    ],
    orientation: "square",
    badges: ["new", "custom"],
    featured: false,
    sortOrder: 13,
  }),
  product({
    slug: "graduated-baguette-diamond-necklace",
    name: "Graduated Baguette Diamond Collar Necklace",
    categoryId: "cat_chains",
    collectionIds: ["col_bespoke"],
    price: 16500,
    blurb: "Graduated collar necklace of channel-set baguette diamonds.",
    detail:
      "A masterwork high-jewelry collar necklace featuring graduated diagonal segments of custom-cut baguette diamonds, broadening toward the center and contouring seamlessly along the collarbone.",
    specs: [
      { label: "Design", value: "Graduated diagonal segmented collar" },
      { label: "Stone cut", value: "Step-cut natural baguette diamonds" },
      { label: "Metal", value: "18k white gold" },
      { label: "Setting", value: "Invisible channel setting" },
    ],
    metal: "18k white gold",
    stone: "Natural diamond",
    caratWeight: "12.0ct",
    availability: "available",
    images: [
      pImg("17-graduated-necklace", "front-white"),
      pImg("17-graduated-necklace", "three-quarter-white"),
      pImg("17-graduated-necklace", "side-white"),
      pImg("17-graduated-necklace", "macro-white"),
    ],
    orientation: "square",
    badges: ["new"],
    featured: true,
    sortOrder: 14,
  }),
];

/* ------------------------------------------------------------------------ */
/* Collections                                                               */
/* ------------------------------------------------------------------------ */

const collections: Collection[] = [
  {
    _id: "col_engagement-edit",
    name: "The Engagement Edit",
    slug: "engagement-edit",
    description: "Solitaires, halos and custom rings built around a stone sourced to your budget, natural or lab-grown.",
    image: pImg("01-round-halo-ring", "front-white"),
    productIds: [
      "prod_round-halo-engagement-ring",
      "prod_radiant-cut-solitaire-ring",
      "prod_emerald-cut-double-pave-ring",
    ],
    sortOrder: 1,
    featured: true,
    ...stamp,
  },
  {
    _id: "col_cuban-links",
    name: "Cuban Links & Chains",
    slug: "cuban-links",
    description: "Every link individually soldered and stress-tested, so it keeps its shape for a lifetime.",
    image: pImg("08-gold-cuban-clasp", "front-white"),
    productIds: [
      "prod_cuban-link-chain-10k",
      "prod_white-gold-cuban-link-chain",
      "prod_crown-motif-diamond-cuban-chain",
      "prod_graduated-baguette-diamond-necklace",
    ],
    sortOrder: 2,
    featured: true,
    ...stamp,
  },
  {
    _id: "col_bespoke",
    name: "Bespoke Commissions",
    slug: "bespoke",
    description: "Bring a sketch, a photo, or a feeling. We design, source and build it in two to four weeks.",
    image: pImg("02-gold-rectangular-ring", "front-white"),
    productIds: [
      "prod_custom-nameplate-diamond-pendant",
      "prod_shield-motif-diamond-pendant",
      "prod_custom-diamond-rolex-datejust",
      "prod_rolex-sky-dweller-diamond-black-dial",
    ],
    sortOrder: 3,
    featured: true,
    ...stamp,
  },
];

/* ------------------------------------------------------------------------ */
/* Settings                                                                  */
/* ------------------------------------------------------------------------ */

const settings: Settings = {
  _id: "site",
  brand: {
    name: "Fabulla Diamonds Co.",
    shortName: "Fabulla",
    tagline: "Custom diamond jewelry, made in Chicago.",
    description:
      "Natural and lab-grown diamond jewelry, custom made in Chicago for the moments that deserve to last a lifetime.",
    city: "Chicago, Illinois",
    origin: "Surat, India",
    founded: 2021,
    url: "https://fabulladiamonds.com",
  },
  contact: {
    phone: "+1 (224) 647-1571",
    email: "sdjeweler@fabulladiamonds.com",
    instagram: "@fabulladiamondco",
    instagramPersonal: "@sdthejeweler",
    whatsapp: "",
    address: "",
    showroom: "Chicago showroom, by appointment",
    hours: "Monday to Saturday",
  },
  notice: "Natural & lab-grown · GIA and IGI certified · Custom pieces in 2 to 4 weeks",
  metrics: {
    yearsInChicago: "4+",
    customTimeline: "2 to 4 weeks",
    diamondsFromSurat: "80%",
    responseTime: "24 hours",
    labGrownSaving: "30 to 50%",
  },
  hero: [
    {
      id: "hero_engagement",
      kind: "image",
      src: pImg("01-round-halo-ring", "hero"),
      mobileSrc: pImg("01-round-halo-ring", "front-white"),
      poster: "",
      eyebrow: "Signature",
      title: "The Engagement Edit",
      description: "Solitaires and halos built around a stone we source to your budget, natural or lab-grown.",
      ctaLabel: "Explore collection",
      ctaHref: "/products?category=rings",
      enabled: true,
    },
    {
      id: "hero_cuban",
      kind: "image",
      src: pImg("08-gold-cuban-clasp", "hero"),
      mobileSrc: pImg("08-gold-cuban-clasp", "front-white"),
      poster: "",
      eyebrow: "Hand-finished",
      title: "Solid Cuban Links",
      description: "Every link individually soldered and stress-tested, so it keeps its shape for a lifetime.",
      ctaLabel: "Explore collection",
      ctaHref: "/products?category=chains",
      enabled: true,
    },
    {
      id: "hero_bespoke",
      kind: "image",
      src: pImg("02-gold-rectangular-ring", "hero"),
      mobileSrc: pImg("02-gold-rectangular-ring", "front-white"),
      poster: "",
      eyebrow: "Bespoke",
      title: "Your Vision, Our Craft",
      description: "Bring a sketch, a photo, or a feeling. We design, source and build it in two to four weeks.",
      ctaLabel: "Start a custom piece",
      ctaHref: "/custom",
      enabled: true,
    },
    {
      id: "hero_watches",
      kind: "image",
      src: pImg("09-rolex-datejust-corrected", "hero"),
      mobileSrc: pImg("09-rolex-datejust-corrected", "front-white"),
      poster: "",
      eyebrow: "Master Timepieces",
      title: "Custom Diamond Watches",
      description: "Bezel, dial and bracelet diamond work on a watch you own, or one we source for you.",
      ctaLabel: "Explore timepieces",
      ctaHref: "/products?category=watches",
      enabled: true,
    },
    {
      id: "hero_bracelets",
      kind: "image",
      src: pImg("11-rose-gold-bangle", "hero"),
      mobileSrc: pImg("11-rose-gold-bangle", "front-white"),
      poster: "",
      eyebrow: "Matched Line",
      title: "Precision Set Bangles",
      description: "18k rose gold precision set with brilliant diamond rows. Built to be worn every day.",
      ctaLabel: "Explore collection",
      ctaHref: "/products?category=bracelets",
      enabled: true,
    },
  ],
  sections: [
    { key: "hero", enabled: true, title: "", subtitle: "" },
    { key: "categories", enabled: true, title: "Shop by category", subtitle: "Six ways into the studio" },
    { key: "newArrivals", enabled: true, title: "New arrivals", subtitle: "Fresh from the bench" },
    { key: "collections", enabled: true, title: "Fabulla Collections", subtitle: "Curated edits from the Chicago studio" },
    { key: "bestSellers", enabled: true, title: "Best sellers", subtitle: "What leaves the studio most" },
    { key: "highlights", enabled: true, title: "From the studio", subtitle: "Work in progress, finished pieces, client pickups" },
    { key: "assurance", enabled: true, title: "The Fabulla assurance", subtitle: "Crafted by hand, guaranteed for life" },
    { key: "campaign", enabled: true, title: "", subtitle: "" },
    { key: "craftsmanship", enabled: true, title: "", subtitle: "" },
    { key: "testimonials", enabled: true, title: "Worn with pride", subtitle: "From clients across Chicagoland" },
    { key: "faq", enabled: true, title: "Questions we hear most", subtitle: "Straight answers, before you call" },
    { key: "closing", enabled: true, title: "", subtitle: "" },
  ],
  campaign: {
    eyebrow: "Mark the moment",
    title: "A piece for the moment that lasts",
    body: "Engagements, anniversaries, the thing you have been saving for. Bring the occasion and we will build around it.",
  },
  process: [
    {
      id: "step_consult",
      title: "Consultation",
      body: "Share the vision, the budget, and the style. Free, unhurried, and with the person who will actually build the piece.",
      image: pImg("06-gold-bead-pendant", "front-white"),
    },
    {
      id: "step_design",
      title: "Design and source",
      body: "We draw the piece and find the stone against your budget. Natural or lab-grown, with the same expertise behind both.",
      image: pImg("16-name-pendant-chain", "front-white"),
    },
    {
      id: "step_craft",
      title: "Crafted for you",
      body: "Set, finished and delivered by hand. Most commissions leave the bench in 2 to 4 weeks.",
      image: pImg("02-gold-rectangular-ring", "front-white"),
    },
  ],
  craftsmanship: { image: pImg("08-gold-cuban-clasp", "macro-white") },
  about: { image: pImg("10-crown-chain", "front-white") },
  nav: { allImage: pImg("09-rolex-datejust-corrected", "front-white") },
  assurances: [
    { id: "a1", title: "GIA & IGI certified", detail: "Graded, every stone" },
    { id: "a2", title: "Natural or lab-grown", detail: "Equal expertise in both" },
    { id: "a3", title: "Lifetime guarantee", detail: "Quality assured" },
    { id: "a4", title: "Custom capable", detail: "Concept to completion" },
    { id: "a5", title: "24-hour response", detail: "A real person, every time" },
    { id: "a6", title: "Chicago showroom", detail: "By appointment" },
  ],
  testimonials: [
    {
      id: "t1",
      quote: "They listened to exactly what I wanted and delivered a ring that left her speechless.",
      name: "Marcus T.",
      location: "Chicago, IL",
      piece: "Custom engagement ring",
    },
    {
      id: "t2",
      quote: "I came in with a rough idea and they turned it into the most beautiful custom bracelet I have ever seen.",
      name: "Jasmine R.",
      location: "Oak Park, IL",
      piece: "Custom bracelet",
    },
    {
      id: "t3",
      quote: "Nothing compares to the quality and attention to detail here. I am a customer for life.",
      name: "David K.",
      location: "Evanston, IL",
      piece: "Cuban link chain",
    },
  ],
  highlights: [
    { id: "h1", title: "Custom Rings", cover: pImg("01-round-halo-ring", "front-white"), video: "", caption: "Engagement pieces, start to finish" },
    { id: "h2", title: "Cuban Links", cover: pImg("08-gold-cuban-clasp", "front-white"), video: "", caption: "Solid links, hand-finished" },
    { id: "h3", title: "Custom Pendants", cover: pImg("03-shield-pendant-chain", "front-white"), video: "", caption: "Built from client drawings" },
    { id: "h4", title: "Bangles & Cuffs", cover: pImg("11-rose-gold-bangle", "front-white"), video: "", caption: "Precision pave lines" },
    { id: "h5", title: "Watches", cover: pImg("09-rolex-datejust-corrected", "front-white"), video: "", caption: "Bezel, dial and bracelet work" },
    { id: "h6", title: "High Jewelry", cover: pImg("17-graduated-necklace", "front-white"), video: "", caption: "Graduated baguette diamond collar" },
  ],
  financing: { enabled: false, text: "Financing available from 0% APR", href: "/contact" },
  chatbot: {
    enabled: true,
    title: "Fabulla concierge",
    intro:
      "Ask about a piece, a budget, or how a custom commission runs. For anything binding — stock, a firm quote, a date — the studio confirms it.",
    suggestions: [
      "What can you build for $5,000?",
      "How long does a custom piece take?",
      "Natural or lab-grown?",
      "Can you set diamonds on my watch?",
    ],
  },
  notifications: {
    enquiryTo: [],
    autoReply: true,
    autoReplyText:
      "Thank you for writing to Fabulla Diamonds. A real person reads every enquiry and you will hear from us within 24 hours. If it is urgent, call +1 (224) 647-1571.",
  },
  seo: {
    title: "Fabulla Diamonds Co. | Custom Diamond Jewelry Chicago",
    description:
      "Natural and lab-grown diamond jewelry, custom made in Chicago for the moments that deserve to last a lifetime.",
  },
  ...stamp,
};

/* ------------------------------------------------------------------------ */
/* FAQs                                                                      */
/* ------------------------------------------------------------------------ */

const faq = (id: string, topic: string, question: string, answer: string, sortOrder: number): Faq => ({
  _id: `faq_${id}`,
  topic,
  question,
  answer,
  sortOrder,
  showOnSite: true,
  useInChat: true,
  ...stamp,
});

const faqs: Faq[] = [
  faq("custom", "Custom work", "How does a custom piece work?", "Bring a sketch, a photograph, or just an idea. We design the piece, source the stone against your budget and build it by hand in 2 to 4 weeks. The consultation is free and you work with the person who actually makes it.", 1),
  faq("timeline", "Custom work", "How long does it take?", "Most commissions leave the bench in 2 to 4 weeks. Watch work — bezel, lugs and dial — runs 3 to 5 weeks.", 2),
  faq("labgrown", "Stones", "Natural or lab-grown?", "We offer both and both come graded, GIA or IGI. Lab-grown costs 30 to 50% less than natural for the same look, which is the choice when carat weight matters more than origin.", 3),
  faq("cert", "Stones", "Are the diamonds certified?", "Every stone arrives with its GIA or IGI grading report and laser inscription, natural or lab-grown.", 4),
  faq("budget", "Pricing", "What can I get for my budget?", "Listed pieces run from $2,800 for delicate bracelets to $34,000 for custom iced timepieces. Custom commissions are quoted against your number rather than a fixed list — tell us the budget and the piece gets designed around it.", 5),
  faq("watch", "Watches", "Can you set diamonds on my own watch?", "Yes. Bezel, lug, dial and bracelet work is offered on a watch you own or one we source. Stones are hand-set into custom mountings, never drop-in aftermarket parts.", 6),
  faq("visit", "Visiting", "Where is the showroom?", "Chicago, by appointment, Monday to Saturday. Call +1 (224) 647-1571 or book through the contact page and we will find a time.", 7),
  faq("care", "Aftercare", "What if it needs resizing or repair?", "Cleaning, prong tightening and resizing are covered for the life of the piece. Bring it in or call and we will sort it.", 8),
];

/* ------------------------------------------------------------------------ */
/* Media registry for all 14 product sets (70 assets)                        */
/* ------------------------------------------------------------------------ */

const PRODUCT_FOLDERS = [
  "01-round-halo-ring",
  "02-gold-rectangular-ring",
  "03-shield-pendant-chain",
  "04-white-cuban-chain",
  "05-emerald-cut-ring",
  "06-gold-bead-pendant",
  "08-gold-cuban-clasp",
  "09-rolex-datejust-corrected",
  "10-crown-chain",
  "11-rose-gold-bangle",
  "12-three-clover-bracelet",
  "14-black-dial-watch",
  "16-name-pendant-chain",
  "17-graduated-necklace",
];

const SHOTS = [
  { shot: "front-white", label: "Front studio cover" },
  { shot: "three-quarter-white", label: "Three-quarter angle view" },
  { shot: "side-white", label: "Side profile view" },
  { shot: "macro-white", label: "Macro close-up detail" },
  { shot: "hero", label: "Cinematic wide hero banner" },
];

const media: MediaAsset[] = [];

for (const folder of PRODUCT_FOLDERS) {
  const cleanName = folder.replace(/^[0-9]+-/, "").replace(/-/g, " ");
  for (const { shot, label } of SHOTS) {
    const filename = `${shot}.png`;
    const relPath = `products/${folder}/${filename}`;
    media.push({
      _id: `media_${folder}_${shot}`,
      url: `/images/${relPath}`,
      key: `images/${relPath}`,
      kind: "image",
      name: `${folder}-${filename}`,
      size: 0,
      contentType: "image/png",
      alt: `${cleanName} — ${label}`,
      origin: "seed",
      ...stamp,
    });
  }
}

/* ------------------------------------------------------------------------ */

export function seedFor(col: CollectionName): unknown[] {
  switch (col) {
    case "settings":
      return [settings];
    case "categories":
      return categories;
    case "collections":
      return collections;
    case "products":
      return products;
    case "faqs":
      return faqs;
    case "media":
      return media;
    default:
      return [];
  }
}

export const DEFAULT_SETTINGS = settings;
