import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { buttonVariants } from "@/components/ui/Button";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudyPage.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: `/${locale}/work/fernando-piero`,
      languages: {
        en: "/en/work/fernando-piero",
        es: "/es/work/fernando-piero",
      },
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CaseStudyContent />;
}

function CaseStudyContent() {
  const t = useTranslations("caseStudyPage");
  const tc = useTranslations("caseStudy");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const challenge = t.raw("challengeBody") as string[];
  const solutions = t.raw("solutions") as Array<{ title: string; body: string }>;
  const stats = tc.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <article className="pb-12">
      {/* Hero */}
      <Section id="top" className="overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,178,122,0.12),transparent_70%)] blur-2xl" />
        </div>
        <Container>
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              {tCommon("backHome")}
            </Link>
          </Reveal>

          <div className="mt-10 max-w-3xl">
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-2xl text-ink sm:text-3xl">{t("client")}</span>
                <span className="font-mono text-xs uppercase tracking-wider text-faint">
                  {t("clientMeta")}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl">
                {t("title")}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{t("lead")}</p>
            </Reveal>
          </div>

          {/* Stats */}
          <Reveal delay={0.2}>
            <dl className="mt-14 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="px-2 py-6 text-center sm:px-6">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl text-gold sm:text-5xl">
                      {s.value}
                    </span>
                    <span className="mt-2 block text-sm text-faint">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* Challenge */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gold">
                {t("challengeHeading")}
              </h2>
            </Reveal>
            <div className="max-w-2xl space-y-5">
              {challenge.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="text-pretty text-lg leading-relaxed text-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Solutions */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gold">
                {t("solutionsHeading")}
              </h2>
            </Reveal>
            <ol className="max-w-2xl space-y-px overflow-hidden rounded-3xl border border-line">
              {solutions.map((s, i) => (
                <li key={i}>
                  <Reveal delay={i * 0.06}>
                    <div className="surface-card p-7 sm:p-8">
                      <div className="flex items-baseline gap-4">
                        <span className="font-display text-xl text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-xl text-ink">{s.title}</h3>
                      </div>
                      <p className="mt-3 text-pretty leading-relaxed text-muted">{s.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Result / approach note */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gold">
                {t("resultsHeading")}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-2xl border-l-2 border-gold pl-6 font-display text-xl italic leading-relaxed text-ink/90 sm:text-2xl">
                {t("approachNote")}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section className="pt-8 pb-4">
        <Container>
          <Reveal>
            <div className="surface-card relative overflow-hidden rounded-3xl border border-line p-10 text-center sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(216,178,122,0.14),transparent_70%)]"
              />
              <h2 className="mx-auto max-w-xl text-balance font-display text-3xl text-ink sm:text-4xl">
                {t("closingTitle")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">{t("closingBody")}</p>
              <a
                href={`/${locale}#contact`}
                className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-8`}
              >
                {t("cta")}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>
    </article>
  );
}
