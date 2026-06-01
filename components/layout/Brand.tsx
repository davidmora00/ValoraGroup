import { cn } from "@/lib/utils";

/** The Valora wordmark + gem mark. */
export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="text-gold"
      >
        <path d="M12 1.6 22.4 12 12 22.4 1.6 12Z" fill="currentColor" opacity="0.18" />
        <path
          d="M12 1.6 22.4 12 12 22.4 1.6 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M6.4 12 12 6.4 17.6 12 12 17.6Z" fill="currentColor" />
      </svg>
      <span className="font-display text-xl leading-none tracking-tight text-ink">
        Valora<span className="text-gold">.</span>
      </span>
    </span>
  );
}
