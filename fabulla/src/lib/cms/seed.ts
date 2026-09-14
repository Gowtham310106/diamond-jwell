/**
 * Seed content.
 *
 * What an empty collection is filled with on first read: the studio's real
 * catalog, photography and copy, exactly as the static site shipped them. Ids
 * are deterministic (`cat_rings`, `prod_halo-engagement-ring`) so a second
 * environment seeded from the same code lines up with the first.
 *
 * Nothing here is edited by hand after launch — it is the starting state the
 * admin panel takes over from.
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

const T = "2026-09-14T00:00:00.000Z";
const stamp = { createdAt: T, updatedAt: T };
const img = (file: string) => `/images/${file}`;

/* ------------------------------------------------------------------------ */
/* Categories                                                                */
/* ------------------------------------------------------------------------ */

const categories: Category[] = [
  {
    _id: "cat_rings",
    name: "Rings",
    slug: "rings",
    description: "Solitaires, halos and fully custom engagement rings.",
    image: img("ring-emerald-cut-pave.jpg"),
    bannerImage: img("ring-round-halo-pave.jpg"),
    bannerTitle: "Engagement rings, built around your stone.",
    children: [
      { name: "All rings", href: "/products?category=rings" },
      { name: "Solitaire", href: "/products/radiant-cut-solitaire-ring" },
      { name: "Halo", href: "/products/halo-engagement-ring" },
      { name: "Custom engagement", href: "/products/custom-engagement-ring" },
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
    image: img("chain-cuban-white-gold.jpg"),
    bannerImage: img("chain-cuban-white-gold.jpg"),
    bannerTitle: "Solid links, soldered and stress-tested by hand.",
    children: [
      { name: "All chains", href: "/products?category=chains" },
      { name: "Cuban link", href: "/products/cuban-link-chain-10k" },
      { name: "Custom chains", href: "/custom" },
      { name: "Pendants", href: "/products?category=pendants" },
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
    image: img("pendant-gold-bead-set.jpg"),
    bannerImage: img("pendant-gold-bead-set.jpg"),
    bannerTitle: "Pendants cut and set to your own drawing.",
    children: [
      { name: "All pendants", href: "/products?category=pendants" },
      { name: "Custom pendants", href: "/custom" },
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
    description: "Tennis lines, cuffs and Cuban bracelets, matched stone for stone.",
    image: img("bracelet-cuban-crown-stones.jpg"),
    bannerImage: img("bracelet-love-pave-boxed.jpg"),
    bannerTitle: "Bracelets, matched stone for stone.",
    children: [
      { name: "All bracelets", href: "/products?category=bracelets" },
      { name: "Tennis", href: "/products/pave-diamond-tennis-bracelet" },
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
    description: "Bezel and dial work on your watch, or one we source.",
    image: img("watch-sky-dweller-iced.jpg"),
    bannerImage: img("watch-sky-dweller-iced.jpg"),
    bannerTitle: "Bezel and dial work on your watch, or one we source.",
    children: [
      { name: "All watches", href: "/products?category=watches" },
      { name: "Diamond bezel", href: "/products/presidential-rolex-custom" },
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

const product = (p: Partial<Product> & Pick<Product, "slug" | "name" | "categoryId" | "price" | "blurb" | "detail" | "specs" | "availability" | "images" | "orientation">): Product => ({
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
    slug: "radiant-cut-solitaire-ring",
    name: "Radiant Cut Solitaire Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit"],
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
    metal: "18k white gold",
    stone: "Natural diamond",
    caratWeight: "2.5ct",
    availability: "available",
    images: [img("ring-radiant-two-tone.jpg")],
    orientation: "portrait",
    badges: ["new"],
    featured: true,
    sortOrder: 1,
  }),
  product({
    slug: "cuban-link-chain-10k",
    name: "Cuban Link Chain 10mm",
    categoryId: "cat_chains",
    collectionIds: ["col_cuban-links"],
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
    metal: "14k yellow gold",
    stone: "Pave diamonds",
    availability: "available",
    images: [img("chain-cuban-yellow-gold.jpg"), img("chain-cuban-white-gold.jpg")],
    orientation: "portrait",
    badges: ["bestseller"],
    featured: true,
    sortOrder: 2,
  }),
  product({
    slug: "pave-diamond-tennis-bracelet",
    name: "Pave Diamond Tennis Bracelet",
    categoryId: "cat_bracelets",
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
    metal: "14k white gold",
    stone: "Lab-grown diamond",
    availability: "available",
    images: [img("tennis-bracelet-watch-case.jpg")],
    orientation: "square",
    featured: true,
    sortOrder: 3,
  }),
  product({
    slug: "halo-engagement-ring",
    name: "Halo Engagement Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit"],
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
    metal: "Platinum",
    stone: "Natural diamond",
    caratWeight: "1.5ct",
    availability: "available",
    images: [img("ring-round-halo-pave.jpg")],
    orientation: "landscape",
    badges: ["bestseller"],
    featured: true,
    sortOrder: 4,
  }),
  product({
    slug: "presidential-rolex-custom",
    name: "Custom Diamond Bezel Watch",
    categoryId: "cat_watches",
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
    metal: "Stainless steel",
    stone: "Natural diamond",
    availability: "inquire",
    images: [img("watch-datejust-iced.jpg"), img("watch-sky-dweller-iced.jpg"), img("watch-lineup-iced.jpg")],
    orientation: "portrait",
    badges: ["custom"],
    sortOrder: 5,
  }),
  product({
    slug: "custom-engagement-ring",
    name: "Custom Engagement Ring",
    categoryId: "cat_rings",
    collectionIds: ["col_engagement-edit"],
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
    stone: "Natural or lab-grown",
    availability: "custom",
    images: [img("ring-emerald-cut-pave.jpg")],
    orientation: "portrait",
    badges: ["new", "custom"],
    featured: true,
    sortOrder: 6,
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
    description: "Solitaires and halos built around a stone sourced to your budget, natural or lab-grown.",
    image: img("ring-round-halo-pave.jpg"),
    productIds: ["prod_radiant-cut-solitaire-ring", "prod_halo-engagement-ring", "prod_custom-engagement-ring"],
    sortOrder: 1,
    featured: true,
    ...stamp,
  },
  {
    _id: "col_cuban-links",
    name: "Cuban Links & Chains",
    slug: "cuban-links",
    description: "Every link individually soldered and stress-tested, so it keeps its shape for a lifetime.",
    image: img("chain-cuban-white-gold.jpg"),
    productIds: ["prod_cuban-link-chain-10k"],
    sortOrder: 2,
    featured: true,
    ...stamp,
  },
  {
    _id: "col_bespoke",
    name: "Bespoke Commissions",
    slug: "bespoke",
    description: "Bring a sketch, a photo, or a feeling. We design, source and build it in two to four weeks.",
    image: img("ring-radiant-two-tone.jpg"),
    productIds: ["prod_custom-engagement-ring", "prod_presidential-rolex-custom"],
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
      src: img("ring-round-halo-pave.jpg"),
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
      src: img("chain-cuban-white-gold.jpg"),
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
      src: img("ring-radiant-two-tone.jpg"),
      poster: "",
      eyebrow: "Bespoke",
      title: "Your Vision, Our Craft",
      description: "Bring a sketch, a photo, or a feeling. We design, source and build it in two to four weeks.",
      ctaLabel: "Start a custom piece",
      ctaHref: "/custom",
      enabled: true,
    },
    {
      id: "hero_bracelets",
      kind: "image",
      src: img("bracelet-cuban-crown-stones.jpg"),
      poster: "",
      eyebrow: "Matched line",
      title: "Pave Set Bracelets",
      description: "Colour and clarity matched across the full length. That matching is the slow part.",
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
      image: img("showroom-rope-chain-coins.jpg"),
    },
    {
      id: "step_design",
      title: "Design and source",
      body: "We draw the piece and find the stone against your budget. Natural or lab-grown, with the same expertise behind both.",
      image: img("bracelet-cuban-crown-stones.jpg"),
    },
    {
      id: "step_craft",
      title: "Crafted for you",
      body: "Set, finished and delivered by hand. Most commissions leave the bench in 2 to 4 weeks.",
      image: img("ring-radiant-two-tone.jpg"),
    },
  ],
  craftsmanship: { image: img("bracelet-cuban-crown-stones.jpg") },
  about: { image: img("bracelet-cuban-crown-stones.jpg") },
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
    { id: "h1", title: "Custom Rings", cover: img("ring-radiant-two-tone.jpg"), video: "", caption: "Engagement pieces, start to finish" },
    { id: "h2", title: "Cuban Links", cover: img("chain-cuban-yellow-gold.jpg"), video: "", caption: "Solid links, hand-finished" },
    { id: "h3", title: "Custom Pieces", cover: img("pendant-custom-interstate.jpg"), video: "", caption: "Built from the client's own drawing" },
    { id: "h4", title: "Pickups", cover: img("bracelet-alhambra-boxed.jpg"), video: "", caption: "Pieces going home" },
    { id: "h5", title: "Watches", cover: img("watch-cartier-santos.jpg"), video: "", caption: "Bezel and dial work" },
    { id: "h6", title: "Loose Stones", cover: img("bracelet-cuban-crown-stones.jpg"), video: "", caption: "Natural and lab-grown, side by side" },
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
/* FAQs — the questions the studio actually gets                             */
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
  faq("budget", "Pricing", "What can I get for my budget?", "Listed pieces run from $3,200 for a solid Cuban link to $18,500 for custom watch work. Custom commissions are quoted against your number rather than a fixed list — tell us the budget and the piece gets designed around it.", 5),
  faq("watch", "Watches", "Can you set diamonds on my own watch?", "Yes. Bezel, lug and dial work starts at $18,500 on a watch you own or one we source. Stones are hand-set into a bezel cut to the reference, never a drop-in aftermarket part.", 6),
  faq("visit", "Visiting", "Where is the showroom?", "Chicago, by appointment, Monday to Saturday. Call +1 (224) 647-1571 or book through the contact page and we will find a time.", 7),
  faq("care", "Aftercare", "What if it needs resizing or repair?", "Cleaning, prong tightening and resizing are covered for the life of the piece. Bring it in or call and we will sort it.", 8),
];

/* ------------------------------------------------------------------------ */
/* Media registry for the shipped photography                               */
/* ------------------------------------------------------------------------ */

const MEDIA_FILES: [string, string][] = [
  ["ring-round-halo-pave.jpg", "Round halo engagement ring"],
  ["ring-radiant-two-tone.jpg", "Radiant cut ring, hand-engraved two-tone setting"],
  ["ring-emerald-cut-pave.jpg", "Emerald cut ring with pave band"],
  ["chain-cuban-white-gold.jpg", "White gold Cuban link chain"],
  ["chain-cuban-yellow-gold.jpg", "Yellow gold Cuban link chain, box clasp"],
  ["pendant-custom-interstate.jpg", "Custom Interstate pendant"],
  ["pendant-gold-bead-set.jpg", "Gold bead pendant set"],
  ["bracelet-cuban-crown-stones.jpg", "Cuban bracelet with crown clasp and loose stones"],
  ["bracelet-love-pave-boxed.jpg", "Pave bangle, boxed"],
  ["bracelet-alhambra-boxed.jpg", "Clover bracelet, boxed"],
  ["tennis-bracelet-watch-case.jpg", "Tennis bracelet in a watch case"],
  ["watch-datejust-iced.jpg", "Iced Datejust"],
  ["watch-sky-dweller-iced.jpg", "Iced Sky-Dweller"],
  ["watch-cartier-santos.jpg", "Santos watch"],
  ["watch-lineup-iced.jpg", "Four iced watches"],
  ["showroom-rope-chain-coins.jpg", "Rope chains in the showroom"],
];

const media: MediaAsset[] = MEDIA_FILES.map(([file, alt]) => ({
  _id: `media_${file.replace(/\.[a-z]+$/, "")}`,
  url: img(file),
  key: `images/${file}`,
  kind: "image",
  name: file,
  size: 0,
  contentType: "image/jpeg",
  alt,
  origin: "seed",
  ...stamp,
}));

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
