"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

// A bilingual demo exchange (locale-independent — it shows the assistant
// answering in the customer's language).
const EXCHANGES = [
  { q: "Do you ship worldwide?", a: "Yes — worldwide, with live tracking." },
  { q: "¿Está disponible en oro de 18k?", a: "Sí, y el precio sigue al mercado en vivo." },
];

/** Proof tile: a brand-aware assistant answering in any language, 24/7. */
export function AssistantDemo({ caption }: { caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    let t1: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setTyping(true);
      t1 = setTimeout(() => setTyping(false), 1100);
      setI((v) => (v + 1) % EXCHANGES.length);
    };
    setTyping(true);
    const warm = setTimeout(() => setTyping(false), 1100);
    const id = setInterval(cycle, 4200);
    return () => {
      clearInterval(id);
      clearTimeout(t1);
      clearTimeout(warm);
    };
  }, [inView, reduce]);

  const ex = EXCHANGES[i]!;

  return (
    <div ref={ref} className="surface-card flex h-full flex-col rounded-2xl border border-line p-6">
      <div className="min-h-28 space-y-2.5">
        <motion.div
          key={`q${i}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-gold/15 px-3.5 py-2 text-sm text-ink"
        >
          {ex.q}
        </motion.div>
        <AnimatePresence mode="wait">
          {typing ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-4 py-3"
            >
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-faint"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`a${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-3.5 py-2 text-sm text-muted"
            >
              {ex.a}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-auto pt-6 text-sm text-muted">{caption}</p>
    </div>
  );
}
