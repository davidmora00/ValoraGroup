import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { getPrivacy } from "@/lib/legal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = getPrivacy(locale);
  return {
    title: doc.title,
    description: doc.intro.slice(0, 155),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: "/en/privacy", es: "/es/privacy" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const doc = getPrivacy(locale);

  return (
    <Section className="pt-32 pb-16 sm:pt-40">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              {tCommon("backHome")}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-8 font-display text-4xl tracking-tight text-ink sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-faint">
              {doc.updated}
            </p>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{doc.intro}</p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {doc.sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i, 6) * 0.03}>
                <section>
                  <h2 className="font-display text-xl text-ink">{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((p, j) => (
                      <p key={j} className="text-pretty leading-relaxed text-muted">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
