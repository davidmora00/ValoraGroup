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
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
          align="left"
        />

        <Reveal delay={0.1} className="relative mt-14">
          {/* Faint ambient warmth behind the inventory */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-10 -z-10 h-64 bg-[radial-gradient(circle_at_30%_0%,rgba(216,178,122,0.07),transparent_70%)] blur-2xl"
          />

          {/* Connected, flat grid — each cell separated by hairline rules */}
          <div className="overflow-hidden rounded-3xl border border-line bg-line">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={Math.min(i, 6) * 0.06}
                  as="div"
                  className="group relative bg-canvas p-6 transition-colors duration-300 hover:bg-white/[0.02] sm:p-8"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-white/[0.02] transition-colors duration-300 group-hover:border-gold/40 group-hover:bg-gold/10">
                    <Icon name={item.icon} className="size-5 text-gold" />
                  </span>
                  <h3 className="mt-4 font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
