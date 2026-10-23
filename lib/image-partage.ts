// Chemin de l'image de partage Open Graph, partagé par les métadonnées (lib/seo.ts)
// et par le script qui la génère (scripts/images-marque.mjs).
//
// WhatsApp, Facebook et LinkedIn gardent une image de partage en cache plusieurs
// jours, par URL : à chaque refonte de l'image, incrémenter la version change le
// nom du fichier, donc l'URL, et force les plateformes à la recharger.
// v1 : fond vert-nuit ; v2 : traitement clair de la variante D.

export const VERSION_IMAGE_PARTAGE = 2;

/** Chemin public, sans origine : `/og/ofm2027-fr-v2.png`. */
export function cheminImagePartage(locale: "fr" | "en"): string {
  return `/og/ofm2027-${locale}-v${VERSION_IMAGE_PARTAGE}.png`;
}
