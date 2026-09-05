import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { EventInfoSection } from "@/components/home/event-info";
import { StatsSection } from "@/components/home/stats";
import { CategoriesSection } from "@/components/home/categories";
import { DelegationsSection } from "@/components/home/delegations";
import { ProblemsTeaserSection } from "@/components/home/problems-teaser";
import { SimultaneiteSection } from "@/components/home/simultaneite";
import { PartnersSection } from "@/components/home/partners";
import { FaqSection } from "@/components/home/faq";
import { EventJsonLd } from "@/components/shared/event-jsonld";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  return (
    <>
      <EventJsonLd event={eventInfo} locale={typedLocale} />
      <Hero locale={typedLocale} />
      <SimultaneiteSection locale={typedLocale} />
      <EventInfoSection locale={typedLocale} />
      <StatsSection locale={typedLocale} />
      <CategoriesSection locale={typedLocale} />
      <DelegationsSection locale={typedLocale} />
      <ProblemsTeaserSection locale={typedLocale} />
      <PartnersSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
    </>
  );
}
