import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export function CaseStudy() {
  const t = useTranslations("caseStudy");
  const solutions = t.raw("solutions") as Array<{
    title: string;
    problem: string;
    solution: string;
  }>;
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <Section id="work" className="border-t border-line/60">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line surface-card p-8 shadow-2xl shadow-black/40 sm:p-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute right-[-10%] top-[-30%] h-[460px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(216,178,122,0.12),transparent_70%)] blur-2xl" />
            </div>

            {/* Header — client identity */}
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-2xl text-ink sm:text-3xl">{t("client")}</h3>
              <span className="font-mono text-xs uppercase tracking-wider text-faint">
                {t("clientMeta")}
              </span>
            </div>

            <Reveal delay={0.05}>
              <p className="mt-7 max-w-3xl text-balance font-display text-3xl leading-[1.1] tracking-tight text-ink sm:text-4xl">
                {t("title")}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                {t("lead")}
              </p>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.12}>
              <dl className="mt-12 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line-soft bg-white/[0.02]">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-4 py-6 text-center sm:px-6 sm:py-7">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl text-gold sm:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-faint">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="rule-fade mt-12" />

            {/* Solutions — problem → solution */}
            <ul className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-10">
              {solutions.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={Math.min(i, 6) * 0.06}
                  className="flex flex-col"
                >
                  <h4 className="font-display text-lg text-ink">{item.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-faint">{item.problem}</p>
                  <div className="mt-4 flex gap-3">
                    <span aria-hidden className="font-display text-base leading-relaxed text-gold">
                      &rarr;
                    </span>
                    <p className="text-pretty text-sm leading-relaxed text-muted">
                      {item.solution}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            {/* Outcome */}
            <Reveal delay={0.1}>
              <blockquote className="mt-12 border-l-2 border-gold pl-5">
                <p className="text-pretty font-display text-lg italic leading-relaxed text-ink/90">
                  {t("outcome")}
                </p>
              </blockquote>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.14}>
              <div className="mt-10">
                <Link
                  href="/work/fernando-piero"
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  {t("cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
