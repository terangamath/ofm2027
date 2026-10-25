import fs from "node:fs";
import path from "node:path";

/**
 * Drapeaux aux proportions officielles : public/drapeaux/{code}.svg, fichiers
 * de Wikimedia Commons (drapeaux nationaux, domaine public). Distincts de
 * public/flags/ (flag-icons, tous redessinés en 4:3), gardés pour les petites
 * pastilles des listes.
 */
const DOSSIER = path.join(process.cwd(), "public", "drapeaux");

/** Rapport largeur / hauteur lu dans le fichier : attributs width/height, sinon viewBox. */
export function rapportDrapeau(countryCode: string): number {
  const svg = fs.readFileSync(path.join(DOSSIER, `${countryCode.toLowerCase()}.svg`), "utf-8");
  const racine = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const largeur = Number(racine.match(/\swidth="([\d.]+)"/)?.[1]);
  const hauteur = Number(racine.match(/\sheight="([\d.]+)"/)?.[1]);
  if (largeur > 0 && hauteur > 0) return largeur / hauteur;
  const boite = racine.match(/viewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
  if (boite && boite[2] > 0 && boite[3] > 0) return boite[2] / boite[3];
  throw new Error(`Proportions introuvables pour le drapeau ${countryCode}`);
}

export const srcDrapeau = (countryCode: string) => `/drapeaux/${countryCode.toLowerCase()}.svg`;

/**
 * Tous les drapeaux remplissent le même rectangle 3:2 (object-fit: cover,
 * centré). Exception : un drapeau dont le symbole touche la hampe est calé à
 * gauche, pour que le rognage ne tombe que du côté flottant.
 */
const CALAGE_HAMPE = new Set(["km"]);

export const calageDrapeau = (countryCode: string) =>
  CALAGE_HAMPE.has(countryCode.toLowerCase()) ? "object-left" : "object-center";
