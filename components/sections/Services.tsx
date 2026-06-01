import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
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

        {/* Interactive cards: tilt toward the cursor, glow + reveal on hover. */}
        <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} as="div" delay={Math.min(i, 5) * 0.06} className="h-full">
              <TiltCard className="group surface-card relative h-full overflow-hidden rounded-2xl border border-line p-6 transition-colors duration-300 hover:border-gold/40">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(216,178,122,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="grid size-11 place-items-center rounded-xl bg-gold/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon name={item.icon} className="size-5 text-gold" />
                </span>
                <h3 className="mt-5 flex items-center gap-2 text-lg font-medium text-ink">
                  {item.title}
                  <span
                    aria-hidden
                    className="-translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{item.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
