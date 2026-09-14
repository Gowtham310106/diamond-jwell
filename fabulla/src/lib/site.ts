/**
 * The single CTA vocabulary for the whole site. One label per intent, used
 * everywhere. Do not introduce synonyms ("Let's talk", "Reach out", "Get
 * started") anywhere in the tree.
 *
 * Everything else that used to live here — brand facts, contact details,
 * metrics, testimonials — is content now and comes from the CMS
 * (`getSettings()` in lib/cms/repo.ts), edited in the admin panel.
 */
export const CTA = {
  custom: { label: "Start a custom piece", href: "/contact" },
  browse: { label: "Browse products", href: "/products" },
  book: { label: "Book a visit", href: "/contact?kind=appointment" },
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const mailHref = (email: string) => `mailto:${email}`;
export const igHref = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
export const waHref = (number: string) => `https://wa.me/${number.replace(/[^\d]/g, "")}`;
