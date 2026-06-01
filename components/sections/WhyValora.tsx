import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/lib/icons";

export function WhyValora() {
  const t = useTranslations("whyValora");
  const points = t.raw("points") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  return (
    <Section id="why">
      <Container>
        <SectionHeading index="05" eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="mt-16 grid gap-x-12 gap-y-12 sm:mt-20 sm:grid-cols-2">
          {points.map((point, i) => (
            <Reveal
              as="div"
              key={point.title}
              delay={Math.min(i, 6) * 0.06}
              className="flex items-start gap-5 border-t border-line-soft pt-6"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line">
                <Icon name={point.icon} className="size-5 text-gold" />
              </span>
              <div>
                <h3 className="font-medium text-ink">{point.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                  {point.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
