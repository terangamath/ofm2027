import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { OFMEnBref } from "@/components/sections/OFMEnBref";
import { PaysParticipants } from "@/components/sections/PaysParticipants";
import { ActualitesSection } from "@/components/sections/ActualitesSection";
import { InfosCles } from "@/components/sections/InfosCles";
import { FAQSection } from "@/components/sections/FAQSection";
import { PartenairesSection } from "@/components/sections/PartenairesSection";
import { getEquipes, getActualites, getFAQ, getPartenaires } from "@/lib/content";

export const metadata: Metadata = {
  title: "OFM 2027 — Olympiade Francophone de Mathématiques | Sénégal",
  description:
    "Site officiel de l'Olympiade Francophone de Mathématiques 2027, organisée au Sénégal par l'association Terangamath. Équipes, problèmes, résultats.",
  openGraph: {
    title: "OFM 2027 — Olympiade Francophone de Mathématiques",
    description:
      "L'excellence mathématique francophone réunie au Sénégal en 2027. Organisée par Terangamath.",
    locale: "fr_FR",
    type: "website",
  },
};

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [equipes, articles, faq, partenaires] = await Promise.all([
    Promise.resolve(getEquipes()),
    Promise.resolve(getActualites()),
    Promise.resolve(getFAQ()),
    Promise.resolve(getPartenaires()),
  ]);

  return (
    <>
      <HeroSection />
      <OFMEnBref />
      <PaysParticipants pays={equipes} />
      <ActualitesSection articles={articles} />
      <InfosCles />
      <FAQSection items={faq} limit={4} showLink />
      <PartenairesSection partenaires={partenaires} />
    </>
  );
}
