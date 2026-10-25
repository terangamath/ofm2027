/**
 * Drapeaux aux proportions officielles : public/drapeaux/{code}.svg, fichiers
 * de Wikimedia Commons (drapeaux nationaux, domaine public). Distincts de
 * public/flags/ (flag-icons, tous redessinés en 4:3), gardés pour les petites
 * pastilles des listes.
 */
export const srcDrapeau = (countryCode: string) => `/drapeaux/${countryCode.toLowerCase()}.svg`;

/**
 * Tous les drapeaux remplissent le même rectangle 3:2 (object-fit: cover,
 * centré). Exception : un drapeau dont le symbole touche la hampe est calé à
 * gauche, pour que le rognage ne tombe que du côté flottant.
 */
const CALAGE_HAMPE = new Set(["km"]);

export const calageDrapeau = (countryCode: string) =>
  CALAGE_HAMPE.has(countryCode.toLowerCase()) ? "object-left" : "object-center";
