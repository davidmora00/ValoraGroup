"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Brand } from "./Brand";
import { cn } from "@/lib/utils";

const NAV = ["approach", "services", "work", "why", "contact"] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Full-path anchors so the links work from any page (and smooth-scroll on home).
  const href = (id: string) => `/${locale}#${id}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line/80 bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-18">
          <Link href="/" aria-label="Valora Group" onClick={() => setOpen(false)}>
            <Brand />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((id) => (
              <a
                key={id}
                href={href(id)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {t(id)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <a href={href("contact")} className={buttonVariants({ variant: "primary", size: "sm" })}>
              {t("cta")}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? tc("closeMenu") : tc("openMenu")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold/40 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-line/60 bg-canvas/95 backdrop-blur-xl lg:hidden">
          <Container>
            <div className="flex flex-col gap-1 pb-6 pt-3">
              {NAV.map((id) => (
                <a
                  key={id}
                  href={href(id)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base text-ink/90 transition-colors hover:bg-white/5"
                >
                  {t(id)}
                </a>
              ))}
              <div className="mt-3 flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <a
                  href={href("contact")}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "primary", size: "sm" })}
                >
                  {t("cta")}
                </a>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
