// Règles d'indexation et en-têtes HTTP, en fonctions pures de l'URL du site :
// app/robots.ts et next.config.ts les appliquent, tests/indexation.test.ts les vérifie.
import type { MetadataRoute } from "next";
import { estIndexable } from "./site.ts";

export interface EnTete {
  key: string;
  value: string;
}

/**
 * Production : tout est autorisé et le sitemap est annoncé.
 * Ailleurs : `Disallow: /`, en plus du noindex porté par l'en-tête et la balise meta.
 */
export function reglesRobots(urlSite: string): MetadataRoute.Robots {
  if (!estIndexable(urlSite)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${urlSite}/sitemap.xml`,
  };
}

/** En-têtes appliqués à toutes les réponses. */
export function enTetesHttp(urlSite: string): EnTete[] {
  const securite: EnTete[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
  ];
  if (estIndexable(urlSite)) return securite;
  return [...securite, { key: "X-Robots-Tag", value: "noindex, nofollow" }];
}
