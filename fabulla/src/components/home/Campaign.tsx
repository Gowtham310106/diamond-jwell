import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/ssr";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/site/ProductCard";
import type { ProductView } from "@/lib/cms/repo";
import type { Settings } from "@/lib/cms/types";
import { CTA } from "@/lib/site";

/** Editorial card beside a featured product grid. */
export default function Campaign({ settings, products, image }: { settings: Settings; products: ProductView[]; image: string }) {
  const { campaign, metrics } = settings;
  const [first, ...rest] = campaign.title.split(" ");
  void first;

  return (
    <section className="border-t border-line bg-canvas py-16 md:py-20" aria-labelledby="campaign-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <div className="relative flex h-full min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-line p-8 md:p-10">
              {image && <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/65 to-ink/85" />

              <div className="relative z-10">
                {campaign.eyebrow && (
                  <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    {campaign.eyebrow}
                  </span>
                )}
                <h2 id="campaign-heading" className="display mt-5 text-[34px] leading-[1.05] text-white sm:text-[42px]">
                  {rest.length ? (
                    <>
                      {campaign.title.slice(0, campaign.title.lastIndexOf(" "))} <em className="text-rose">{campaign.title.slice(campaign.title.lastIndexOf(" ") + 1)}</em>
                    </>
                  ) : (
                    campaign.title
                  )}
                </h2>
                <p className="mt-5 max-w-sm font-sans text-[13.5px] leading-relaxed text-white/80">{campaign.body}</p>
              </div>

              <div className="relative z-10 mt-8 space-y-5 border-t border-white/20 pt-6">
                <p className="flex items-center gap-2.5 font-sans text-[11.5px] text-white/75">
                  <ShieldCheck size={17} weight="light" className="text-rose" />
                  Free consultation · {metrics.customTimeline} from concept
                </p>
                <Link href={CTA.custom.href} className="group inline-flex items-center gap-2.5 rounded-full border border-white px-6 py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-ink">
                  {CTA.custom.label}
                  <ArrowRight size={13} weight="light" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {products.slice(0, 4).map((p, i) => (
                <Reveal key={p._id} index={i}>
                  <ProductCard product={p} ratio="square" sizes="(max-width: 640px) 100vw, 28vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
