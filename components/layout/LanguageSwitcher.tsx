"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line bg-white/[0.02] p-0.5",
        className,
      )}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            disabled={pending || active}
            aria-current={active ? "true" : undefined}
            onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition-colors",
              active ? "bg-gold/15 text-gold" : "text-faint hover:text-ink",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
