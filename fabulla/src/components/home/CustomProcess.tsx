"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import type { ProcessStep } from "@/lib/cms/types";
import { CTA } from "@/lib/site";

/**
 * Custom process. A sticky plate on the left cross-fades as each step scrolls
 * past on the right. Active step is driven by viewport entry, not scroll
 * maths. Steps and plates come from the admin.
 */
export default function CustomProcess({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  if (steps.length === 0) return null;

  return (
    <section className="py-24 lg:py-32" aria-labelledby="custom-heading">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <h2 id="custom-heading" className="display max-w-2xl text-[clamp(2.25rem,4.5vw,3.75rem)] text-ink">
          Your vision, our craft
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-48">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                {steps.map((step, i) => (
                  <motion.div key={step.id} className="absolute inset-0" initial={false} animate={{ opacity: active === i ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }} aria-hidden={active !== i}>
                    {step.image && <Image src={step.image} alt={step.title} fill sizes="40vw" className="object-cover" />}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 flex gap-2" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.id} className={`h-px flex-1 transition-colors duration-500 ${active === i ? "bg-rose" : "bg-line-2"}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">Every custom piece starts with your story. Whether you know exactly what you want or only have a feeling, we take it from there.</p>

            <div className="mt-14 flex flex-col">
              {steps.map((step, i) => (
                <motion.div key={step.id} onViewportEnter={() => setActive(i)} viewport={{ margin: "-45% 0px -45% 0px" }} className="border-t border-line py-10 last:border-b lg:py-14">
                  <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-2xl border border-line lg:hidden">
                    {step.image && <Image src={step.image} alt={step.title} fill sizes="100vw" className="object-cover" />}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>
                  <motion.h3 className="display text-[30px] lg:text-[38px]" animate={{ color: active === i ? "#0f172a" : "#6a6870" }} transition={{ duration: reduce ? 0 : 0.5 }}>
                    {step.title}
                  </motion.h3>
                  <p className="mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-ink-2">{step.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Button href={CTA.custom.href} variant="primary">
                {CTA.custom.label}
              </Button>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Consultation is free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
