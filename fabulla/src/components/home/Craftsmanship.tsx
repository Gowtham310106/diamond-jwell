import Image from "next/image";
import { Certificate, Hammer, ShieldCheck, Heart } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import type { Settings } from "@/lib/cms/types";

/**
 * Craftsmanship: copy and feature grid on the left, a certificate card on the
 * right. The one section that spends the eyebrow budget.
 */
export default function Craftsmanship({ settings }: { settings: Settings }) {
  const { brand, metrics, craftsmanship } = settings;

  const features = [
    { Icon: Certificate, title: "Graded, not guessed", body: "Every stone arrives with its GIA or IGI grading report and laser inscription." },
    { Icon: Hammer, title: "Set by hand", body: "Claw and pave work done at the bench in platinum and solid gold, never cast-and-drop." },
    { Icon: ShieldCheck, title: `Sourced through ${brand.origin.split(",")[0]}`, body: `Direct access to the hub that cuts ${metrics.diamondsFromSurat} of the world's diamonds.` },
    { Icon: Heart, title: "Cared for after", body: "Cleaning, prong tightening and resizing for the life of the piece." },
  ];

  return (
    <section className="border-t border-line bg-canvas py-16 md:py-20" aria-labelledby="craft-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Handcrafted heritage</p>
              <h2 id="craft-heading" className="display mt-4 max-w-xl text-[clamp(2rem,4vw,3.1rem)] text-ink">
                Where precision meets
                <br className="hidden sm:inline" /> timeless artistry
              </h2>
              <p className="mt-6 max-w-2xl font-sans text-[14.5px] leading-relaxed text-ink-2">
                {brand.shortName} is built on generations of craftsmanship rooted in {brand.origin}, paired with a bench in {brand.city}. Stones are vetted, graded and hand-set, and the person who designs your piece is the person who builds it.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-7 sm:grid-cols-2">
              {features.map(({ Icon, title, body }, i) => (
                <Reveal key={title} index={i} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-gold shadow-sm">
                    <Icon size={19} weight="light" />
                  </span>
                  <div>
                    <h3 className="display text-[18px] text-ink">{title}</h3>
                    <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-ink-3">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal index={2} className="lg:col-span-5">
            <div className="relative mx-auto flex aspect-square w-full max-w-[400px] flex-col justify-between overflow-hidden rounded-3xl border border-line p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
              {craftsmanship.image && <Image src={craftsmanship.image} alt="" fill sizes="400px" className="object-cover opacity-[0.06]" />}
              <span className="absolute inset-0 bg-surface/92" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-ink">Certificate of integrity</span>
                <Certificate size={18} weight="light" className="text-gold" />
              </div>
              <div className="relative z-10 py-6 text-center">
                <span className="display block text-[56px] leading-none text-ink">100%</span>
                <p className="display mt-3 text-[19px] text-ink">Certified and traceable</p>
                <p className="mx-auto mt-4 max-w-[280px] font-sans text-[12.5px] leading-relaxed text-ink-3">Every purchase arrives with its grading report, inscription verification and appraisal for insurance.</p>
              </div>
              <div className="relative z-10 flex items-center justify-between border-t border-line pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">
                <span>Genuine value</span>
                <span>Authentic origin</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
