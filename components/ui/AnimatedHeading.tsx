"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Hero headline that assembles word-by-word with a soft blur-rise — the
 * "groundbreaking" signature moment. `lead` is the plain text; `accent` is the
 * gold-gradient phrase that lands last. Degrades to a static heading when the
 * visitor prefers reduced motion.
 */
export function AnimatedHeading({
  lead,
  accent,
  className,
}: {
  lead: string;
  accent: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1 className={className}>
        {lead}
        <span className="text-gold-gradient">{accent}</span>
      </h1>
    );
  }

  const tokens = lead.split(/(\s+)/);

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="show">
      {tokens.map((tok, i) =>
        tok.trim() === "" ? (
          <span key={i}>{tok}</span>
        ) : (
          <motion.span key={i} variants={word} className="inline-block will-change-transform">
            {tok}
          </motion.span>
        ),
      )}
      <motion.span variants={word} className="inline-block text-gold-gradient will-change-transform">
        {accent}
      </motion.span>
    </motion.h1>
  );
}
