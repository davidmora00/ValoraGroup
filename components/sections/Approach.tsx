import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Approach() {
  const t = useTranslations("approach");
  const steps = t.raw("steps") as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  return (
    <Section id="approach">
      <Container>
        <SectionHeading
          index="02"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
          align="center"
        />

        <div className="relative mt-16">
          {/* Faint connecting line threading the sequence on large screens. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-linear-to-r from-line/0 via-gold/30 to-line/0 lg:block"
          />

          <ol className="grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 0.08}>
                <div className="border-t border-line pt-6">
                  <span className="font-display text-3xl leading-none tracking-tight text-gold sm:text-4xl">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
