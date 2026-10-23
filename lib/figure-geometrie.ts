// Figure du problème 3 (Senior) de l'OFM 2024 : coordonnées de la construction,
// partagées par le composant du hero et par scripts/images-marque.mjs (image de partage).
// O = (300, 300), R = 250, A à 108°, B à 203°, C à 332°, dans un repère 600 × 600 ;
// le parallélisme (DE) ∥ (OM) est vérifié numériquement (produit vectoriel nul).

export const P = {
  A: { x: 222.7, y: 62.2 },
  B: { x: 69.9, y: 397.7 },
  C: { x: 520.7, y: 417.4 },
  O: { x: 300, y: 300 },
  D: { x: 202.3, y: 530.1 },
  E: { x: 426.9, y: 305.5 },
  M: { x: 248.4, y: 351.6 },
} as const;

/** Rayon de ω, cercle circonscrit à ABC. */
export const OMEGA_R = 250;

/** Cercle circonscrit à OCD. */
export const K = { x: 356.6, y: 459.8, r: 169.5 };

/** Disque soleil derrière la figure : décentré vers le haut et la droite (maquette 5254). */
export const DISQUE = { x: 352, y: 262, r: 204 };

// ── Construction au compas de O (variante D) ────────────────────────────────
// O est le point de concours des médiatrices. Pour chacune, deux arcs de même
// rayon centrés aux extrémités du côté se coupent en un point X de la
// médiatrice, placé hors de ω pour ne pas encombrer la figure ; la médiatrice
// est tracée de X jusqu'au-delà de O. Tout se déduit des points ci-dessus.

type Point = { x: number; y: number };

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Compas : point X de la médiatrice de [PQ] à la distance `t` du milieu, du côté opposé à O. */
function constructionMediatrice(p: Point, q: Point, t: number, depassement: number) {
  const milieu = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const demi = Math.hypot(q.x - p.x, q.y - p.y) / 2;
  // Unitaire de la médiatrice, orienté du milieu vers l'extérieur (loin de O).
  let u = { x: -(q.y - p.y) / (2 * demi), y: (q.x - p.x) / (2 * demi) };
  if ((P.O.x - milieu.x) * u.x + (P.O.y - milieu.y) * u.y > 0) u = { x: -u.x, y: -u.y };
  const X = { x: r1(milieu.x + t * u.x), y: r1(milieu.y + t * u.y) };
  const rayon = r1(Math.hypot(t, demi));
  // Arc de ±10° autour de X, de centre `c`.
  const arc = (c: Point) => {
    const theta = Math.atan2(X.y - c.y, X.x - c.x);
    const delta = (10 * Math.PI) / 180;
    const pt = (a: number) => `${r1(c.x + rayon * Math.cos(a))} ${r1(c.y + rayon * Math.sin(a))}`;
    return `M${pt(theta - delta)}A${rayon} ${rayon} 0 0 1 ${pt(theta + delta)}`;
  };
  const fin = { x: r1(P.O.x - depassement * u.x), y: r1(P.O.y - depassement * u.y) };
  return { X, rayon, arcs: [arc(p), arc(q)], mediatrice: `M${X.x} ${X.y}L${fin.x} ${fin.y}` };
}

/** Médiatrices de [AB] et de [AC] ; elles se coupent en O. */
export const COMPAS = {
  AB: constructionMediatrice(P.A, P.B, 110, 60),
  AC: constructionMediatrice(P.A, P.C, 200, 32),
} as const;
