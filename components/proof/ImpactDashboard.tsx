"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const BARS = [38, 52, 44, 67, 58, 80, 72];
const TARGET = 142;

/** Proof tile: a live impact dashboard — the time AI gives back, measured. */
export function ImpactDashboard({ label, caption }: { label: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? TARGET : 0);
  const [grown, setGrown] = useState(reduce);

  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(0, TARGET, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    const tg = setTimeout(() => setGrown(true), 150);
    return () => {
      controls.stop();
      clearTimeout(tg);
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className="surface-card flex h-full flex-col rounded-2xl border border-line p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-faint">{label}</span>
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp className="size-3.5" /> +18%
        </span>
      </div>
      <div className="mt-5 flex items-end gap-2">
        <span className="font-display text-4xl tabular-nums text-ink sm:text-5xl">{n}</span>
        <span className="pb-1.5 text-sm text-faint">h</span>
      </div>
      <div className="mt-5 flex h-16 items-end gap-1.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-700 ease-out"
            style={{
              height: grown ? `${h}%` : "6%",
              transitionDelay: `${i * 70}ms`,
              background:
                i === BARS.length - 1 ? "var(--color-gold)" : "color-mix(in srgb, var(--color-gold) 30%, transparent)",
            }}
          />
        ))}
      </div>
      <p className="mt-auto pt-6 text-sm text-muted">{caption}</p>
    </div>
  );
}
