import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  index,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  index?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow className={centered ? "justify-center" : undefined}>
            {index ? (
              <>
                {index} · {eyebrow}
              </>
            ) : (
              eyebrow
            )}
          </Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-balance font-display text-3xl leading-[1.06] tracking-tight text-ink sm:text-4xl md:text-5xl">
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
