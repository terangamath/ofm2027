/**
 * Motifs mathématiques de la page Organisation : figures au trait fin (1 px,
 * couleur courante), purement décoratives. Posés dans un angle de section,
 * en partie hors cadre, ils restent sous le texte (pas d'interception du clic).
 */

const TRAIT = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Introduction : cercle circonscrit, triangle inscrit, médiatrices et centre. */
export function MotifIntroduction({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 240 200" className={className} {...TRAIT}>
      <circle cx="120" cy="104" r="80" />
      <circle cx="120" cy="104" r="56" strokeDasharray="2 5" />
      <path d="M120 24 L189.3 144 L50.7 144 Z" />
      <path d="M120 24 L120 144 M50.7 144 L154.6 84 M189.3 144 L85.4 84" opacity="0.55" />
      <circle cx="120" cy="104" r="2.5" fill="currentColor" />
      <path d="M8 184 H232" opacity="0.5" />
      <path d="M120 144 v-8 h8 v8" opacity="0.7" />
    </svg>
  );
}

const FIGURES = {
  /** Carré inscrit, ses diagonales et le cercle. */
  cercle: (
    <>
      <circle cx="80" cy="80" r="64" />
      <path d="M80 16 L144 80 L80 144 L16 80 Z" />
      <path d="M80 16 V144 M16 80 H144" opacity="0.5" />
    </>
  ),
  /** Angle, son arc et sa bissectrice. */
  angle: (
    <>
      <path d="M20 140 L150 140 M20 140 L120 30" />
      <path d="M70 140 A50 50 0 0 0 53.6 103" />
      <path d="M20 140 L148 80" strokeDasharray="2 5" />
      <circle cx="20" cy="140" r="2.5" fill="currentColor" />
    </>
  ),
  /** Repère et sinusoïde. */
  courbe: (
    <>
      <path d="M10 80 H150 M30 150 V10" opacity="0.6" />
      <path d="M30 80 C45 30, 60 30, 75 80 S105 130, 120 80 S145 40, 150 50" />
      <path d="M75 76 v8 M120 76 v8" />
    </>
  ),
  /** Hexagone régulier et ses grandes diagonales. */
  polygone: (
    <>
      <path d="M80 14 L137.2 47 L137.2 113 L80 146 L22.8 113 L22.8 47 Z" />
      <path d="M80 14 L80 146 M137.2 47 L22.8 113 M137.2 113 L22.8 47" opacity="0.5" />
      <circle cx="80" cy="80" r="33" strokeDasharray="2 5" />
    </>
  ),
} as const;

export type FigureAngle = keyof typeof FIGURES;

export function MotifAngle({ figure, className = "" }: { figure: FigureAngle; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={`pointer-events-none absolute -z-10 ${className}`} {...TRAIT}>
      {FIGURES[figure]}
    </svg>
  );
}
