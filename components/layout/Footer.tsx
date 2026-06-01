import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Brand } from "./Brand";

const NAV = ["approach", "services", "work", "why", "contact"] as const;

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 max-w-xs text-pretty text-xs leading-relaxed text-faint">
              {t("footer.madeWith")}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
              {t("footer.explore")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((id) => (
                <li key={id}>
                  <a
                    href={`/${locale}#${id}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {t(`nav.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/work/fernando-piero"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {t("caseStudy.client")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${t("contact.info.email")}`}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {t("contact.info.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-fade" />

        <div className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <p className="text-xs text-faint">
            © {year} {t("siteName")}. {t("footer.rights")}
          </p>
          <a href="#top" className="text-xs text-faint transition-colors hover:text-ink">
            {t("footer.backToTop")} ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
