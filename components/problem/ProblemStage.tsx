"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { RefreshCw, MessageSquare, Target, Moon, Database, Mail, Copy } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Item = { icon: string; title: string; description: string };

const DWELL = 5000; // ms each frustration holds the stage before auto-advancing

/** Interactive "Problem" stage: pick a frustration (or let it auto-play) and
 *  watch it act out. Each scene is one luminous, deliberate metaphor on a
 *  seamless loop — and wordless, so it adds no translation load. */
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
                    ? "border-gold/40 bg-gold/[0.06] shadow-[0_0_26px_-12px_rgba(216,178,122,0.85)]"
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
          <StageAmbiance reduce={!!reduce} />
          <AnimatePresence mode="wait">
            <motion.div
              key={item.icon}
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full grow flex-col"
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

/* --------------------------------------------------------------- ambiance */

/** Living backdrop shared by every scene: a faint dot-grid, a breathing gold
 *  glow, and a soft vignette — gives the flat stage real depth. */
function StageAmbiance({ reduce }: { reduce: boolean }) {
  const dotMask = "radial-gradient(ellipse at center, #000 35%, transparent 78%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1.5px)] [background-size:26px_26px]"
        style={{ maskImage: dotMask, WebkitMaskImage: dotMask }}
      />
      <motion.div
        className="absolute left-1/2 top-[38%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(216,178,122,0.16), transparent 70%)" }}
        animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [0.92, 1.06, 0.92] }}
        transition={reduce ? undefined : { duration: 8, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.4))" }}
      />
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
    <div className="flex h-full min-h-[12rem] items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

/** Manual updates that never end — a sync gauge fills, pulses "done", then
 *  drains and starts over. Forever. */
function SyncLoop({ reduce }: { reduce: boolean }) {
  const CYCLE = 3.8;
  const times = [0, 0.5, 0.62, 1];
  return (
    <SceneFrame>
      <div className="relative mx-auto grid size-40 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
          <defs>
            <linearGradient id="syncArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(216,178,122,0.25)" />
              <stop offset="100%" stopColor="rgba(216,178,122,1)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
          <motion.circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="url(#syncArc)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={false}
            animate={reduce ? { pathLength: 0.7 } : { pathLength: [0.02, 1, 1, 0.02] }}
            transition={reduce ? undefined : { duration: CYCLE, times, ease: "easeInOut", repeat: Infinity }}
            style={{ filter: "drop-shadow(0 0 5px rgba(216,178,122,0.45))" }}
          />
        </svg>
        {!reduce && (
          <motion.span
            className="absolute rounded-full border border-gold/40"
            style={{ width: "80%", height: "80%" }}
            animate={{ opacity: [0, 0, 0.6, 0], scale: [0.85, 0.85, 1.25, 1.4] }}
            transition={{ duration: CYCLE, times: [0, 0.5, 0.6, 0.74], ease: "easeOut", repeat: Infinity }}
          />
        )}
        <span
          className="relative grid size-12 place-items-center rounded-full bg-gold/10"
          style={{ boxShadow: "inset 0 0 0 1px rgba(216,178,122,0.18)" }}
        >
          <motion.span
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 2.4, ease: "linear", repeat: Infinity }}
          >
            <RefreshCw className="size-5 text-gold/80" strokeWidth={1.6} aria-hidden />
          </motion.span>
        </span>
      </div>
    </SceneFrame>
  );
}

/** Questions that pull people off real work — a calm focus orb keeps trying to
 *  brighten, and incoming questions keep knocking it down. */
