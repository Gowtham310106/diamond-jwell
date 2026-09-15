/**
 * CMS domain types.
 *
 * Every document carries a string `_id` and ISO timestamps. Ids are generated
 * by us (not Mongo ObjectIds) so the same records round-trip through both the
 * MongoDB store and the file store without translation.
 */

export type Id = string;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type Doc = { _id: Id } & Timestamps;

/* ------------------------------------------------------------------------ */
/* Catalog                                                                   */
/* ------------------------------------------------------------------------ */

export type Category = Doc & {
  name: string;
  slug: string;
  description: string;
  /** Circle thumbnail in the nav, tile in the bento. */
  image: string;
  /** Mega-panel banner on the right of the category's menu. */
  bannerImage: string;
  bannerTitle: string;
  /** Sub-links in the mega panel and the mobile drawer. */
  children: { name: string; href: string }[];
  sortOrder: number;
  showInNav: boolean;
  showInBento: boolean;
};

/** A curated set of pieces: "Iced Out", "Under $5,000", "New for fall". */
export type Collection = Doc & {
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: Id[];
  sortOrder: number;
  /** Featured collections get a plate on the homepage. */
  featured: boolean;
};

export type Availability = "available" | "inquire" | "custom";
export type ProductStatus = "draft" | "published";
export type Badge = "new" | "bestseller" | "sale" | "custom";
export type Orientation = "portrait" | "landscape" | "square";

export type Product = Doc & {
  slug: string;
  name: string;
  sku: string;
  categoryId: Id;
  collectionIds: Id[];
  /** null when the piece is quote-only. */
  price: number | null;
  /** Shown struck through when higher than `price`. */
  compareAtPrice: number | null;
  priceNote: string;
  blurb: string;
  detail: string;
  specs: { label: string; value: string }[];
  /** Filter facets, free text so the studio can use its own vocabulary. */
  metal: string;
  stone: string;
  caratWeight: string;
  availability: Availability;
  status: ProductStatus;
  /** First image is the card image. */
  images: string[];
  video: string;
  orientation: Orientation;
  badges: Badge[];
  featured: boolean;
  tags: string[];
  stockCount: number | null;
  sortOrder: number;
};

/* ------------------------------------------------------------------------ */
/* Site settings (singleton)                                                 */
/* ------------------------------------------------------------------------ */

export type HeroSlide = {
  id: string;
  kind: "image" | "video";
  src: string;
  /** Video only: still shown before the clip paints. */
  poster: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  enabled: boolean;
};

export type SectionKey =
  | "hero"
  | "categories"
  | "collections"
  | "newArrivals"
  | "bestSellers"
  | "highlights"
  | "assurance"
  | "campaign"
  | "craftsmanship"
  | "testimonials"
  | "faq"
  | "closing";

export type HomeSection = {
  key: SectionKey;
  enabled: boolean;
  title: string;
  subtitle: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
  piece: string;
};

export type Assurance = { id: string; title: string; detail: string };

export type Highlight = {
  id: string;
  title: string;
  cover: string;
  video: string;
  caption: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  body: string;
  image: string;
};

export type Settings = Doc & {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    city: string;
    origin: string;
    founded: number;
    url: string;
  };
  contact: {
    phone: string;
    email: string;
    instagram: string;
    instagramPersonal: string;
    whatsapp: string;
    address: string;
    showroom: string;
    hours: string;
  };
  /** Top notice strip. Short; it collapses on scroll. */
  notice: string;
  metrics: {
    yearsInChicago: string;
    customTimeline: string;
    diamondsFromSurat: string;
    responseTime: string;
    labGrownSaving: string;
  };
  hero: HeroSlide[];
  sections: HomeSection[];
  campaign: { eyebrow: string; title: string; body: string };
  process: ProcessStep[];
  craftsmanship: { image: string };
  about: { image: string };
  /**
   * The "All Jewelry" nav circle. It is a synthetic entry with no category of
   * its own, so without this it borrows the first category's plate and sits
   * next to an identical circle.
   */
  nav: { allImage: string };
  assurances: Assurance[];
  testimonials: Testimonial[];
  highlights: Highlight[];
  financing: { enabled: boolean; text: string; href: string };
  chatbot: {
    enabled: boolean;
    title: string;
    intro: string;
    suggestions: string[];
  };
  notifications: {
    /** Where enquiry emails go. Empty falls back to contact.email. */
    enquiryTo: string[];
    autoReply: boolean;
    autoReplyText: string;
  };
  seo: { title: string; description: string };
};

/* ------------------------------------------------------------------------ */
/* Inbox, FAQ, chat, media, team                                             */
/* ------------------------------------------------------------------------ */

export type EnquiryKind = "enquiry" | "appointment" | "quote" | "product";
export type EnquiryStatus = "new" | "contacted" | "won" | "closed";

export type Enquiry = Doc & {
  kind: EnquiryKind;
  name: string;
  email: string;
  phone: string;
  intent: string;
  budget: string;
  message: string;
  productSlug: string;
  preferredDate: string;
  status: EnquiryStatus;
  notes: string;
  source: "form" | "chat" | "product";
  emailSent: boolean;
};

export type Faq = Doc & {
  question: string;
  answer: string;
  /** "Pricing", "Custom work", "Shipping" — free text, groups the FAQ page. */
  topic: string;
  sortOrder: number;
  showOnSite: boolean;
  useInChat: boolean;
};

export type ChatTurn = { role: "user" | "assistant"; content: string; at: string };

export type Conversation = Doc & {
  turns: ChatTurn[];
  source: "gemini" | "studio";
  /** True when the last answer was a hand-off, i.e. a question worth an FAQ. */
  unanswered: boolean;
  page: string;
};

export type Admin = Doc & {
  email: string;
  name: string;
  passwordHash: string;
  role: "owner" | "staff";
};

export type MediaAsset = Doc & {
  url: string;
  key: string;
  kind: "image" | "video";
  name: string;
  size: number;
  contentType: string;
  alt: string;
  origin: "upload" | "ai" | "seed";
};

export type CollectionName =
  | "settings"
  | "categories"
  | "collections"
  | "products"
  | "enquiries"
  | "faqs"
  | "conversations"
  | "admins"
  | "media";

export type CollectionTypes = {
  settings: Settings;
  categories: Category;
  collections: Collection;
  products: Product;
  enquiries: Enquiry;
  faqs: Faq;
  conversations: Conversation;
  admins: Admin;
  media: MediaAsset;
};
