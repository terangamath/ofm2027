import type { MetadataRoute } from "next";
import { lireJetons } from "@/lib/jetons";

export default function manifest(): MetadataRoute.Manifest {
  const couleurs = lireJetons();
  return {
    name: "OFM 2027 — Olympiade Francophone de Mathématiques",
    short_name: "OFM 2027",
    lang: "fr",
    start_url: "/",
    display: "browser",
    background_color: couleurs.ivoire,
    // Le site s'ouvre en clair : la barre du navigateur prend le fond de page.
    theme_color: couleurs.ivoire,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
