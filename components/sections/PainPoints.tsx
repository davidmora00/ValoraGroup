import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/lib/icons";

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

        {/* Airy, borderless grid — the icon is the only accent, lots of breathing room. */}
        <div className="mt-16 grid gap-x-10 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} as="div" delay={Math.min(i, 5) * 0.06}>
              <Icon name={item.icon} className="size-6 text-gold" />
              <h3 className="mt-5 text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
