import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { EventInfoSection } from "@/components/home/event-info";
import { StatsSection } from "@/components/home/stats";
import { CategoriesSection } from "@/components/home/categories";
import { DelegationsSection } from "@/components/home/delegations";
import { ProblemsTeaserSection } from "@/components/home/problems-teaser";
import { CountdownSection } from "@/components/home/countdown";
import { PartnersSection } from "@/components/home/partners";
import { FaqSection } from "@/components/home/faq";
import type { Locale } from "@/content/types";

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
      <Hero locale={typedLocale} />
      <EventInfoSection locale={typedLocale} />
      <StatsSection locale={typedLocale} />
      <CategoriesSection locale={typedLocale} />
      <DelegationsSection locale={typedLocale} />
      <ProblemsTeaserSection locale={typedLocale} />
      <CountdownSection locale={typedLocale} />
      <PartnersSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
    </>
  );
}
