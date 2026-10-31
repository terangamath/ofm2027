// URL du site : seule source de vérité pour toute URL absolue produite par le site
// (metadataBase, canoniques, hreflang, sitemap, robots, JSON-LD, en-têtes).
// Le reste du code importe d'ici, jamais `process.env` directement.
//
// Ce module est lu par next.config.ts : une variable absente ou malformée fait
// échouer le build avant toute génération de page. Pas de valeur de secours.

/** Adresse de production. Seul ce déploiement est indexable. */
export const URL_PRODUCTION = "https://www.ofm2027.org";

export interface EnvironnementSite {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
}

const HOTES_LOCAUX = new Set(["localhost", "127.0.0.1", "[::1]"]);

function echec(detail: string): never {
  throw new Error(
    `NEXT_PUBLIC_SITE_URL : ${detail}\n` +
      `  Production : NEXT_PUBLIC_SITE_URL=${URL_PRODUCTION}\n` +
      "  Développement : copier .env.example en .env.local (NEXT_PUBLIC_SITE_URL=http://localhost:3000)\n" +
      "  Voir DEPLOIEMENT.md."
  );
}

/**
 * Lit, valide et normalise l'URL du site.
 * Ordre : NEXT_PUBLIC_SITE_URL, sinon `https://$VERCEL_URL` sur un déploiement de
 * prévisualisation Vercel (chaque branche reste cohérente avec elle-même), sinon échec.
 * Résultat : une origine sans barre oblique finale (`https://www.ofm2027.org`).
 */
export function resoudreUrlSite(env: EnvironnementSite): string {
  const declaree = env.NEXT_PUBLIC_SITE_URL?.trim();
  const brute =
    declaree ||
    (env.VERCEL_ENV === "preview" && env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "");

  if (!brute) echec("variable absente.");

  let url: URL;
  try {
    url = new URL(brute);
  } catch {
    echec(`« ${brute} » n'est pas une URL absolue.`);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    echec(`« ${brute} » : schéma ${url.protocol} non pris en charge.`);
  }
  if (url.protocol === "http:" && !HOTES_LOCAUX.has(url.hostname)) {
    echec(`« ${brute} » : https obligatoire hors développement local.`);
  }
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    echec(`« ${brute} » : attendu une origine seule, sans chemin, paramètre ni ancre.`);
  }

  // `URL.origin` normalise la casse et retire la barre oblique finale.
  return url.origin;
}

export const SITE_URL = resoudreUrlSite({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
});

/** Environnement Vercel (`production`, `preview`, `development`), absent hors Vercel. */
export const ENVIRONNEMENT_VERCEL = process.env.VERCEL_ENV;

/**
 * Seule la production est indexable : l'URL doit être celle de production et, sur
 * Vercel, le déploiement doit être celui de l'environnement Production. Une
 * prévisualisation qui recevrait par erreur l'URL de production reste non indexable.
 */
export function estIndexable(urlSite: string, environnementVercel?: string): boolean {
  if (environnementVercel && environnementVercel !== "production") return false;
  return urlSite === URL_PRODUCTION;
}

export const INDEXABLE = estIndexable(SITE_URL, ENVIRONNEMENT_VERCEL);

/**
 * Aperçus sur données fictives (classement d'exemple de /resultats). Jamais sur
 * le déploiement Production de Vercel ; ailleurs en développement, sur les
 * prévisualisations Vercel, ou sur demande (`OFM_APERCU=1`, build local).
 */
export const APERCUS_FICTIFS =
  process.env.VERCEL_ENV !== "production" &&
  (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview" || process.env.OFM_APERCU === "1");
