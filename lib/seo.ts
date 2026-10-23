import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { INDEXABLE, SITE_URL } from "@/lib/site";
import { cheminImagePartage } from "@/lib/image-partage";
import type { Locale } from "@/content/types";

/**
 * URL absolue d'une route dans une locale. Le français, langue par défaut, est
 * servi sans préfixe (`localePrefix: "as-needed"`) : `/equipes`, `/en/equipes`.
 * `/fr/equipes` redirige vers `/equipes` (proxy next-intl) et n'est jamais annoncé.
 * L'accueil n'a pas de barre oblique finale, comme Next.js l'écrit dans le <head>.
 */
export function urlAbsolue(locale: Locale, chemin: string): string {
  const prefixe = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefixe}${chemin === "/" ? "" : chemin}`;
}

/** hreflang d'une route : fr, en, et x-default vers le français. */
export function languesAlternatives(chemin: string): Record<Locale | "x-default", string> {
  const fr = urlAbsolue("fr", chemin);
  return { fr, en: urlAbsolue("en", chemin), "x-default": fr };
}

/** Canonique vers la version linguistique de la page, plus ses hreflang. */
export function alternatesPage(locale: Locale, chemin: string): Metadata["alternates"] {
  return { canonical: urlAbsolue(locale, chemin), languages: languesAlternatives(chemin) };
}

/**
 * Image de partage, 1200 × 630, une par langue (générée par scripts/images-marque.mjs).
 * URL absolue ; nom de fichier versionné (lib/image-partage.ts).
 */
export function urlImagePartage(locale: Locale): string {
  return `${SITE_URL}${cheminImagePartage(locale)}`;
}

export function imagePartage(locale: Locale, alt: string) {
  return { url: urlImagePartage(locale), width: 1200, height: 630, alt, type: "image/png" };
}

/** Balise robots : absente en production, noindex/nofollow partout ailleurs. */
export const robotsSite: Metadata["robots"] = INDEXABLE ? undefined : { index: false, follow: false };

interface OptionsPage {
  locale: string;
  /** Route sans préfixe de locale : `/`, `/equipes`, `/equipes/senegal`. */
  chemin: string;
  /** Titre de la page ; absent pour l'accueil, qui porte le titre du site. */
  titre?: string;
  description?: string;
}

/**
 * Métadonnées d'une page : titre, description, canonique, hreflang et Open Graph
 * complet. Chaque page passe par ici : un `openGraph` de page remplace celui du
 * layout en entier, il doit donc être redonné intégralement.
 */
export async function metadonneesPage({ locale, chemin, titre, description }: OptionsPage): Promise<Metadata> {
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const titreSite = t("title");
  const titrePartage = titre ? `${titre} — OFM 2027` : titreSite;
  const descriptionPartage = description ?? t("description");
  const image = imagePartage(typedLocale, t("ogAlt"));

  return {
    ...(titre ? { title: titre } : {}),
    ...(description ? { description } : {}),
    alternates: alternatesPage(typedLocale, chemin),
    openGraph: {
      type: "website",
      siteName: "OFM 2027",
      url: urlAbsolue(typedLocale, chemin),
      title: titrePartage,
      description: descriptionPartage,
      locale: typedLocale === "en" ? "en_GB" : "fr_FR",
      alternateLocale: typedLocale === "en" ? "fr_FR" : "en_GB",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: titrePartage,
      description: descriptionPartage,
      images: [image],
    },
  };
}
