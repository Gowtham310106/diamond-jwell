import type { Metadata } from "next";
import {
  Phone,
  EnvelopeSimple,
  InstagramLogo,
  MapPin,
  Clock,
} from "@phosphor-icons/react/ssr";
import EnquiryForm from "@/components/site/EnquiryForm";
import Reveal from "@/components/ui/Reveal";
import { CONTACT, METRICS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a consultation with Fabulla Diamonds Co. in Chicago. Free consultation, response within 24 hours.",
};

const DETAILS = [
  { Icon: Phone, label: "Call", value: CONTACT.phone, href: CONTACT.phoneHref },
  {
    Icon: EnvelopeSimple,
    label: "Email",
    value: CONTACT.email,
    href: CONTACT.emailHref,
  },
  {
    Icon: InstagramLogo,
    label: "Instagram",
    value: CONTACT.instagram,
    href: CONTACT.instagramHref,
  },
  { Icon: MapPin, label: "Showroom", value: SITE.city, href: null },
  { Icon: Clock, label: "Hours", value: CONTACT.hours, href: null },
];

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
          <Reveal>
            <h1 className="display max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
              Start the conversation
            </h1>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">
              Consultation is always free, and every enquiry gets a real answer
              from our team inside {METRICS.responseTime}.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <EnquiryForm />
          </Reveal>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal index={1}>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                Reach us directly
              </h2>

              <dl className="mt-8">
                {DETAILS.map(({ Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 border-b border-line py-5 last:border-b-0"
                  >
                    <Icon
                      size={17}
                      weight="light"
                      className="mt-0.5 shrink-0 text-rose-ink"
                    />
                    <div>
                      <dt className="font-sans text-[11px] uppercase tracking-[0.14em] text-ink-3">
                        {label}
                      </dt>
                      <dd className="mt-1.5 font-sans text-[14.5px] text-ink">
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={
                              href.startsWith("http")
                                ? "noreferrer noopener"
                                : undefined
                            }
                            className="transition-colors duration-300 hover:text-rose-ink"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-10 rounded-2xl border border-line bg-surface p-7">
                <p className="display text-[22px] text-ink">
                  Visiting the studio
                </p>
                <p className="mt-4 font-sans text-[13.5px] leading-relaxed text-ink-2">
                  The Chicago showroom runs by appointment so you get the room,
                  the loupe and our full attention. Call or write and we will
                  find a time.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
