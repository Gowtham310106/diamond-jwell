import {
  Certificate,
  Diamond,
  ShieldCheck,
  ArrowsClockwise,
  Clock,
  MapPin,
} from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";

/**
 * The assurance block from the reference build: heading held on the left,
 * badges gridded on the right.
 *
 * The reference pulled six raster badge SVGs from the brand it was cloned
 * from. Those are someone else's assets, so these are Phosphor glyphs at a
 * single consistent weight instead.
 */

const BADGES = [
  { Icon: Certificate, title: "GIA & IGI certified", note: "Graded, every stone" },
  { Icon: Diamond, title: "Natural or lab-grown", note: "Equal expertise in both" },
  { Icon: ShieldCheck, title: "Lifetime guarantee", note: "Quality assured" },
  { Icon: ArrowsClockwise, title: "Custom capable", note: "Concept to completion" },
  { Icon: Clock, title: "24-hour response", note: "A real person, every time" },
  { Icon: MapPin, title: "Chicago showroom", note: "By appointment" },
];

export default function Assurance() {
  return (
    <section
      className="border-y border-line bg-canvas-2 py-16"
      aria-labelledby="assurance-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-9 lg:grid-cols-12">
          <Reveal className="text-center lg:col-span-4 lg:text-left">
            <h2
              id="assurance-heading"
              className="display text-[clamp(2rem,4vw,3rem)] text-ink"
            >
              The Fabulla assurance
            </h2>
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              Crafted by hand, guaranteed for life
            </p>
            <span className="mx-auto mt-5 block h-px w-16 bg-gold lg:mx-0" />
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8 lg:gap-5">
            {BADGES.map(({ Icon, title, note }, i) => (
              <Reveal key={title} index={i}>
                <div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-surface p-5 text-center shadow-sm transition-all duration-300 hover:border-rose hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                  <Icon
                    size={26}
                    weight="light"
                    className="text-gold transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="display mt-3 text-[16px] leading-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-1 font-sans text-[11px] leading-snug text-ink-3">
                    {note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
