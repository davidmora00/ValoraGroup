import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/lib/icons";

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  return (
    <Section id="services" className="border-t border-line/60">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="div" key={item.title} delay={Math.min(i, 5) * 0.05} className="h-full">
              <Card className="h-full">
                <span className="grid size-11 place-items-center rounded-xl bg-gold/10">
                  <Icon name={item.icon} className="size-5 text-gold" />
                </span>
                <h3 className="mt-5 font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
