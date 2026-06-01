import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/lib/icons";

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  return (
    <Section id="services">
      <Container>
        <SectionHeading index="03" eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        {/* De-carded: airy grid, the gold icon-chip is the only accent. */}
        <div className="mt-16 grid gap-x-10 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} as="div" delay={Math.min(i, 5) * 0.06}>
              <span className="grid size-11 place-items-center rounded-xl bg-gold/10">
                <Icon name={item.icon} className="size-5 text-gold" />
              </span>
              <h3 className="mt-5 text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
