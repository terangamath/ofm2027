// Pavage de la variante D — le bandeau tissé est de la géométrie, pas une image.
//
// Pavage triangulaire régulier {3,6}, celui de la variante C : il se construit
// à la règle et au compas comme la figure du hero (Euclide, Éléments, I, 1 :
// deux cercles de même rayon centrés aux extrémités d'un segment se coupent au
// troisième sommet du triangle équilatéral).
//
// Le bandeau en est une colonne : deux triangles adjacents par leur base
// horizontale forment un losange vertical ; les losanges s'empilent pointe
// contre pointe, et les demi-triangles laissés sur les bords de la colonne
// forment les flancs en dents de scie. Chaque losange porte deux losanges
// emboîtés (homothéties de même centre). Une frise de groupe p2mm — miroir le
// long de l'axe, miroir à travers chaque losange —, la structure des bandes de
// losanges des pagnes tissés d'Afrique de l'Ouest. Liserés de part et d'autre.

/** Hauteur d'un rang de triangles : c·√3/2. */
export function hauteurRang(cote: number): number {
  return (cote * Math.sqrt(3)) / 2;
}

const n = (x: number) => Number(x.toFixed(2));

type Pt = [u: number, v: number];

/** Polygone fermé ; `horizontal` échange les axes (bande couchée). */
function polygone(points: Pt[], horizontal: boolean): string {
  const xy = points.map(([u, v]) => (horizontal ? [v, u] : [u, v]));
  return `M${xy.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`;
}

/** Losange vertical de centre (u, v), demi-largeur c/2·k, demi-hauteur h·k. */
function losange(u: number, v: number, cote: number, k: number): Pt[] {
  const dx = (cote / 2) * k;
  const dy = hauteurRang(cote) * k;
  return [
    [u, v - dy],
    [u + dx, v],
    [u, v + dy],
    [u - dx, v],
  ];
}

/** Rectangle [u0, u1] × [0, longueur]. */
function bande(u0: number, u1: number, longueur: number): Pt[] {
  return [
    [u0, 0],
    [u1, 0],
    [u1, longueur],
    [u0, longueur],
  ];
}

/** Rapports des losanges emboîtés : jaune dans le vert, rouge au cœur. */
export const EMBOITEMENT = { jaune: 0.56, rouge: 0.2 } as const;

export interface Bandeau {
  /** Largeur de la bande (en travers), en unités du motif. */
  largeur: number;
  /** Période du motif le long de la bande : deux losanges, 4h. */
  periode: number;
  /** Un tracé par couleur, peints dans cet ordre sur un fond ivoire :
   *  le jaune recouvre le vert, le rouge recouvre le jaune. */
  vert: string;
  jaune: string;
  rouge: string;
}

/**
 * Motif unitaire du bandeau, côté `cote` (largeur de la colonne de losanges).
 * En travers : liseré vert c/8, jour c/16, colonne c, jour, liseré.
 * Le long : deux losanges sur une période 4h ; les flancs entre deux pointes
 * alternent rouge et jaune, de sorte que chaque losange vert est encadré d'un
 * rouge et d'un jaune. Les flancs à cheval sur la limite du motif sont tracés
 * entiers aux deux bouts : le motif répété les recoud.
 */
export function bandeau(cote: number, horizontal = false): Bandeau {
  const h = hauteurRang(cote);
  const lisere = cote / 8;
  const jour = cote / 16;
  const a = lisere + jour;
  const largeur = cote + 2 * a;
  const periode = 4 * h;
  const axe = a + cote / 2;

  /** Flanc gauche et droit autour de la pointe située en v. */
  const flancs = (v: number): Pt[][] => [
    [
      [a, v - h],
      [axe, v],
      [a, v + h],
    ],
    [
      [a + cote, v - h],
      [axe, v],
      [a + cote, v + h],
    ],
  ];

  const losanges = [h, 3 * h];
  const p = (pts: Pt[]) => polygone(pts, horizontal);

  return {
    largeur: n(largeur),
    periode: n(periode),
    vert: [
      p(bande(0, lisere, periode)),
      p(bande(largeur - lisere, largeur, periode)),
      ...losanges.map((v) => p(losange(axe, v, cote, 1))),
    ].join(""),
    jaune: [
      ...flancs(2 * h).map(p),
      ...losanges.map((v) => p(losange(axe, v, cote, EMBOITEMENT.jaune))),
    ].join(""),
    rouge: [
      ...flancs(0).map(p),
      ...flancs(periode).map(p),
      ...losanges.map((v) => p(losange(axe, v, cote, EMBOITEMENT.rouge))),
    ].join(""),
  };
}

/**
 * Une maille du bandeau, seule : le losange de deux triangles et ses deux
 * losanges emboîtés. Sert d'emplacement de logo (components/brand/logo.tsx).
 */
export function maille(cote: number): { largeur: number; hauteur: number; vert: string; jaune: string; rouge: string } {
  const h = hauteurRang(cote);
  const c = (k: number) => polygone(losange(cote / 2, h, cote, k), false);
  return { largeur: n(cote), hauteur: n(2 * h), vert: c(1), jaune: c(EMBOITEMENT.jaune), rouge: c(EMBOITEMENT.rouge) };
}
