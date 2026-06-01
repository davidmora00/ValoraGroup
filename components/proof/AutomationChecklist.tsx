"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Proof tile: repetitive tasks completing themselves, on a loop. */
export function AutomationChecklist({ caption, tasks }: { caption: string; tasks: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(reduce ? tasks.length : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => {
      setDone((d) => (d >= tasks.length ? 0 : d + 1));
    }, 1100);
    return () => clearInterval(id);
  }, [inView, reduce, tasks.length]);

  return (
    <div ref={ref} className="surface-card flex h-full flex-col rounded-2xl border border-line p-6">
      <ul className="space-y-3.5">
        {tasks.map((task, i) => {
          const complete = i < done;
          return (
            <li key={task} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                  complete ? "scale-100 border-gold bg-gold text-canvas" : "border-line",
                )}
              >
                {complete ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : (
                  <span className="size-1.5 rounded-full bg-faint/50" />
                )}
              </span>
              <span className={cn("transition-colors duration-300", complete ? "text-faint" : "text-ink")}>
                {task}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto pt-6 text-sm text-muted">{caption}</p>
    </div>
  );
}
