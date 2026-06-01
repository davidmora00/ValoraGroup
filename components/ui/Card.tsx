import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card rounded-2xl border border-line p-6 transition-colors duration-300 hover:border-white/15",
        className,
      )}
    >
      {children}
    </div>
  );
}
