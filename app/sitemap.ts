import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getDelegations } from "@/lib/content";

const STATIC_ROUTES = [
  "",
  "/olympiade",
  "/organisation",
  "/equipes",
  "/programme",
  "/problemes",
  "/resultats",
  "/historique",
  "/galerie",
  "/contact",
  "/mentions-legales",
];

/** Le français est l'entrée canonique de chaque route ; l'anglais est son alternate. */
export default function sitemap(): MetadataRoute.Sitemap {
  const delegationRoutes = getDelegations().map((delegation) => `/equipes/${delegation.slug}`);
  const routes = [...STATIC_ROUTES, ...delegationRoutes];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        fr: `${SITE_URL}${route}`,
        en: `${SITE_URL}/en${route}`,
      },
    },
  }));
}
