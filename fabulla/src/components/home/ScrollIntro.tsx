"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { INTRO_SCREENS } from "@/lib/navigation";

/**
 * Cinematic intro.
 *
 * Four full-viewport screens that stack and pin as you scroll, taken straight
 * from the reference build's opening. The structure is nested sticky
 * containers: screen one scrolls away to reveal screen two pinned beneath it,
 * and so on down the stack. Each screen's caption fades and unblurs only while
 * its screen is the one on top.
 *
 * Two changes from the reference:
 *
 * 1. It drove the caption state from window.addEventListener("scroll"), which
 *    fires on every frame and re-renders the tree each time. This reads the
 *    same progress from Motion's useScroll and only commits state on an actual
 *    screen change, so there are four re-renders across 400vh instead of
 *    hundreds.
 * 2. Under prefers-reduced-motion the whole sequence collapses to a single
 *    static screen rather than pinning the viewport for four screen-heights,
 *    which is disorienting for anyone who asked for less movement.
 */
export default function ScrollIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // 4 screens across the scroll range; clamp so the last screen holds.
    const next = Math.min(INTRO_SCREENS.length - 1, Math.floor(p * INTRO_SCREENS.length));
    setActive((current) => (current === next ? current : next));
  });

  if (reduce) {
    const only = INTRO_SCREENS[0];
    return (
      <div className="relative h-[100svh] w-full overflow-hidden bg-ink">
        <Media screen={only} priority />
        <Caption screen={only} isActive />
      </div>
    );
  }

  // Nested sticky stack. Each level is one screen-height shorter than the one
  // that contains it, which is what staggers the reveals.
  const [s1, s2, s3, s4] = INTRO_SCREENS;

  return (
    <div ref={ref} className="relative h-[400vh] w-full bg-ink">
      {/* Screen 4: the base of the stack, revealed last. */}
      <div className="sticky top-0 z-[1] h-[100svh] w-full overflow-hidden">
        <Media screen={s4} />
        <Caption screen={s4} isActive={active === 3} />
      </div>

      <div className="absolute inset-x-0 top-0 z-[2] h-[300vh]">
        {/* Screen 3 */}
        <div className="sticky top-0 z-[2] h-[100svh] w-full overflow-hidden">
          <Media screen={s3} />
          <Caption screen={s3} isActive={active === 2} />
        </div>

        <div className="absolute inset-x-0 top-0 z-[3] h-[200vh]">
          {/* Screen 2 */}
          <div className="sticky top-0 z-[3] h-[100svh] w-full overflow-hidden">
            <Media screen={s2} />
            <Caption screen={s2} isActive={active === 1} />
          </div>

          {/* Screen 1: not sticky, so it scrolls away first. */}
          <div className="absolute inset-x-0 top-0 z-[4] h-[100svh] w-full overflow-hidden">
            <Media screen={s1} priority />
            <Caption screen={s1} isActive={active === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Media({
  screen,
  priority = false,
}: {
  screen: (typeof INTRO_SCREENS)[number];
  priority?: boolean;
}) {
  if (screen.kind === "image") {
    return (
      <Image
        src={screen.src}
        alt=""
        fill
        priority={priority}
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      // The poster paints immediately and stays if the clip never arrives, so
      // a slow connection or a missing asset degrades to a still rather than
      // to a black rectangle with floating text.
      poster={screen.poster}
      preload={priority ? "auto" : "metadata"}
      aria-hidden="true"
      className="h-full w-full bg-ink object-cover"
    >
      <source src={screen.src} type="video/mp4" />
    </video>
  );
}

function Caption({
  screen,
  isActive,
}: {
  screen: (typeof INTRO_SCREENS)[number];
  isActive: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-end bg-black/30 p-8 text-left sm:p-14 lg:p-20">
      <div
        className={`max-w-2xl transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-6 opacity-0 blur-[3px]"
        }`}
      >
        <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)] uppercase tracking-[0.12em] text-white drop-shadow-lg">
          {screen.title}
        </h2>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/90 drop-shadow sm:text-[11px]">
          {screen.subtitle}
        </p>
      </div>
    </div>
  );
}
