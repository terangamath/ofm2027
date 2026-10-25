import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about";
import { PaysParticipantsSection } from "@/components/home/pays-participants";
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
 * Accueil : le premier écran photographique (dates et compte à rebours), la
 * présentation de l'OFM, puis les sections de contenu, en alternant sable et ivoire.
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
      <AboutSection locale={typedLocale} />
      <PaysParticipantsSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
      <PartnersSection locale={typedLocale} />
    </>
  );
}
