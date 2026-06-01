import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AutomationChecklist } from "@/components/proof/AutomationChecklist";
import { CompetitorScan } from "@/components/proof/CompetitorScan";
import { AssistantDemo } from "@/components/proof/AssistantDemo";
import { ImpactDashboard } from "@/components/proof/ImpactDashboard";

/** "Proof in motion" — live demo tiles that DO what we sell, not describe it.
 *  Bento: automation · competitor intel · (assistant + hours-saved stacked). */
export function Proof() {
  const t = useTranslations("proof");
  const tasks = t.raw("automationTasks") as string[];
  const insights = t.raw("competitorInsights") as { tag: string; text: string }[];

  return (
    <Section id="proof">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
        <div className="mx-auto mt-16 grid max-w-5xl items-stretch gap-5 sm:mt-20 lg:grid-cols-3">
          <Reveal as="div" className="h-full">
            <AutomationChecklist caption={t("automationCaption")} tasks={tasks} />
          </Reveal>
          <Reveal as="div" delay={0.07} className="h-full">
            <CompetitorScan
              label={t("competitorLabel")}
              caption={t("competitorCaption")}
              insights={insights}
            />
          </Reveal>
          <div className="flex flex-col gap-5">
            <Reveal as="div">
              <AssistantDemo caption={t("assistantCaption")} />
            </Reveal>
            <Reveal as="div" delay={0.14}>
              <ImpactDashboard label={t("impactLabel")} caption={t("impactCaption")} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
