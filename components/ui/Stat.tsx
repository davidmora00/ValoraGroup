"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Renders a stat value; if it's a whole number it counts up when scrolled into
 *  view. Non-numeric values (e.g. "24/7") render as-is. */
export function Stat({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const isInt = /^\d+$/.test(value.trim());
  const [display, setDisplay] = useState(() => (isInt && !reduce ? "0" : value));

  useEffect(() => {
    if (reduce || !isInt) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, parseInt(value, 10), {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, isInt, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
