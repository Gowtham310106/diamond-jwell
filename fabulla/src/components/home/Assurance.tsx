import { Certificate, Diamond, ShieldCheck, ArrowsClockwise, Clock, MapPin, Star, Heart } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import type { Assurance as Item } from "@/lib/cms/types";

/** Glyphs cycle by position; the studio edits the words, not the icons. */
const ICONS = [Certificate, Diamond, ShieldCheck, ArrowsClockwise, Clock, MapPin, Star, Heart];

export default function Assurance({ title, subtitle, items }: { title: string; subtitle?: string; items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-y border-line bg-canvas-2 py-16" aria-labelledby="assurance-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-9 lg:grid-cols-12">
          <Reveal className="text-center lg:col-span-4 lg:text-left">
            <h2 id="assurance-heading" className="display text-[clamp(2rem,4vw,3rem)] text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{subtitle}</p>}
            <span className="mx-auto mt-5 block h-px w-16 bg-gold lg:mx-0" />
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8 lg:gap-5">
            {items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={item.id} index={i}>
                  <div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-surface p-5 text-center shadow-sm transition-all duration-300 hover:border-rose hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                    <Icon size={26} weight="light" className="text-gold transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="display mt-3 text-[16px] leading-tight text-ink">{item.title}</h3>
                    <p className="mt-1 font-sans text-[11px] leading-snug text-ink-3">{item.detail}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
