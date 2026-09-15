import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import type { Settings } from "@/lib/cms/types";
import { CTA, telHref } from "@/lib/site";

/**
 * Closing invitation. The one centred composition on the page; it earns the
 * centre because the message is the design and nothing competes with it.
 */
export default function ClosingCta({ settings }: { settings: Settings }) {
  return (
    <section className="border-t border-line bg-canvas" aria-labelledby="closing-heading">
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <span className="gold-rule mb-8 inline-flex" aria-hidden="true" />
          <h2 id="closing-heading" className="display mx-auto max-w-3xl text-[clamp(2.25rem,5.5vw,4.25rem)] text-ink">
            Ready to create
            <br />
            something <em className="text-rose-ink">extraordinary</em>
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-7 max-w-lg font-sans text-[14.5px] leading-relaxed text-ink-2">
            A ready piece or something entirely your own. Either way the consultation is free, and you will hear back within{" "}
            <span className="text-ink">{settings.metrics.responseTime}</span>.
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={CTA.custom.href} className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-rose px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-on-rose transition-all duration-300 hover:bg-rose-soft active:translate-y-[1px]">
              {CTA.custom.label}
              <ArrowRight size={13} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href={CTA.browse.href} className="inline-flex items-center whitespace-nowrap rounded-full border border-line-2 px-8 py-4 font-sans text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-rose hover:text-rose-ink">
              {CTA.browse.label}
            </Link>
          </div>
        </Reveal>
        <Reveal index={3}>
          <a href={telHref(settings.contact.phone)} className="mt-9 inline-block font-mono text-[12px] tracking-[0.14em] text-ink-3 transition-colors duration-300 hover:text-rose-ink">
            {settings.contact.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
