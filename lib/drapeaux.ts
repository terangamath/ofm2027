import fs from "node:fs";
import path from "node:path";

/**
 * Drapeaux aux proportions officielles : public/drapeaux/{code}.svg, fichiers
 * de Wikimedia Commons (drapeaux nationaux, domaine public). Distincts de
 * public/flags/ (flag-icons, tous redessinés en 4:3), gardés pour les petites
 * pastilles des listes.
 */
export const srcDrapeau = (countryCode: string) => `/drapeaux/${countryCode.toLowerCase()}.svg`;

/** Proportions (largeur / hauteur) du fichier : son viewBox, sinon ses width et height. */
function proportion(countryCode: string): number {
  const fichier = path.join(process.cwd(), "public", srcDrapeau(countryCode));
  const racine = /<svg\b[^>]*>/.exec(fs.readFileSync(fichier, "utf-8"))?.[0] ?? "";
  const viewBox = /viewBox="([^"]+)"/.exec(racine)?.[1].trim().split(/[\s,]+/).map(Number);
  if (viewBox?.length === 4) return viewBox[2] / viewBox[3];
  const largeur = Number(/\bwidth="([\d.]+)"/.exec(racine)?.[1]);
  const hauteur = Number(/\bheight="([\d.]+)"/.exec(racine)?.[1]);
  if (!largeur || !hauteur) throw new Error(`${fichier} : ni viewBox ni width/height`);
  return largeur / hauteur;
}

/**
 * Un drapeau dont le symbole touche la hampe est calé à gauche, pour que le
 * rognage ne tombe que du côté flottant.
 */
const CALAGE_HAMPE = new Set(["km"]);

/**
 * Tous les drapeaux remplissent le même rectangle (l'équivalent d'object-fit:
 * cover, centré) : la boîte de l'<image> prend les proportions du fichier et
 * déborde du rectangle, qui la rogne. On ne s'en remet pas à
 * preserveAspectRatio="slice" : un fichier pourvu de son propre viewBox y
 * garde son cadrage « meet » et laisse des marges vides.
 */
export function cadrageDrapeau(countryCode: string, largeur: number, hauteur: number) {
  const ratio = proportion(countryCode);
  const echelle = Math.max(largeur / ratio, hauteur) / hauteur;
  const width = hauteur * ratio * echelle;
  const height = hauteur * echelle;
  const x = CALAGE_HAMPE.has(countryCode.toLowerCase()) ? 0 : (largeur - width) / 2;
  return { x, y: (hauteur - height) / 2, width, height };
}
