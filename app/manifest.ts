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
    theme_color: couleurs["vert-nuit"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
