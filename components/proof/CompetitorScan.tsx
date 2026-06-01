"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Proof tile: continuously analyzes competitor data and surfaces how to win —
 *  logistics, social, pricing, content, and more. */
export function CompetitorScan({
  label,
  caption,
  insights,
}: {
  label: string;
  caption: string;
  insights: { tag: string; text: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % insights.length), 1900);
    return () => clearInterval(id);
  }, [inView, reduce, insights.length]);

  return (
    <div ref={ref} className="surface-card flex h-full flex-col rounded-2xl border border-line p-6">
      <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-faint">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/50" />
          <span className="relative inline-flex size-2 rounded-full bg-gold" />
        </span>
        {label}
      </span>

      <ul className="mt-5 space-y-2.5">
        {insights.map((ins, i) => (
          <motion.li
            key={ins.tag}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "rounded-lg border px-3 py-2.5 transition-colors duration-500",
              i === active ? "border-gold/40 bg-gold/[0.06]" : "border-line/50",
            )}
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-gold">
              {ins.tag}
            </span>
            <p className="mt-1 text-sm leading-snug text-muted">{ins.text}</p>
          </motion.li>
        ))}
      </ul>

      <p className="mt-auto pt-6 text-sm text-muted">{caption}</p>
    </div>
  );
}
