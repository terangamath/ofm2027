import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getDelegations, getProblems } from "@/lib/content";
import { languesAlternatives, urlAbsolue } from "@/lib/seo";

const STATIC_ROUTES = [
  "/",
  "/olympiade",
  "/organisation",
  "/equipes",
  "/programme",
  "/problemes",
  "/historique",
  "/contact",
  "/mentions-legales",
];

/**
 * Chaque route, dans chaque langue, avec ses alternates fr / en / x-default.
 * Pas de `lastModified` : ni les fichiers de contenu (dates de clonage sur Vercel)
 * ni l'historique Git (clone superficiel) n'en donnent une fiable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...getDelegations().map((delegation) => `/equipes/${delegation.slug}`),
    ...getProblems("fr").map((problem) => `/problemes/${problem.slug}`),
  ];

  return routes.flatMap((route) => {
    const languages = languesAlternatives(route);
    return routing.locales.map((locale) => ({ url: urlAbsolue(locale, route), alternates: { languages } }));
  });
}
