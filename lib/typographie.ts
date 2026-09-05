/**
 * Microtypographie française, appliquée au rendu.
 *
 * Les fichiers de messages et de contenu ne sont jamais modifiés : cette
 * fonction compose le texte français au moment où il est chargé
 * (i18n/request.ts pour l'interface, lib/contenu.ts pour les données,
 * lib/remark-typographie.ts pour le MDX).
 *
 * Règles :
 * - espace fine insécable (U+202F) avant ; : ! ? et à l'intérieur des guillemets
 * - guillemets français « … » à la place des guillemets droits
 * - apostrophe typographique (U+2019)
 * - insécable (U+00A0) entre un nombre et son unité, dans « OFM 2027 », dans les dates
 * - trait d'union insécable (U+2011) entre deux nombres (« 27‑28 mars »)
 *
 * Exclusions, jamais touchées :
 * - le contenu mathématique et ses délimiteurs KaTeX : $…$, $$…$$, \(…\), \[…\]
 * - le code entre accents graves
 * - les adresses (jetons contenant @ ou ://)
 * - les heures (« 09:00 ») : le deux-points entre chiffres reste collé
 */

const FINE = " ";
const INSECABLE = " ";
const TRAIT_INSECABLE = "‑";
const APOSTROPHE = "’";

/** Segments protégés : maths, code, adresses. L'ordre compte ($$ avant $). */
const PROTEGE =
  /\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|`[^`\n]*`|\S*(?:@|:\/\/)\S*/g;

const MOIS =
  "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre";
const UNITES =
  "h|min|s|%|pays|élèves?|participants?|éditions?|problèmes?|catégories?|jours?|heures?|minutes?|secondes?|points?|ans?|km|m|délégations?|nations?|compétiteurs?|questions?|médailles?";

function composerSegment(texte: string, apresProtege: boolean): string {
  let t = texte;

  // Ponctuation qui suit immédiatement un segment protégé (« $x$ ; donc »).
  if (apresProtege) {
    t = t.replace(/^[   ]*([;!?])/, `${FINE}$1`);
    t = t.replace(/^[   ]*:(?=\s|$)/, `${FINE}:`);
  }

  // Apostrophe typographique entre deux lettres (L'Olympiade, qu'en, d'un).
  t = t.replace(/(\p{L})'(?=\p{L})/gu, `$1${APOSTROPHE}`);

  // Guillemets français, avec fine insécable intérieure.
  t = t.replace(/"([^"\n]+?)"/g, `«${FINE}$1${FINE}»`);
  t = t.replace(/«[   ]*/g, `«${FINE}`);
  t = t.replace(/[   ]*»/g, `${FINE}»`);

  // Fine insécable avant ; ! ? — insérée même si l'espace manquait.
  t = t.replace(/(\S)[   ]*([;!?])/g, `$1${FINE}$2`);
  // Fine insécable avant « : » quand il ne s'agit pas d'une heure (12:30).
  t = t.replace(/([^\d\s])[   ]*:(?=\s|$)/gu, `$1${FINE}:`);
  // Une ponctuation qui en suit une autre (« ?! ») ne reçoit pas de seconde fine.
  t = t.replace(new RegExp(`([;!?:])${FINE}([;!?])`, "g"), "$1$2");

  // Trait d'union insécable entre deux nombres : 27‑28 mars.
  t = t.replace(/(\d)-(?=\d)/g, `$1${TRAIT_INSECABLE}`);

  // Mot + nombre : « OFM 2027 », « édition 2027 », « en 2020 », « nº 3 ».
  t = t.replace(/(\p{L}{2,}|n[º°])[  ](?=\d)/gu, `$1${INSECABLE}`);
  // Nombre (ou variable ICU) + mois ou unité : « 27 mars », « 14 pays », « {count} élèves ».
  t = t.replace(
    new RegExp(`(\\d|\\})[ \\u00A0](?=(?:${MOIS}|${UNITES})\\b)`, "gu"),
    `$1${INSECABLE}`
  );
  // Mois + année : « mars 2027 ».
  t = t.replace(new RegExp(`\\b(${MOIS})[ \\u00A0](?=\\d{4}\\b)`, "gu"), `$1${INSECABLE}`);

  return t;
}

/** Compose un texte français. Les segments protégés sont restitués tels quels. */
export function composerFrancais(texte: string): string {
  if (!texte) return texte;
  let resultat = "";
  let curseur = 0;
  let apresProtege = false;
  for (const match of texte.matchAll(PROTEGE)) {
    const debut = match.index ?? 0;
    resultat += composerSegment(texte.slice(curseur, debut), apresProtege) + match[0];
    curseur = debut + match[0].length;
    apresProtege = true;
  }
  resultat += composerSegment(texte.slice(curseur), apresProtege);
  return resultat;
}

/**
 * Évite la veuve d'un titre : insécable avant le dernier mot, dès trois mots.
 * Valable dans les deux langues.
 */
export function sansVeuve(titre: string): string {
  const mots = titre.trim().split(/[  ]/);
  if (mots.length < 3) return titre;
  const dernier = mots.pop() as string;
  // Un bloc final trop long (« de Mathématiques ») déborderait sur mobile :
  // on laisse alors faire `text-wrap: balance`.
  const avantDernier = mots[mots.length - 1];
  if (avantDernier.length + dernier.length > 13) return titre;
  return `${mots.join(" ")}${INSECABLE}${dernier}`;
}

/**
 * Compose en profondeur les chaînes d'un objet de contenu : seules les valeurs
 * portées par une clé `fr` sont touchées, tout le reste (anglais, chemins,
 * identifiants, nombres) est rendu tel quel.
 */
export function composerContenu<T>(donnees: T): T {
  return parcourir(donnees, false) as T;
}

/** Compose toutes les chaînes d'un objet (messages d'interface français). */
export function composerMessages<T>(messages: T): T {
  return parcourir(messages, true) as T;
}

function parcourir(valeur: unknown, composer: boolean): unknown {
  if (typeof valeur === "string") return composer ? composerFrancais(valeur) : valeur;
  if (Array.isArray(valeur)) return valeur.map((item) => parcourir(item, composer));
  if (valeur && typeof valeur === "object") {
    const sortie: Record<string, unknown> = {};
    for (const [cle, contenu] of Object.entries(valeur as Record<string, unknown>)) {
      sortie[cle] = parcourir(contenu, composer || cle === "fr");
    }
    return sortie;
  }
  return valeur;
}
