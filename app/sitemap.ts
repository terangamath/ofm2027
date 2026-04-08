import type { MetadataRoute } from "next";
import { getAllActualites, getEquipes } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ofm2027.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = [
    "",
    "/olympiade",
    "/organisation",
    "/equipes",
    "/programme",
    "/informations",
    "/problemes",
    "/resultats",
    "/actualites",
    "/galerie",
    "/historique",
    "/contact",
  ];

  const staticUrls = baseRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr${route}`,
        en: `${SITE_URL}/en${route}`,
      },
    },
  }));

  // Articles
  const articles = getAllActualites().filter((a) => a.status === "published");
  const articleUrls = articles.map((a) => ({
    url: `${SITE_URL}/actualites/${a.slug}`,
    lastModified: new Date(a.date),
  }));

  // Équipes
  const equipes = getEquipes();
  const equipeUrls = equipes.map((e) => ({
    url: `${SITE_URL}/equipes/${e.id}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...articleUrls, ...equipeUrls];
}
