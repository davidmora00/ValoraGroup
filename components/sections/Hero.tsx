import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Globe as GlobeIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { buttonVariants } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Globe } from "./Globe";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Backdrop: ambient glow + interactive globe bleeding off the right */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-[-12%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,178,122,0.12),transparent_70%)] blur-2xl" />
        <div className="absolute inset-y-0 right-[-25%] w-[150%] sm:right-0 sm:w-[78%] sm:translate-x-[14%] lg:right-[-4%] lg:w-[62%]">
          <Globe />
        </div>
        {/* Mobile scrim — keeps text legible over the backdrop globe */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.92),rgba(10,10,11,0.72)_55%,rgba(10,10,11,0.5))] sm:hidden" />
        {/* Desktop scrim — left → right */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#0a0a0b_0%,#0a0a0b_26%,rgba(10,10,11,0.65)_48%,rgba(10,10,11,0)_72%)] sm:block" />
        {/* Fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,#0a0a0b,transparent)]" />
      </div>

      <Container>
        <div className="flex min-h-[88vh] max-w-xl flex-col justify-center py-32 sm:min-h-[92vh]">
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <AnimatedHeading
            lead={t("titleA")}
            accent={t("titleB")}
            className="mt-6 text-balance font-display text-[2.7rem] leading-[1.03] tracking-[-0.02em] sm:text-5xl md:text-6xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted">
              {t("lead")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic className="w-fit">
                <a
                  href={`/${locale}#contact`}
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  {t("primaryCta")}
                  <ArrowRight className="size-4" />
                </a>
              </Magnetic>
              <Magnetic className="w-fit">
                <a
                  href={`/${locale}#work`}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  {t("secondaryCta")}
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 flex items-center gap-2.5 text-sm text-faint">
              <GlobeIcon className="size-4 text-gold" strokeWidth={1.5} />
              {t("reach")}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
