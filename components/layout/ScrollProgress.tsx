"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A thin gold hairline at the very top that tracks scroll progress — a quiet,
 *  software-grade detail. Decorative, so hidden from assistive tech. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-gold-deep via-gold to-gold-soft"
    />
  );
}
