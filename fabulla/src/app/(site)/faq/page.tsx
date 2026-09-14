import type { Metadata } from "next";
import { Plus } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { getSettings, listFaqs } from "@/lib/cms/repo";
import { CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions",
  description: "Straight answers on custom work, timelines, natural versus lab-grown, certification, pricing and aftercare.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([listFaqs(), getSettings()]);
  const shown = faqs.filter((f) => f.showOnSite);
  const topics = [...new Set(shown.map((f) => f.topic))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: shown.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
          <Reveal>
            <h1 className="display max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] text-ink">Questions we hear most</h1>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">
              Straight answers, before you call. Anything not here, the studio answers within {settings.metrics.responseTime}.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav className="lg:col-span-3" aria-label="Topics">
            <ul className="space-y-2 lg:sticky lg:top-48">
              {topics.map((t) => (
                <li key={t}>
                  <a href={`#${t.toLowerCase().replace(/\W+/g, "-")}`} className="font-sans text-[13px] text-ink-2 transition-colors hover:text-rose-ink">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14 lg:col-span-8">
            {topics.map((t) => (
              <section key={t} id={t.toLowerCase().replace(/\W+/g, "-")}>
                <h2 className="display text-[28px] text-ink">{t}</h2>
                <div className="mt-4">
                  {shown
                    .filter((f) => f.topic === t)
                    .map((f) => (
                      <details key={f._id} className="group border-b border-line py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-sans text-[16px] text-ink">
                          {f.question}
                          <Plus size={16} weight="light" className="shrink-0 text-rose-ink transition-transform duration-300 group-open:rotate-45" />
                        </summary>
                        <p className="mt-3 max-w-2xl font-sans text-[14.5px] leading-relaxed text-ink-2">{f.answer}</p>
                      </details>
                    ))}
                </div>
              </section>
            ))}
            <div className="rounded-2xl border border-line bg-surface p-8">
              <p className="display text-[24px] text-ink">Still wondering?</p>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-2">Ask the concierge in the corner, or send the studio a note.</p>
              <div className="mt-6">
                <Button href={CTA.custom.href} variant="primary">
                  {CTA.custom.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
