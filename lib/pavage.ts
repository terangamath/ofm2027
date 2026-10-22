// Pavage de la variante C — le motif est de la géométrie, pas un ornement.
//
// Pavage triangulaire régulier {3,6}, groupe de papier peint p6m. Il se
// construit à la règle et au compas comme la figure du hero : deux cercles de
// même rayon centrés aux extrémités d'un segment se coupent au troisième
// sommet du triangle équilatéral (Euclide, Éléments, I, 1) ; on répète.
// Sur la figure, un nœud est posé en O, centre du cercle circonscrit, et le
// côté vaut R/10 : ω passe à dix côtés de son centre.
//
// La bande tissée en est une rangée double : on y remplit les losanges formés
// par deux triangles adjacents, alternativement de deux couleurs — une frise
// de groupe p2mm (miroirs vertical et horizontal), la structure des bandes de
// losanges des pagnes tissés en bandes d'Afrique de l'Ouest.

import { OMEGA_R, P } from "./figure-geometrie.ts";

/** Côté du triangle sur la figure (repère 600 × 600). */
export const COTE_FIGURE = OMEGA_R / 10;
/** Centre de la trame sur la figure : le centre O du cercle circonscrit. */
export const ORIGINE_FIGURE = P.O;

/** Hauteur d'un rang de triangles : c·√3/2. */
export function hauteurRang(cote: number): number {
  return (cote * Math.sqrt(3)) / 2;
}

const n = (x: number) => Number(x.toFixed(3));

/**
 * Tuile de répétition du pavage, largeur c, hauteur 2h, nœuds aux coins et au
 * milieu (c/2, h) : deux horizontales et les deux diagonales à ±60°. Répétée,
 * elle redonne toutes les droites du pavage, sans doublon. `dx` la décale.
 */
function cheminTuile(cote: number, dx = 0): string {
  const h = hauteurRang(cote);
  const g = n(dx);
  const d = n(dx + cote);
  return `M${g} 0H${d}M${g} ${n(h)}H${d}M${g} 0L${d} ${n(2 * h)}M${d} 0L${g} ${n(2 * h)}`;
}

export function tuile(cote: number): { largeur: number; hauteur: number; chemin: string } {
  return { largeur: n(cote), hauteur: n(2 * hauteurRang(cote)), chemin: cheminTuile(cote) };
}

/** Losange vertical de deux triangles (pointe en haut, pointe en bas), centré en x = c. */
function losange(centre: number, cote: number): string {
  const h = hauteurRang(cote);
  return `M${n(centre)} 0L${n(centre + cote / 2)} ${n(h)}L${n(centre)} ${n(2 * h)}L${n(centre - cote / 2)} ${n(h)}Z`;
}

/**
 * Bande tissée : motif unitaire de largeur 2c sur deux rangs. Deux losanges
 * se touchent par la pointe (centres en c/2 et 3c/2) ; entre eux, les
 * sabliers du pavage restent vides. Dans la bande, le pavage est décalé de
 * c/2 (nœuds des rangs pairs en x = c/2 + k·c) pour que les losanges tombent
 * sur ses nœuds ; `trame` en redonne les droites, rognées à la largeur 2c,
 * pour que la bande se lise comme un morceau de la trame.
 */
export function bandeTissee(cote: number): {
  largeur: number;
  hauteur: number;
  losangeA: string;
  losangeB: string;
  trame: string;
} {
  return {
    largeur: n(2 * cote),
    hauteur: n(2 * hauteurRang(cote)),
    losangeA: losange(cote / 2, cote),
    losangeB: losange((3 * cote) / 2, cote),
    trame: cheminTuile(cote, -cote / 2) + cheminTuile(cote, cote / 2) + cheminTuile(cote, (3 * cote) / 2),
  };
}

/** SVG autonome (pour une image de masque CSS) : un seul tracé, sans couleur. */
export function svgMasque(largeur: number, hauteur: number, contenu: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}">${contenu}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
