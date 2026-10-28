// Classements de /resultats : filtres et pagination, sans état ni DOM (testés
// dans tests/resultats.test.ts). Rangs et distinctions viennent des données
// telles quelles : rien n'est recalculé ici.
import type { LigneResultat } from "@/content/types";

/** Lignes par page du tableau. */
export const LIGNES_PAR_PAGE = 10;

/** Minuscules sans accents : « Élodie » se trouve en tapant « elodie ». */
export function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export interface Filtres {
  /** Fragment du nom du participant ; vide : pas de filtre. */
  recherche: string;
  /** Code ISO du pays ; vide : tous les pays. */
  pays: string;
}

export function filtrerResultats(lignes: readonly LigneResultat[], { recherche, pays }: Filtres): LigneResultat[] {
  const cherche = normaliser(recherche);
  return lignes.filter(
    (ligne) => (!pays || ligne.countryCode === pays) && (!cherche || normaliser(ligne.name).includes(cherche))
  );
}

export interface PageResultats {
  lignes: LigneResultat[];
  /** Page affichée, ramenée dans [1, pages]. */
  page: number;
  /** Nombre de pages, au moins 1 (une page vide quand rien ne correspond). */
  pages: number;
}

export function paginer(lignes: readonly LigneResultat[], page: number, parPage = LIGNES_PAR_PAGE): PageResultats {
  const pages = Math.max(1, Math.ceil(lignes.length / parPage));
  const courante = Math.min(Math.max(1, page), pages);
  return { lignes: lignes.slice((courante - 1) * parPage, courante * parPage), page: courante, pages };
}

/** Pays présents dans les classements, chacun une fois, dans l'ordre d'apparition. */
export function paysPresents(...classements: readonly (readonly LigneResultat[])[]): string[] {
  return [...new Set(classements.flat().map((ligne) => ligne.countryCode))];
}
