"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger index. Multiplied by 60ms. */
  index?: number;
  /** Travel distance in px. Keep small; this is a luxury site, not a slide deck. */
  y?: number;
  className?: string;
};

/**
 * Entry reveal on scroll.
 *
 * Motivation: establishes reading order. Sections carry a lot of quiet space,
 * and without a reveal the eye lands nowhere in particular. The stagger tells
 * you what to read first.
 *
 * Uses Motion's whileInView (IntersectionObserver under the hood). No scroll
 * listener, no per-frame React state.
 */
export default function Reveal({
  children,
  index = 0,
  y = 18,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      // Marks every element that ships from the server at opacity 0 so the
      // no-JS override in layout.tsx can force it visible. Without this the
      // page is blank when JavaScript is blocked or fails to execute.
      data-reveal
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.75,
        delay: reduce ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
