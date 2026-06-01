"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, MessageCircle, RotateCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const suggestions = t.raw("suggestions") as string[];
  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, streaming, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;
    setErrorMsg(null);
    setInput("");

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        setMessages((m) => m.slice(0, -1));
        setErrorMsg(res.status === 503 ? t("offline") : t("error"));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        setMessages((m) => m.slice(0, -1));
        setErrorMsg(t("error"));
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        // User closed/aborted — drop a trailing empty bubble silently.
        setMessages((m) =>
          m.at(-1)?.role === "assistant" && !m.at(-1)?.content ? m.slice(0, -1) : m,
        );
        return;
      }
      setMessages((m) => m.slice(0, -1));
      setErrorMsg(t("error"));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setErrorMsg(null);
    setInput("");
    inputRef.current?.focus();
  }

  const awaitingFirstToken = streaming && messages.at(-1)?.role === "assistant" && !messages.at(-1)?.content;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("launcher")}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-5 right-5 z-[70] inline-flex h-14 items-center gap-2.5 rounded-full border border-gold/30 bg-surface px-5 text-sm font-medium text-ink shadow-2xl shadow-black/50 transition-all duration-300 hover:border-gold/60 hover:bg-surface-2",
          open && "w-14 justify-center px-0",
        )}
      >
        {open ? (
          <X className="size-5 text-gold" />
        ) : (
          <>
            <MessageCircle className="size-5 text-gold" />
            <span className="hidden sm:inline">{t("launcher")}</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("title")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-[70] flex h-[min(70vh,600px)] w-[min(calc(100vw-2.5rem),392px)] flex-col overflow-hidden rounded-3xl border border-line bg-canvas/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/50" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-gold" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight text-ink">{t("title")}</p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
              {hasConversation ? (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t("reset")}
                  className="inline-flex size-8 items-center justify-center rounded-full text-faint transition-colors hover:bg-white/5 hover:text-ink"
                >
                  <RotateCcw className="size-4" />
                </button>
              ) : null}
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <Bubble role="assistant">{t("greeting")}</Bubble>

              {messages.map((m, i) =>
                m.role === "assistant" && !m.content && i === messages.length - 1 ? null : (
                  <Bubble key={i} role={m.role}>
                    {m.content}
                  </Bubble>
                ),
              )}

              {awaitingFirstToken ? <TypingDots /> : null}

              {!hasConversation ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-gold/40 hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              {errorMsg ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {errorMsg}
                </p>
              ) : null}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface-2 px-3 py-2 focus-within:border-gold/50">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder={t("placeholder")}
                  className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-faint"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label={t("send")}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-canvas transition-opacity hover:bg-gold-soft disabled:opacity-40"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="px-1 pt-2 text-[0.65rem] leading-snug text-faint">{t("disclaimer")}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-gold/15 text-ink"
            : "rounded-bl-sm border border-line bg-surface text-muted",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-faint"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
