import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { SimultaneiteSection } from "@/components/home/simultaneite";
import { FriseTeranga } from "@/components/motifs/frise-teranga";
import { FicheSection } from "@/components/home/fiche";
import { CategoriesSection } from "@/components/home/categories";
import { DelegationsSection } from "@/components/home/delegations";
import { ProblemsTeaserSection } from "@/components/home/problems-teaser";
import { PartnersSection } from "@/components/home/partners";
import { FaqSection } from "@/components/home/faq";
import { EventJsonLd } from "@/components/shared/event-jsonld";
import { evenement as eventInfo } from "@/lib/contenu";
import type { Locale } from "@/content/types";
import { metadonneesPage } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadonneesPage({ locale, chemin: "/" });
}

/**
 * Accueil : un seul chapitre sombre (hero, puis la partition), puis du papier.
 * Six sections de hauteurs différentes, en alternant sable et ivoire.
 */
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
      <FriseTeranga />
      <SimultaneiteSection locale={typedLocale} />
      <FicheSection locale={typedLocale} />
      <CategoriesSection locale={typedLocale} />
      <DelegationsSection locale={typedLocale} />
      <ProblemsTeaserSection locale={typedLocale} />
      <PartnersSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
    </>
  );
}
