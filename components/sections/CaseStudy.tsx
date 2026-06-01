import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Stat } from "@/components/ui/Stat";
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
    <Section id="work">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1fr] lg:gap-20">
          {/* Sticky identity panel — stays pinned while the solutions scroll past. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>04 · {t("eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl text-ink sm:text-3xl">{t("client")}</h3>
                <span className="font-mono text-xs uppercase tracking-wider text-faint">
                  {t("clientMeta")}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
                {t("title")}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted">
                {t("lead")}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <Stat
                        value={s.value}
                        className="block font-display text-3xl text-gold sm:text-4xl"
                      />
                      <span className="mt-1 block text-xs leading-snug text-faint">{s.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.25}>
              <Link
                href="/work/fernando-piero"
                className={`${buttonVariants({ variant: "secondary", size: "lg" })} mt-10`}
              >
                {t("cta")}
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          {/* Scrolling solutions — problem → solution, revealing one by one. */}
          <ol>
            {solutions.map((item, i) => (
              <li
                key={item.title}
                className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:py-14"
              >
                <Reveal>
                  <span className="font-mono text-xs tracking-widest text-gold">{`0${i + 1}`}</span>
                  <h4 className="mt-4 font-display text-xl text-ink sm:text-2xl">{item.title}</h4>
                  <p className="mt-4 text-pretty leading-relaxed text-faint">{item.problem}</p>
                  <div className="mt-4 flex gap-3">
                    <span aria-hidden className="font-display text-lg leading-relaxed text-gold">
                      →
                    </span>
                    <p className="text-pretty leading-relaxed text-muted">{item.solution}</p>
                  </div>
                </Reveal>
              </li>
            ))}
            <li className="border-t border-line py-10 lg:py-14">
              <Reveal>
                <blockquote className="border-l-2 border-gold pl-6">
                  <p className="text-pretty font-display text-xl italic leading-relaxed text-ink/90">
                    {t("outcome")}
                  </p>
                </blockquote>
              </Reveal>
            </li>
          </ol>
        </div>
      </Container>
    </Section>
  );
}
