import Link from "next/link";
import {
  InstagramLogo,
  Phone,
  EnvelopeSimple,
  PaperPlaneTilt,
} from "@phosphor-icons/react/ssr";
import { CONTACT, SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/products";

/**
 * Footer. Deep navy against the cream page, the way the reference build closes.
 *
 * This is not a theme inversion: navy is the page's own type colour used as a
 * ground for one terminal block, which is a long-standing convention for a
 * light site's footer. The body of the site stays light throughout.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pb-8 pt-16 text-canvas">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-2">
            <div>
              <p className="display text-[30px] leading-none tracking-[0.09em]">
                FABULLA
              </p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
                Diamonds Co. · Est. {SITE.founded}
              </p>
            </div>
            <p className="max-w-xs font-sans text-[12.5px] leading-relaxed text-white/70">
              Natural and lab-grown diamond jewelry, custom made in {SITE.city},
              on generations of craft from {SITE.origin}.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose"
              >
                <Phone size={14} weight="light" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.emailHref}
                className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose"
              >
                <EnvelopeSimple size={14} weight="light" />
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.instagramHref}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 font-sans text-[12.5px] text-white/70 transition-colors hover:text-rose"
              >
                <InstagramLogo size={14} weight="light" />
                {CONTACT.instagram}
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/45">
              Shop
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 lg:grid-cols-1">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/products?category=${c}`}
                    className="font-sans text-[12.5px] text-white/70 transition-colors hover:text-white"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/45">
              Studio
            </h2>
            <ul className="mt-5 space-y-2.5">
              {[
                { label: "Custom work", href: "/custom" },
                { label: "Our story", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Track an order", href: "/track" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-[12.5px] text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h2 className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/45">
              Concierge
            </h2>
            <p className="mt-5 font-sans text-[12.5px] leading-relaxed text-white/70">
              New pieces, private viewings, and the occasional look at the
              bench.
            </p>
            <form
              className="relative mt-4"
              action={CONTACT.emailHref}
              method="get"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="subject"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-white/25 bg-white/5 py-2.5 pl-4 pr-11 font-sans text-[12px] text-white placeholder-white/45 transition-colors focus:border-rose focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-rose hover:text-ink"
              >
                <PaperPlaneTilt size={14} weight="light" />
              </button>
            </form>
            <p className="mt-2.5 font-sans text-[10.5px] text-white/40">
              Opens your mail app. No list, no spam.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 sm:flex-row">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40">
            © {year} {SITE.name}
          </p>
          <div className="flex gap-7">
            <Link
              href="/privacy"
              className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/75"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/75"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
