import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { InfosBande } from "@/components/sections/InfosBande";
import { OFMEnBref } from "@/components/sections/OFMEnBref";
import { PaysParticipants } from "@/components/sections/PaysParticipants";
import { ActualitesSection } from "@/components/sections/ActualitesSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { PartenairesSection } from "@/components/sections/PartenairesSection";
import { CTASection } from "@/components/sections/CTASection";
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
      {/* 1. Hero 2 colonnes */}
      <HeroSection />

      {/* 2. Bande infos clés compacte */}
      <InfosBande />

      {/* 3. OFM en bref + catégories (split asymétrique) */}
      <OFMEnBref />

      {/* 4. Pays participants (mosaïque compacte) */}
      <PaysParticipants pays={equipes} />

      {/* 5. Actualités (layout éditorial) */}
      <ActualitesSection articles={articles} />

      {/* 6. FAQ (layout sidebar gauche) */}
      <FAQSection items={faq} limit={4} showLink />

      {/* 7. Partenaires (bande structurée) */}
      <PartenairesSection partenaires={partenaires} />

      {/* 8. CTA final */}
      <CTASection />
    </>
  );
}
