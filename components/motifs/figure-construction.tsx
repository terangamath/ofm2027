/**
 * La figure du problème 3 (Senior) de l'OFM 2024, construite à la règle et au
 * compas dans l'ordre de l'énoncé :
 *   ABC acutangle, ω son cercle circonscrit de centre O ; la hauteur issue de A
 *   recoupe ω en D ; le cercle circonscrit à OCD recoupe [AC] en E ; M est le
 *   milieu de [BE]. À démontrer : (DE) ∥ (OM).
 *
 * Coordonnées : lib/figure-geometrie.ts (partagées avec l'image de partage).
 * La chorégraphie est en CSS (globals.css, `.figure-construction`) : 1,8 s,
 * rejouée à chaque affichage de l'accueil (le composant est remonté à chaque
 * navigation vers la page, donc les animations CSS repartent), état final
 * direct sous prefers-reduced-motion.
 */
import { K, OMEGA_R, P } from "@/lib/figure-geometrie";
import { COTE_FIGURE, ORIGINE_FIGURE, tuile } from "@/lib/pavage";

type Point = { x: number; y: number };
const seg = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;

/** Étiquette d'un point, décalée vers l'extérieur de la figure. */
function Etiquette({ p, dx, dy, delai, children }: { p: Point; dx: number; dy: number; delai: number; children: string }) {
  return (
    <text
      x={p.x + dx}
      y={p.y + dy}
      className="figure-etiquette"
      style={{ ["--delai" as string]: `${delai}ms` }}
    >
      {children}
    </text>
  );
}

function Pt({ p, delai }: { p: Point; delai: number }) {
  return <circle cx={p.x} cy={p.y} r={4} className="figure-point" style={{ ["--delai" as string]: `${delai}ms` }} />;
}

/**
 * Trame de la variante C : le pavage triangulaire {3,6} sur lequel la figure
 * se construit, nœud en O, côté R/10, estompé hors du cercle. Statique : elle
 * n'entre pas dans la chorégraphie.
 */
function Trame() {
  const t = tuile(COTE_FIGURE);
  return (
    <>
      <defs>
        <pattern id="trame-pavage" x={ORIGINE_FIGURE.x} y={ORIGINE_FIGURE.y} width={t.largeur} height={t.hauteur} patternUnits="userSpaceOnUse">
          <path d={t.chemin} className="figure-trame" />
        </pattern>
        <radialGradient id="trame-fondu" cx={ORIGINE_FIGURE.x} cy={ORIGINE_FIGURE.y} r={OMEGA_R + 40} gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
        <mask id="trame-masque" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
          <rect width="600" height="600" fill="url(#trame-fondu)" />
        </mask>
      </defs>
      <rect width="600" height="600" fill="url(#trame-pavage)" mask="url(#trame-masque)" />
    </>
  );
}

export function FigureConstruction({ className, trame = false }: { className?: string; trame?: boolean }) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      className={`figure-construction ${className ?? ""}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {trame && <Trame />}

      {/* 1. ω et le triangle */}
      <circle cx={P.O.x} cy={P.O.y} r={OMEGA_R} pathLength={1} className="figure-trait" style={{ ["--delai" as string]: "0ms", ["--duree" as string]: "500ms" }} />
      <path d={seg(P.A, P.B)} pathLength={1} className="figure-trait" style={{ ["--delai" as string]: "250ms", ["--duree" as string]: "350ms" }} />
      <path d={seg(P.B, P.C)} pathLength={1} className="figure-trait" style={{ ["--delai" as string]: "330ms", ["--duree" as string]: "350ms" }} />
      <path d={seg(P.C, P.A)} pathLength={1} className="figure-trait" style={{ ["--delai" as string]: "410ms", ["--duree" as string]: "350ms" }} />

      {/* 2. la hauteur issue de A, prolongée jusqu'à D (trait de construction) */}
      <path d={seg(P.A, P.D)} pathLength={1} className="figure-construction-trait" style={{ ["--delai" as string]: "450ms", ["--duree" as string]: "400ms" }} />

      {/* 3. le cercle circonscrit à OCD (trait de construction) */}
      <circle cx={K.x} cy={K.y} r={K.r} pathLength={1} className="figure-construction-trait" style={{ ["--delai" as string]: "800ms", ["--duree" as string]: "450ms" }} />

      {/* 4. [BE], puis la conclusion : (DE) et (OM) */}
      <path d={seg(P.B, P.E)} pathLength={1} className="figure-trait" style={{ ["--delai" as string]: "1200ms", ["--duree" as string]: "250ms" }} />
      <path d={seg(P.D, P.E)} pathLength={1} className="figure-conclusion" style={{ ["--delai" as string]: "1450ms", ["--duree" as string]: "300ms" }} />
      <path d={seg(P.O, P.M)} pathLength={1} className="figure-conclusion" style={{ ["--delai" as string]: "1450ms", ["--duree" as string]: "300ms" }} />

      {/* Points, dans l'ordre de leur construction */}
      <Pt p={P.O} delai={100} />
      <Pt p={P.A} delai={250} />
      <Pt p={P.B} delai={330} />
      <Pt p={P.C} delai={410} />
      <Pt p={P.D} delai={850} />
      <Pt p={P.E} delai={1250} />
      <Pt p={P.M} delai={1450} />

      <Etiquette p={P.A} dx={-4} dy={-14} delai={250}>A</Etiquette>
      <Etiquette p={P.B} dx={-24} dy={8} delai={330}>B</Etiquette>
      <Etiquette p={P.C} dx={14} dy={8} delai={410}>C</Etiquette>
      <Etiquette p={P.O} dx={-22} dy={-8} delai={100}>O</Etiquette>
      <Etiquette p={P.D} dx={-8} dy={26} delai={850}>D</Etiquette>
      <Etiquette p={P.E} dx={12} dy={-10} delai={1250}>E</Etiquette>
      <Etiquette p={P.M} dx={-26} dy={18} delai={1450}>M</Etiquette>
    </svg>
  );
}
