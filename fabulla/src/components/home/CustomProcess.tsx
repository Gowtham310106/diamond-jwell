"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import { CTA, METRICS } from "@/lib/site";
import { ART } from "@/lib/products";

/**
 * Custom process.
 *
 * A sticky plate on the left cross-fades as each step scrolls past on the
 * right. The motion is storytelling: the image is answering "what is happening
 * at this stage", so it has to change in step with the text. Without the
 * cross-fade the section is three paragraphs and a photo.
 *
 * Active step is driven by viewport entry (IntersectionObserver via Motion),
 * not by scroll position maths.
 *
 * No "Stage 1 / Stage 2" labels: the verb is the label.
 */

const STEPS = [
  {
    key: "consultation",
    title: "Consultation",
    body:
      "Share the vision, the budget, and the style. Free, unhurried, and with the person who will actually build the piece.",
    art: ART.showroom,
    alt: "A consultation in the Fabulla Chicago showroom",
  },
  {
    key: "design",
    title: "Design and source",
    body:
      "We draw the piece and find the stone against your budget. Natural or lab-grown, with the same expertise behind both.",
    art: ART.surat,
    alt: "Loose diamonds being graded and matched",
  },
  {
    key: "craft",
    title: "Crafted for you",
    body: `Set, finished and delivered by hand. Most commissions leave the bench in ${METRICS.customTimeline}.`,
    art: ART.bench,
    alt: "A jeweller setting stones at the bench",
  },
] as const;

export default function CustomProcess() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section className="py-24 lg:py-32" aria-labelledby="custom-heading">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <h2
          id="custom-heading"
          className="display max-w-2xl text-[clamp(2.25rem,4.5vw,3.75rem)] text-ink"
        >
          Your vision, our craft
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Sticky plate. Hidden below lg, where sticky would fight the
              single-column reading order. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.key}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    aria-hidden={active !== i}
                  >
                    <Image
                      src={step.art}
                      alt={step.alt}
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
                  </motion.div>
                ))}
              </div>

              {/* Progress: three hairlines, the active one filled. This is
                  real state, not decoration. */}
              <div className="mt-5 flex gap-2" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-px flex-1 transition-colors duration-500 ${
                      active === i ? "bg-rose" : "bg-line-strong"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-lg font-sans text-[15px] leading-relaxed text-ink-2">
              Every custom piece starts with your story. Whether you know
              exactly what you want or only have a feeling, we take it from
              there.
            </p>

            <div className="mt-14 flex flex-col">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.key}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  className="border-t border-line py-10 last:border-b lg:py-14"
                >
                  {/* Mobile plate: the sticky column is hidden here, so each
                      step carries its own image. */}
                  <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-2xl border border-line lg:hidden">
                    <Image
                      src={step.art}
                      alt={step.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>

                  <motion.h3
                    className="display text-[30px] lg:text-[38px]"
                    animate={{
                      color: active === i ? "#f0ede9" : "#6a6870",
                    }}
                    transition={{ duration: reduce ? 0 : 0.5 }}
                  >
                    {step.title}
                  </motion.h3>
                  <p className="mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-ink-2">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Button href={CTA.custom.href} variant="primary">
                {CTA.custom.label}
              </Button>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                Consultation is free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
