// Figure du problème 3 (Senior) de l'OFM 2024 : coordonnées de la construction,
// partagées par le composant du hero et par scripts/og-image.mjs (image de partage).
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
