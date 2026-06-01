import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <Section id="faq">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mx-auto mt-14 max-w-3xl">
          <Reveal>
            <div className="border-t border-line">
              {items.map((item) => (
                <details key={item.q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="text-pretty font-medium">{item.q}</span>
                    <ChevronDown className="size-4 shrink-0 text-faint transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 pr-8 text-pretty leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
