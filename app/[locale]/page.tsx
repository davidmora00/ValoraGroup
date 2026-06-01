import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { WhyValora } from "@/components/sections/WhyValora";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <PainPoints />
      <Approach />
      <Services />
      <CaseStudy />
      <WhyValora />
      <FAQ />
      <Contact />
    </>
  );
}
