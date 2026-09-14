import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import type { Faq } from "@/lib/cms/types";

/**
 * FAQ accordion. Native <details>, so it works without JavaScript and every
 * answer is in the HTML for search engines. The full list lives at /faq.
 */
export default function FaqSection({ title, subtitle, faqs, limit = 6, showAll = true }: { title: string; subtitle?: string; faqs: Faq[]; limit?: number; showAll?: boolean }) {
  const shown = faqs.slice(0, limit);
  if (shown.length === 0) return null;

  return (
    <section className="border-t border-line bg-canvas py-16 md:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="faq-heading" className="display text-[clamp(2rem,4vw,3rem)] text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
            {showAll && faqs.length > limit && (
              <Link href="/faq" className="mt-6 inline-block font-sans text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-rose-ink">
                All {faqs.length} questions →
              </Link>
            )}
          </Reveal>
          <div className="lg:col-span-8">
            {shown.map((f, i) => (
              <Reveal key={f._id} index={i}>
                <details className="group border-b border-line py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-sans text-[16px] text-ink">
                    {f.question}
                    <Plus size={16} weight="light" className="shrink-0 text-rose-ink transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 max-w-2xl font-sans text-[14.5px] leading-relaxed text-ink-2">{f.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
