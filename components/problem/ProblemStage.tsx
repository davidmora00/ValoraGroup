"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { MessageSquare, Moon, Database, Mail, Unplug, Copy } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Item = { icon: string; title: string; description: string };

const DWELL = 5000; // ms each frustration holds the stage before auto-advancing

/** Interactive "Problem" stage: pick a frustration (or let it auto-play) and
 *  watch it act out. Each scene is a single, deliberate metaphor on a seamless
 *  loop — and wordless, so it adds no translation load. */
export function ProblemStage({
  items,
  prompt,
  tapHint,
}: {
  items: Item[];
  prompt: string;
  tapHint: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; restart the clock on any change so a manual tap gets a full
  // dwell. Pauses off-screen and on hover.
  useEffect(() => {
    if (reduce || !inView || paused) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % items.length),
      DWELL,
    );
    return () => clearTimeout(id);
  }, [active, inView, reduce, paused, items.length]);

  const item = items[active];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-12"
    >
      {/* Selector — a relatable prompt, then the six frustrations */}
      <div className="lg:col-span-5">
        <p className="text-sm font-medium text-ink">{prompt}</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:mt-5 lg:flex-col lg:overflow-visible lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <button
                key={it.icon}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={cn(
                  "group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors duration-300",
                  on
                    ? "border-gold/40 bg-gold/[0.06]"
                    : "border-line/60 hover:border-line",
                )}
              >
                <Icon
                  name={it.icon}
                  className={cn(
                    "size-5 shrink-0 transition-colors duration-300",
                    on ? "text-gold" : "text-faint group-hover:text-muted",
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap text-sm font-medium transition-colors duration-300 lg:whitespace-normal",
                    on ? "text-ink" : "text-muted",
                  )}
                >
                  {it.title}
                </span>
                {on && !reduce && !paused && inView && (
                  <motion.span
                    key={active}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: DWELL / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-4 hidden text-xs text-faint lg:block">{tapHint}</p>
      </div>

      {/* Stage — the selected frustration, playing out */}
      <div className="lg:col-span-7">
        <div className="surface-card relative flex min-h-[19rem] flex-col overflow-hidden rounded-2xl border border-line p-6 sm:min-h-[21rem] sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.icon}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full grow flex-col"
            >
              <div aria-hidden className="grow">
                <Scene iconName={item.icon} reduce={!!reduce} />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ scenes */

function Scene({ iconName, reduce }: { iconName: string; reduce: boolean }) {
  switch (iconName) {
    case "RefreshCw":
      return <SyncLoop reduce={reduce} />;
    case "MessagesSquare":
      return <QuestionPileup reduce={reduce} />;
    case "MoonStar":
      return <AfterHoursStack reduce={reduce} />;
    case "Unplug":
      return <BrokenConnections reduce={reduce} />;
    case "Timer":
      return <SlowAnswer reduce={reduce} />;
    case "Repeat2":
      return <RepetitiveRows reduce={reduce} />;
    default:
      return null;
  }
}

function SceneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

/** Manual updates that never end — three rows get checked off, then quietly
 *  come undone, and it all has to happen again. */
function SyncLoop({ reduce }: { reduce: boolean }) {
  const widths = ["68%", "82%", "58%"];
  const CYCLE = 4.4;
  return (
    <SceneFrame>
      <div className="space-y-4">
        {widths.map((w, i) => {
          const t = i * 0.13;
          const keyTimes = [0, t, t + 0.16, 0.82, 0.95];
          return (
            <div key={i} className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="size-5 shrink-0">
                <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-line)" strokeWidth="2" />
                <motion.path
                  d="M7.5 12.4l3 3 6-6.4"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={
                    reduce
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : { duration: CYCLE, times: keyTimes, ease: "easeInOut", repeat: Infinity }
                  }
                />
              </svg>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/40">
                <motion.div
                  className="h-full origin-left rounded-full bg-gold/70"
                  initial={false}
                  animate={reduce ? { width: w } : { width: ["0%", "0%", w, w, "0%"] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: CYCLE, times: keyTimes, ease: "easeInOut", repeat: Infinity }
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
}

/** Questions that pull people off real work — focus climbs, a question slams
 *  it back to zero, over and over. */
function QuestionPileup({ reduce }: { reduce: boolean }) {
  const CYCLE = 3.4;
  return (
    <SceneFrame>
      <div className="space-y-7">
        <div className="flex h-9 justify-end">
          <motion.div
            className="flex items-center gap-2 rounded-2xl rounded-br-sm border border-line/70 bg-gold/[0.05] px-3 py-2"
            initial={false}
            animate={
              reduce
                ? { opacity: 1, x: 0 }
                : { opacity: [0, 0, 1, 1, 0], x: [40, 40, 0, 0, 12] }
            }
            transition={
              reduce
                ? undefined
                : { duration: CYCLE, times: [0, 0.42, 0.58, 0.82, 1], ease: [0.16, 1, 0.3, 1], repeat: Infinity }
            }
          >
            <MessageSquare className="size-4 text-gold" strokeWidth={1.5} aria-hidden />
            <span className="font-mono text-sm text-gold">?</span>
          </motion.div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/40">
          <motion.div
            className="h-full origin-left rounded-full bg-gold"
            initial={false}
            animate={reduce ? { width: "58%" } : { width: ["8%", "66%", "8%", "8%"] }}
            transition={
              reduce
                ? undefined
                : { duration: CYCLE, times: [0, 0.54, 0.64, 1], ease: ["easeOut", "easeIn", "linear"], repeat: Infinity }
            }
          />
        </div>
      </div>
    </SceneFrame>
  );
}

/** Tasks that pile up after hours — a moonlit queue that keeps coming, drifting
 *  down endlessly through a soft mask (no reset seam). */
function AfterHoursStack({ reduce }: { reduce: boolean }) {
  const widths = ["72%", "56%", "80%", "62%", "74%"];
  const row = (key: string, w: string) => (
    <div
      key={key}
      className="mb-2.5 flex items-center gap-2.5 rounded-lg border border-line/55 bg-white/[0.02] px-3 py-2.5"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-gold/50" />
      <span className="h-2 rounded-full bg-line/70" style={{ width: w }} />
    </div>
  );
  const mask = "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)";
  return (
    <SceneFrame>
      <div className="mb-3 flex justify-end">
        <Moon className="size-5 text-gold/80" strokeWidth={1.5} aria-hidden />
      </div>
      <div className="h-40 overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <motion.div
          animate={reduce ? undefined : { y: ["-50%", "0%"] }}
          transition={reduce ? undefined : { duration: 11, ease: "linear", repeat: Infinity }}
        >
          {widths.map((w, i) => row("a" + i, w))}
          {widths.map((w, i) => row("b" + i, w))}
        </motion.div>
      </div>
    </SceneFrame>
  );
}

/** Tools that don't talk — data leaves one app, reaches the broken link, and
 *  dies in the gap before it ever arrives. */
function BrokenConnections({ reduce }: { reduce: boolean }) {
  return (
    <SceneFrame>
      <div className="flex items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line/70 bg-white/[0.02]">
          <Database className="size-5 text-muted" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="relative mx-3 h-10 flex-1">
          <span className="absolute left-0 top-1/2 h-px w-[40%] -translate-y-1/2 bg-line/60" />
          <span className="absolute right-0 top-1/2 h-px w-[40%] -translate-y-1/2 bg-line/60" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Unplug className="size-4 text-faint" strokeWidth={1.5} aria-hidden />
          </span>
          <motion.span
            className="absolute top-1/2 left-0 size-2 rounded-full bg-gold"
            initial={false}
            animate={
              reduce
                ? { left: "18%", opacity: 0.35, y: -4 }
                : { left: ["2%", "36%", "40%"], opacity: [0, 1, 0], scale: [0.8, 1, 0.3], y: -4 }
            }
            transition={
              reduce
                ? undefined
                : { duration: 2, times: [0, 0.7, 1], ease: "easeIn", repeat: Infinity, repeatDelay: 0.7 }
            }
          />
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line/70 bg-white/[0.02]">
          <Mail className="size-5 text-muted" strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </SceneFrame>
  );
}

/** Answers that arrive too slowly — a request lurches forward, stalls, lurches,
 *  and never quite arrives, while a slow hand sweeps the clock. */
function SlowAnswer({ reduce }: { reduce: boolean }) {
  const CYCLE = 6;
  return (
    <SceneFrame>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-gold/10">
          <span className="relative size-5 rounded-full border border-gold/40">
            <motion.span
              className="absolute inset-0"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: CYCLE, ease: "linear", repeat: Infinity }}
            >
              <span className="absolute left-1/2 top-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
            </motion.span>
          </span>
        </span>
        <span className="rounded-2xl rounded-bl-sm border border-line/60 px-3.5 py-2.5">
          <motion.span
            className="block size-1.5 rounded-full bg-faint"
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={reduce ? undefined : { duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </div>
      <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-line/40">
        <motion.div
          className="h-full origin-left rounded-full bg-gold"
          initial={false}
          animate={
            reduce
              ? { width: "78%", opacity: 1 }
              : {
                  width: ["4%", "22%", "24%", "55%", "57%", "84%", "86%"],
                  opacity: [1, 1, 1, 1, 1, 1, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: CYCLE, times: [0, 0.16, 0.34, 0.5, 0.68, 0.92, 1], ease: "easeInOut", repeat: Infinity }
          }
        />
      </div>
    </SceneFrame>
  );
}

/** Repetitive work no one should own — the exact same card, stamped out again
 *  and again, scrolling past forever. */
function RepetitiveRows({ reduce }: { reduce: boolean }) {
  const card = (key: string) => (
    <div
      key={key}
      className="mr-3 flex w-24 shrink-0 flex-col gap-2 rounded-lg border border-line/55 bg-white/[0.02] p-3"
    >
      <Copy className="size-3.5 text-gold/60" strokeWidth={1.5} aria-hidden />
      <span className="h-1.5 w-full rounded-full bg-line/70" />
      <span className="h-1.5 w-2/3 rounded-full bg-line/55" />
    </div>
  );
  const mask = "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)";
  const set = [0, 1, 2, 3, 4];
  return (
    <SceneFrame>
      <div className="overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <motion.div
          className="flex"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={reduce ? undefined : { duration: 8, ease: "linear", repeat: Infinity }}
        >
          {set.map((i) => card("a" + i))}
          {set.map((i) => card("b" + i))}
        </motion.div>
      </div>
    </SceneFrame>
  );
}
