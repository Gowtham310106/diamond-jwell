/**
 * Single source of truth for brand facts, navigation and contact details.
 *
 * Every figure here is taken from the client's live site (fabulladiamonds.com).
 * Nothing is invented. If a number changes, it changes here and nowhere else.
 *
 * EYEBROW BUDGET
 * --------------
 * The design system allows one small uppercase micro-label (.eyebrow) per
 * three sections. The homepage ships ten sections, so the budget is four and
 * only one is spent, on Craftsmanship. Every other section leads with its
 * headline and a plain mono sub-line. Keep it that way.
 */

export const SITE = {
  name: "Fabulla Diamonds Co.",
  shortName: "Fabulla",
  tagline: "Custom diamond jewelry, made in Chicago.",
  description:
    "Natural and lab-grown diamond jewelry, custom made in Chicago for the moments that deserve to last a lifetime.",
  url: "https://fabulladiamonds.com",
  founded: 2021,
  city: "Chicago, Illinois",
  origin: "Surat, India",
} as const;

export const CONTACT = {
  phone: "+1 (224) 647-1571",
  phoneHref: "tel:+12246471571",
  email: "sdjeweler@fabulladiamonds.com",
  emailHref: "mailto:sdjeweler@fabulladiamonds.com",
  instagram: "@fabulladiamondco",
  instagramHref: "https://www.instagram.com/fabulladiamondco/",
  instagramPersonal: "@sdthejeweler",
  instagramPersonalHref: "https://www.instagram.com/sdthejeweler/",
  showroom: "Chicago showroom, by appointment",
  hours: "Monday to Saturday",
} as const;

/**
 * Route slugs are preserved verbatim from the existing site. Changing any of
 * these breaks inbound links and search ranking, so they are frozen.
 */
export const NAV = [
  { label: "Products", href: "/products" },
  { label: "Custom", href: "/custom" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * The single CTA vocabulary for the whole site. One label per intent, used
 * everywhere. Do not introduce synonyms ("Let's talk", "Reach out", "Get
 * started") anywhere in the tree.
 */
export const CTA = {
  custom: { label: "Start a custom piece", href: "/contact" },
  browse: { label: "Browse products", href: "/products" },
  call: { label: "Call the studio", href: CONTACT.phoneHref },
} as const;

export type Assurance = {
  title: string;
  detail: string;
};

export const ASSURANCES: Assurance[] = [
  { title: "Natural & lab-grown", detail: "GIA and IGI certified" },
  { title: "Custom made", detail: "Concept to completion" },
  { title: "Lifetime guarantee", detail: "Quality assured" },
  { title: "24-hour response", detail: "A real person, every time" },
  { title: "Chicago showroom", detail: "By appointment" },
  { title: "Surat heritage", detail: "Generational craft" },
];

/** Figures quoted directly from the client's current site copy. */
export const METRICS = {
  yearsInChicago: "4+",
  customTimeline: "2 to 4 weeks",
  diamondsFromSurat: "80%",
  responseTime: "24 hours",
  labGrownSaving: "30 to 50%",
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  piece: string;
};

/** Verbatim client testimonials, trimmed to three lines for the page. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "They listened to exactly what I wanted and delivered a ring that left her speechless.",
    name: "Marcus T.",
    location: "Chicago, IL",
    piece: "Custom engagement ring",
  },
  {
    quote:
      "I came in with a rough idea and they turned it into the most beautiful custom bracelet I have ever seen.",
    name: "Jasmine R.",
    location: "Oak Park, IL",
    piece: "Custom bracelet",
  },
  {
    quote:
      "Nothing compares to the quality and attention to detail here. I am a customer for life.",
    name: "David K.",
    location: "Evanston, IL",
    piece: "Cuban link chain",
  },
];
