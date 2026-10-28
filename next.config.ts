import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// Importer lib/site valide NEXT_PUBLIC_SITE_URL dès le chargement de la
// configuration : une variable absente ou malformée arrête le build ici.
import { ENVIRONNEMENT_VERCEL, SITE_URL } from "./lib/site.ts";
import { enTetesHttp } from "./lib/indexation.ts";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Transitions de navigation via l'API View Transitions (composant React
    // <ViewTransition>) ; dégradation propre là où l'API n'existe pas.
    viewTransition: true,
  },
  // Problèmes et solutions partagent désormais une page : l'ancienne adresse
  // des solutions y mène, dans chaque langue.
  async redirects() {
    return [
      { source: "/solutions", destination: "/problemes", permanent: true },
      { source: "/fr/solutions", destination: "/problemes", permanent: true },
      { source: "/en/solutions", destination: "/en/problemes", permanent: true },
    ];
  },
  // Sécurité sur toutes les réponses ; X-Robots-Tag noindex hors production.
  async headers() {
    return [{ source: "/:path*", headers: enTetesHttp(SITE_URL, ENVIRONNEMENT_VERCEL) }];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