function QuestionPileup({ reduce }: { reduce: boolean }) {
  const CYCLE = 3.2;
  const rows = [22, 50, 78];
  return (
    <SceneFrame>
      <div className="relative flex h-36 items-center justify-center">
        <motion.span
          className="relative z-10 grid size-16 place-items-center rounded-full"
          style={{ background: "radial-gradient(circle at 38% 32%, rgba(216,178,122,0.45), rgba(216,178,122,0.06) 72%)" }}
          animate={reduce ? undefined : { scale: [1, 1.06, 0.82, 0.92, 1] }}
          transition={reduce ? undefined : { duration: CYCLE, times: [0, 0.42, 0.52, 0.7, 1], ease: "easeInOut", repeat: Infinity }}
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            animate={
              reduce
                ? undefined
                : {
                    boxShadow: [
                      "0 0 18px rgba(216,178,122,0.25)",
                      "0 0 30px rgba(216,178,122,0.4)",
                      "0 0 8px rgba(216,178,122,0.12)",
                      "0 0 18px rgba(216,178,122,0.25)",
                    ],
                  }
            }
            transition={reduce ? undefined : { duration: CYCLE, times: [0, 0.42, 0.55, 1], ease: "easeInOut", repeat: Infinity }}
          />
          <Target className="relative size-6 text-gold" strokeWidth={1.4} aria-hidden />
        </motion.span>
        {rows.map((top, i) => (
          <motion.span
            key={i}
            className="absolute right-1 flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-canvas/80 px-2.5 py-1 backdrop-blur-sm"
            style={{ top: `${top}%` }}
            initial={false}
            animate={reduce ? { opacity: 0.35, x: -30 } : { x: [70, -90], opacity: [0, 1, 1, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 1.5, delay: i * 0.45, times: [0, 0.22, 0.7, 1], ease: "easeIn", repeat: Infinity, repeatDelay: Math.max(0.2, CYCLE - 1.5) }
            }
          >
            <MessageSquare className="size-3.5 text-gold/80" strokeWidth={1.6} aria-hidden />
            <span className="font-mono text-xs text-gold">?</span>
          </motion.span>
        ))}
      </div>
    </SceneFrame>
  );
}

/** Tasks that pile up after hours — a glowing moon, a quiet starfield, and an
 *  endless masked queue drifting down through the night. */
function AfterHoursStack({ reduce }: { reduce: boolean }) {
  const widths = ["72%", "56%", "80%", "62%", "74%"];
  const row = (key: string, w: string) => (
    <div
      key={key}
      className="mb-2.5 flex items-center gap-2.5 rounded-lg border border-white/10 bg-linear-to-r from-white/[0.09] to-white/[0.02] px-3 py-2.5"
    >
      <span className="h-4 w-0.5 shrink-0 rounded-full bg-gold" />
      <span className="h-2 rounded-full bg-white/25" style={{ width: w }} />
    </div>
  );
  const mask = "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)";
  const stars: [number, number][] = [[8, 20], [78, 10], [60, 34], [26, 46]];
  return (
    <SceneFrame>
      <div className="relative mb-3 flex h-7 justify-end">
        {stars.map(([x, y], i) => (
          <motion.span
            key={i}
            className="absolute size-0.5 rounded-full bg-white/70"
            style={{ right: `${x}%`, top: `${y}%` }}
            animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={reduce ? undefined : { duration: 2.4, delay: i * 0.5, ease: "easeInOut", repeat: Infinity }}
          />
        ))}
        <span className="relative grid size-7 place-items-center rounded-full" style={{ boxShadow: "0 0 16px 1px rgba(216,178,122,0.4)" }}>
          <Moon className="size-5 text-gold/90" strokeWidth={1.5} aria-hidden />
        </span>
      </div>
      <div className="h-40 overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <motion.div
          animate={reduce ? undefined : { y: ["-50%", "0%"] }}
          transition={reduce ? undefined : { duration: 12, ease: "linear", repeat: Infinity }}
        >
          {widths.map((w, i) => row("a" + i, w))}
          {widths.map((w, i) => row("b" + i, w))}
        </motion.div>
      </div>
    </SceneFrame>
  );
}

/** Tools that don't talk — data leaves one glowing app, reaches the sparking
 *  break, and shatters into particles before it ever arrives. */
function BrokenConnections({ reduce }: { reduce: boolean }) {
  const CYCLE = 2.4;
  const tile = (Glyph: typeof Database) => (
    <span
      className="relative grid size-14 shrink-0 place-items-center rounded-xl border border-white/[0.14] bg-linear-to-b from-white/[0.10] to-white/[0.02]"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px -14px rgba(0,0,0,0.9)" }}
    >
      <Glyph className="size-5 text-ink/80" strokeWidth={1.5} aria-hidden />
    </span>
  );
  const particles: [number, number][] = [[-10, -12], [8, -14], [-14, 6], [12, 8], [0, 16]];
  return (
    <SceneFrame>
      <div className="flex items-center">
        {tile(Database)}
        <div className="relative mx-3 h-12 flex-1">
          <span className="absolute left-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-linear-to-r from-transparent to-line" />
          <span className="absolute right-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-linear-to-l from-transparent to-line" />
          <motion.span
            className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
            style={{ boxShadow: "0 0 8px rgba(216,178,122,0.7)" }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
            transition={reduce ? undefined : { duration: 0.8, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.span
            className="absolute left-0 top-1/2 size-2 rounded-full bg-gold"
            style={{ boxShadow: "0 0 10px rgba(216,178,122,0.7)" }}
            initial={false}
            animate={
              reduce
                ? { left: "20%", opacity: 0.4, y: -4 }
                : { left: ["4%", "42%", "46%"], opacity: [0, 1, 0], scale: [0.7, 1, 0.4], y: -4 }
            }
            transition={reduce ? undefined : { duration: CYCLE, times: [0, 0.62, 0.72], ease: "easeIn", repeat: Infinity, repeatDelay: 0.5 }}
          />
          {!reduce &&
            particles.map(([dx, dy], i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 size-0.5 rounded-full bg-gold"
                animate={{ x: [0, 0, dx, dx], y: [-4, -4, dy - 4, dy - 4], opacity: [0, 0, 1, 0] }}
                transition={{ duration: CYCLE, times: [0, 0.62, 0.72, 0.82], ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
              />
            ))}
        </div>
        {tile(Mail)}
      </div>
    </SceneFrame>
  );
}

/** Answers that arrive too slowly — a slow-sweeping clock, and a request that
 *  lurches, stalls, and fades out before it ever reaches the answer. */
function SlowAnswer({ reduce }: { reduce: boolean }) {
  const CYCLE = 6.5;
  return (
    <SceneFrame>
      <div className="space-y-8">
        <div className="flex justify-center">
          <span className="relative size-9 rounded-full border border-gold/40" style={{ boxShadow: "0 0 14px -2px rgba(216,178,122,0.4)" }}>
            <motion.span
              className="absolute inset-0"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: CYCLE, ease: "linear", repeat: Infinity }}
            >
              <span className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-gold" style={{ boxShadow: "0 0 6px rgba(216,178,122,0.8)" }} />
            </motion.span>
            <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/60" />
          </span>
        </div>
        <div className="relative">
          <div className="h-px w-full bg-white/[0.15]" />
          <span className="absolute -top-1 left-0 size-2 rounded-full border border-white/[0.18] bg-canvas" />
          <span className="absolute right-0 -top-[3px] size-2.5 rounded-full border border-gold/70 bg-canvas" style={{ boxShadow: "0 0 10px -2px rgba(216,178,122,0.6)" }} />
          <motion.span
            className="absolute -top-[3px] left-0 size-2.5 rounded-full bg-gold"
            style={{ boxShadow: "0 0 12px rgba(216,178,122,0.7)" }}
            initial={false}
            animate={
              reduce
                ? { left: "60%", opacity: 1 }
                : { left: ["0%", "14%", "16%", "44%", "46%", "74%", "76%"], opacity: [1, 1, 1, 1, 1, 1, 0] }
            }
            transition={reduce ? undefined : { duration: CYCLE, times: [0, 0.14, 0.34, 0.5, 0.7, 0.92, 1], ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    </SceneFrame>
  );
}

/** Repetitive work no one should own — identical cards file past a fixed beam
 *  of light, each one stamped exactly the same, endlessly. */
function RepetitiveRows({ reduce }: { reduce: boolean }) {
  const card = (key: string) => (
    <div
      key={key}
      className="mr-3 flex w-24 shrink-0 flex-col gap-2 rounded-lg border border-white/10 bg-linear-to-b from-white/[0.09] to-white/[0.02] p-3"
    >
      <Copy className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden />
      <span className="h-1.5 w-full rounded-full bg-white/25" />
      <span className="h-1.5 w-2/3 rounded-full bg-white/[0.15]" />
    </div>
  );
  const mask = "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";
  const set = [0, 1, 2, 3, 4];
  return (
    <SceneFrame>
      <div className="relative">
        <div className="overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <motion.div
            className="flex"
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={reduce ? undefined : { duration: 9, ease: "linear", repeat: Infinity }}
          >
            {set.map((i) => card("a" + i))}
            {set.map((i) => card("b" + i))}
          </motion.div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-16 -translate-x-1/2">
          <motion.div
            className="h-full w-full"
            style={{ background: "linear-gradient(to right, transparent, rgba(216,178,122,0.16), transparent)" }}
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={reduce ? undefined : { duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold/40" />
        </div>
      </div>
    </SceneFrame>
  );
}
