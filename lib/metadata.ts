import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ofm2027.org";
const OG_IMAGE = `${SITE_URL}/images/og/og-default.jpg`;

interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

/** Génère les métadonnées SEO pour une page */
export function generatePageMetadata({
  title,
  description,
  image,
  noIndex = false,
}: MetaOptions = {}): Metadata {
  const siteName = "OFM 2027 — Olympiade Francophone de Mathématiques";
  const defaultDesc =
    "Site officiel de l'Olympiade Francophone de Mathématiques 2027, organisée au Sénégal par l'association Terangamath.";

  const fullTitle = title ? `${title} | OFM 2027` : siteName;
  const metaDesc = description ?? defaultDesc;
  const ogImage = image ?? OG_IMAGE;

  return {
    title: fullTitle,
    description: metaDesc,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "fr_FR",
      type: "website",
      siteName: "OFM 2027",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDesc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: SITE_URL,
    },
  };
}
