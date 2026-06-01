"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  RefreshCw,
  MessageSquare,
  Moon,
  Database,
  Mail,
  CreditCard,
  Calendar,
  Clock,
  Copy,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Item = { icon: string; title: string; description: string };

const DWELL = 4200; // ms each frustration holds the stage before auto-advancing

/** Interactive "Problem" stage: pick a frustration (or let it auto-play) and
 *  watch it act out — each scene shows the pain instead of describing it.
 *  Scenes are wordless (icons, bars, counters) so they add no translation load. */
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

  // Auto-advance through the frustrations; restart the clock on any change so a
  // manual tap always gets a full dwell. Pauses off-screen and on hover.
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
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

/** Manual updates that never end — a progress bar refills forever, count climbs. */
function SyncLoop({ reduce }: { reduce: boolean }) {
  const [count, setCount] = useState(1248);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCount((c) => c + 1), 1500);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <SceneFrame>
      <div className="flex items-center justify-between">
        <motion.span
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          className="grid size-10 place-items-center rounded-xl bg-gold/10"
        >
          <RefreshCw className="size-5 text-gold" strokeWidth={1.5} aria-hidden />
        </motion.span>
        <span className="font-mono text-3xl font-light tabular-nums text-ink">
          {count.toLocaleString()}
        </span>
      </div>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line/40">
        <motion.div
          className="h-full rounded-full bg-gold"
          animate={reduce ? { width: "68%" } : { width: ["0%", "94%", "94%", "0%"] }}
          transition={
            reduce
              ? {}
              : {
                  duration: 1.5,
                  times: [0, 0.7, 0.86, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      </div>
      <div className="mt-6 space-y-2.5">
        {[70, 52, 84].map((w, r) => (
          <div key={r} className="flex items-center gap-2.5">
            <span className="size-1.5 shrink-0 rounded-full bg-faint/50" />
            <span className="h-2 rounded-full bg-line/60" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </SceneFrame>
  );
}

/** Questions that pull people off real work — the same bubble keeps popping in. */
function QuestionPileup({ reduce }: { reduce: boolean }) {
  const widths = [128, 96, 144, 108];
  return (
    <SceneFrame>
      <div className="flex flex-col gap-2.5">
        {widths.map((w, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2.5 self-start rounded-2xl rounded-bl-sm border border-line/70 bg-gold/[0.04] px-3.5 py-2.5"
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: [0, 1, 1, 0.2], y: [12, 0, 0, 0] }
            }
            transition={
              reduce
                ? {}
                : {
                    duration: 3.4,
                    times: [0, 0.12, 0.82, 1],
                    delay: i * 0.55,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }
            }
          >
            <MessageSquare className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
            <span className="h-2 rounded-full bg-muted/40" style={{ width: w }} />
            <span className="font-mono text-sm text-gold">?</span>
          </motion.div>
        ))}
      </div>
    </SceneFrame>
  );
}

/** Tasks that pile up after hours — a moonlit queue that keeps growing. */
function AfterHoursStack({ reduce }: { reduce: boolean }) {
  const MAX = 6;
  const [n, setN] = useState(reduce ? 4 : 1);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((v) => (v >= MAX ? 1 : v + 1)), 900);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <SceneFrame>
      <div className="mb-4 flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-gold/10">
          <Moon className="size-5 text-gold" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-3xl font-light tabular-nums text-ink">{n}</span>
          <span className="size-2 animate-pulse rounded-full bg-gold" />
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {Array.from({ length: n }).map((_, i) => (
            <motion.div
              key={i}
              layout
              initial={reduce ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5 rounded-lg border border-line/60 px-3 py-2"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-gold/60" />
              <span
                className="h-2 rounded-full bg-line/70"
                style={{ width: `${62 + ((i * 41) % 33)}%` }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SceneFrame>
  );
}

/** Tools that don't talk — distinct apps, connectors flickering and snapping. */
function BrokenConnections({ reduce }: { reduce: boolean }) {
  const tools = [Database, Mail, CreditCard, Calendar];
  return (
    <SceneFrame>
      <div className="flex items-center justify-center">
        {tools.map((T, i) => (
          <div key={i} className="flex items-center">
            <motion.span
              className="grid size-12 place-items-center rounded-xl border border-line/70 bg-canvas"
              animate={reduce ? {} : { y: [0, i % 2 ? -4 : 4, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <T className="size-5 text-muted" strokeWidth={1.5} aria-hidden />
            </motion.span>
            {i < tools.length - 1 && (
              <span className="mx-1.5 flex w-7 items-center gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-px flex-1 bg-gold/70"
                    animate={reduce ? { opacity: 0.3 } : { opacity: [0.12, 0.9, 0.12] }}
                    transition={{
                      duration: 1.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3 + d * 0.16,
                    }}
                  />
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
    </SceneFrame>
  );
}

/** Answers that arrive too slowly — a clock ticks, bars shimmer but never fill. */
function SlowAnswer({ reduce }: { reduce: boolean }) {
  const [s, setS] = useState(11);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <SceneFrame>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-gold/10">
          <Clock className="size-5 text-gold" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="font-mono text-3xl font-light tabular-nums text-ink">
          {s}
          <span className="ml-0.5 text-base text-faint">s</span>
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {[100, 82, 90].map((w, r) => (
          <div
            key={r}
            className="relative h-2.5 overflow-hidden rounded-full bg-line/40"
            style={{ width: `${w}%` }}
          >
            {!reduce && (
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-gold/30 to-transparent"
                animate={{ x: ["-120%", "330%"] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: r * 0.2,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-1.5">
        {[0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className="size-2 rounded-full bg-faint"
            animate={reduce ? {} : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
          />
        ))}
      </div>
    </SceneFrame>
  );
}

/** Repetitive work no one should own — identical rows, copied again and again. */
function RepetitiveRows({ reduce }: { reduce: boolean }) {
  const MAX = 5;
  const [n, setN] = useState(reduce ? 4 : 1);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((v) => (v >= MAX ? 1 : v + 1)), 850);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <SceneFrame>
      <div className="space-y-2">
        {Array.from({ length: MAX }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i < n ? 1 : 0.12 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 rounded-lg border border-line/50 px-3 py-2.5"
          >
            <Copy className="size-4 shrink-0 text-gold/70" strokeWidth={1.5} aria-hidden />
            <span className="h-2 flex-1 rounded-full bg-line/70" />
            <span className="h-2 w-10 shrink-0 rounded-full bg-gold/30" />
          </motion.div>
        ))}
      </div>
    </SceneFrame>
  );
}
