import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    // Transitions de navigation via l'API View Transitions (composant React
    // <ViewTransition>) ; dégradation propre là où l'API n'existe pas.
    viewTransition: true,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
