import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small uppercase mono label with a gold tick — used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-gold",
        className,
      )}
    >
      <span aria-hidden className="h-px w-7 bg-linear-to-r from-gold/0 to-gold/70" />
      {children}
    </span>
  );
}
