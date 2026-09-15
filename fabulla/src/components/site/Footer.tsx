import Link from "next/link";
import { InstagramLogo, Phone, EnvelopeSimple, WhatsappLogo, MapPin } from "@phosphor-icons/react/ssr";
import type { Category, Settings } from "@/lib/cms/types";
import { igHref, mailHref, telHref, waHref } from "@/lib/site";

/**
 * Footer. A deep terminal block, the way the reference build closes.
 *
 * In light this is the page's own navy used as a ground, a long-standing
 * convention for a light site's footer. In dark the ground sits just below
 * the page and the hairline above it does the separating, since two
 * near-blacks cannot.
 */
export default function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const year = new Date().getFullYear();
  const { brand, contact } = settings;

  return (
    <footer className="border-line bg-deep pb-8 pt-16 text-on-deep dark:border-t">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <div>
              <p className="display text-[30px] leading-none tracking-[0.09em]">{brand.shortName.toUpperCase()}</p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">Est. {brand.founded}</p>
            </div>
            <p className="max-w-xs font-sans text-[12.5px] leading-relaxed text-white/70">{brand.description}</p>
            <div className="flex flex-col gap-2.5 pt-1">
              <a href={telHref(contact.phone)} className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose">
                <Phone size={14} weight="light" />
                {contact.phone}
              </a>
              <a href={mailHref(contact.email)} className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose">
                <EnvelopeSimple size={14} weight="light" />
                {contact.email}
              </a>
              {contact.whatsapp && (
                <a href={waHref(contact.whatsapp)} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose">
                  <WhatsappLogo size={14} weight="light" />
                  WhatsApp
                </a>
              )}
              <a href={igHref(contact.instagram)} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose">
                <InstagramLogo size={14} weight="light" />
                {contact.instagram}
              </a>
              {contact.address && (
                <p className="flex items-start gap-3 font-sans text-[12.5px] text-white/70">
                  <MapPin size={14} weight="light" className="mt-0.5 shrink-0" />
                  {contact.address}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">Shop</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 lg:grid-cols-1">
              {categories.map((c) => (
                <li key={c._id}>
                  <Link href={`/products?category=${c.slug}`} className="font-sans text-[12.5px] text-white/70 transition-colors hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">Studio</h2>
            <ul className="mt-5 space-y-2.5">
              {[
                { label: "Custom work", href: "/custom" },
                { label: "Our story", href: "/about" },
                { label: "Questions", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Book a visit", href: "/contact?kind=appointment" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-[12.5px] text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">Visit</h2>
            <p className="mt-5 font-sans text-[12.5px] leading-relaxed text-white/70">{contact.showroom}</p>
            <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-white/70">{contact.hours}</p>
            <Link href="/contact?kind=appointment" className="mt-5 inline-block rounded-full border border-white/25 px-5 py-2.5 font-sans text-[10.5px] uppercase tracking-[0.16em] text-white transition-colors hover:border-rose hover:text-rose">
              Book a visit
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 sm:flex-row">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55">
            © {year} {brand.name}
          </p>
          <div className="flex gap-7">
            <Link href="/privacy" className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
