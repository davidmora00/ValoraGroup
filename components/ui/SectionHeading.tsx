import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow className={centered ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={0.1}>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
