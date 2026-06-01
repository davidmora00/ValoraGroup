import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProblemStage } from "@/components/problem/ProblemStage";

export function PainPoints() {
  const t = useTranslations("painPoints");
  const items = t.raw("items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  return (
    <Section id="problem">
      <Container>
        <SectionHeading index="01" eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        {/* Don't list the problems — play them. Tap a frustration, watch it happen. */}
        <Reveal as="div">
          <ProblemStage items={items} prompt={t("prompt")} tapHint={t("tapHint")} />
        </Reveal>
      </Container>
    </Section>
  );
}
