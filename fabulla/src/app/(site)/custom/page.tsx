import type { Metadata } from "next";
import Image from "next/image";
import CustomProcess from "@/components/home/CustomProcess";
import ClosingCta from "@/components/home/ClosingCta";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { getSettings } from "@/lib/cms/repo";
import { CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom jewelry",
  description: "Custom diamond jewelry made in Chicago. Consultation to finished piece in two to four weeks, natural or lab-grown.",
};

export const revalidate = 60;

export default async function CustomPage() {
  const settings = await getSettings();
  const { metrics, process } = settings;
  const heroImage = process[process.length - 1]?.image ?? process[0]?.image ?? "";

  const stoneChoice = [
    {
      kind: "Natural",
      body: "Formed over billions of years and priced accordingly. The choice when provenance and long-term resale matter to you.",
      points: ["GIA graded", "Held resale value", `Sourced through ${settings.brand.origin.split(",")[0]}`],
    },
    {
      kind: "Lab-grown",
      body: `Chemically and optically identical to natural, at ${metrics.labGrownSaving} less. The choice when carat weight matters more than origin.`,
      points: ["IGI graded", `${metrics.labGrownSaving} less cost`, "Larger stone, same budget"],
    },
  ];

  return (
    <>
      <header className="relative isolate border-b border-line">
        <div className="absolute inset-0 -z-10">
          {heroImage && <Image src={heroImage} alt="" fill priority quality={70} sizes="100vw" className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/45" />
        </div>
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-32">
          <div className="max-w-2xl">
            {/* Light type: the scrim runs to solid ink under this column. */}
            <p className="eyebrow !text-rose">Custom work</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4.75rem)] text-white">
              Bring us a sketch,
              <br />
              a photo, or a <em className="text-rose">feeling</em>
            </h1>
            <p className="mt-8 max-w-lg font-sans text-[15px] leading-relaxed text-white/85">You work directly with the designer, the sourcer and the craftsman. No middlemen, no call centre, no compromises on the stone.</p>
            <div className="mt-11">
              <Button href={CTA.custom.href} variant="primary">
                {CTA.custom.label}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CustomProcess steps={process} />

      <section id="stones" className="border-t border-line py-24 lg:py-32" aria-labelledby="stones-heading">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Reveal>
            <h2 id="stones-heading" className="display max-w-2xl text-[clamp(2.25rem,4.5vw,3.5rem)] text-ink">
              Natural or lab-grown, your call
            </h2>
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-ink-2">We offer both with equal expertise and we will tell you honestly which one serves your budget better.</p>
          </Reveal>
          <div className="mt-16 grid gap-px border-t border-line-2 md:grid-cols-2">
            {stoneChoice.map((s, i) => (
              <Reveal key={s.kind} index={i} className="border-b border-line-2 py-10 md:border-b-0 md:pr-10 md:last:border-l md:last:pl-10 md:last:pr-0">
                <h3 className="display text-[32px] text-ink lg:text-[38px]">{s.kind}</h3>
                <p className="mt-5 max-w-sm font-sans text-[14.5px] leading-relaxed text-ink-2">{s.body}</p>
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="rounded-2xl border border-line px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta settings={settings} />
    </>
  );
}
