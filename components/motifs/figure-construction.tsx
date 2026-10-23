/**
 * La figure du problème 3 (Senior) de l'OFM 2024, construite à la règle et au
 * compas :
 *   ABC acutangle, ω son cercle circonscrit de centre O ; la hauteur issue de A
 *   recoupe ω en D ; le cercle circonscrit à OCD recoupe [AC] en E ; M est le
 *   milieu de [BE]. À démontrer : (DE) ∥ (OM).
 *
 * Variante D : un disque soleil, décentré, porte la figure ; la construction
 * de O se lit — arcs de compas, médiatrices en pointillés, croisements
 * marqués d'un petit cercle.
 *
 * Coordonnées : lib/figure-geometrie.ts (partagées avec l'image de partage).
 * Le repère est prolongé à 640 de haut : le cercle OCD descend sous ω.
 * La chorégraphie est en CSS (globals.css, `.figure-construction`) : 1,8 s,
 * dans l'ordre d'une construction réelle — triangle, médiatrices, O, ω,
 * hauteur, cercle OCD, conclusion. Le disque est là dès 0 ms, immobile.
 * Les traits pointillés se dessinent à travers un masque (le pointillé et le
 * tracé progressif ne peuvent pas partager stroke-dasharray). État final
 * direct sous prefers-reduced-motion.
 */
import type { CSSProperties } from "react";
import { COMPAS, DISQUE, K, OMEGA_R, P } from "@/lib/figure-geometrie";

type Point = { x: number; y: number };
const seg = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;

const temps = (delai: number, duree?: number) =>
  ({ "--delai": `${delai}ms`, ...(duree ? { "--duree": `${duree}ms` } : {}) }) as CSSProperties;

/** Étiquette d'un point, décalée vers l'extérieur de la figure. */
function Etiquette({ p, dx, dy, delai, children }: { p: Point; dx: number; dy: number; delai: number; children: string }) {
  return (
    <text x={p.x + dx} y={p.y + dy} className="figure-etiquette" style={temps(delai)}>
      {children}
    </text>
  );
}

function Pt({ p, delai }: { p: Point; delai: number }) {
  return <circle cx={p.x} cy={p.y} r={4.5} className="figure-point" style={temps(delai)} />;
}

/** Trait pointillé tracé progressivement : le masque se dessine, le pointillé apparaît dessous. */
function Pointille({ id, d, delai, duree }: { id: string; d: string; delai: number; duree: number }) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="640">
        <path d={d} pathLength={1} className="figure-masque" style={temps(delai, duree)} />
      </mask>
      <path d={d} mask={`url(#${id})`} className="figure-pointille" />
    </>
  );
}

const cercle = (c: Point, r: number) => `M${c.x - r} ${c.y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export function FigureConstruction({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 640"
      aria-hidden="true"
      className={`figure-construction ${className ?? ""}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={DISQUE.x} cy={DISQUE.y} r={DISQUE.r} className="figure-disque" />

      {/* 1. le triangle */}
      <path d={seg(P.A, P.B)} pathLength={1} className="figure-trait" style={temps(0, 300)} />
      <path d={seg(P.B, P.C)} pathLength={1} className="figure-trait" style={temps(80, 300)} />
      <path d={seg(P.C, P.A)} pathLength={1} className="figure-trait" style={temps(160, 300)} />

      {/* 2. arcs de compas, puis les médiatrices de [AB] et [AC], qui se coupent en O */}
      {[COMPAS.AB, COMPAS.AC].flatMap((m, i) =>
        m.arcs.map((d, j) => (
          <path key={`${i}${j}`} d={d} pathLength={1} className="figure-compas" style={temps(300 + i * 80 + j * 40, 220)} />
        )),
      )}
      <Pointille id="fig-med-ab" d={COMPAS.AB.mediatrice} delai={520} duree={300} />
      <Pointille id="fig-med-ac" d={COMPAS.AC.mediatrice} delai={600} duree={300} />

      {/* 3. ω, de centre O */}
      <circle cx={P.O.x} cy={P.O.y} r={OMEGA_R} pathLength={1} className="figure-trait" style={temps(820, 420)} />

      {/* 4. la hauteur issue de A, prolongée jusqu'à D ; le cercle circonscrit à OCD */}
      <Pointille id="fig-hauteur" d={seg(P.A, P.D)} delai={1000} duree={280} />
      <Pointille id="fig-ocd" d={cercle(K, K.r)} delai={1180} duree={380} />

      {/* 5. [BE], puis la conclusion : (DE) et (OM) */}
      <path d={seg(P.B, P.E)} pathLength={1} className="figure-trait" style={temps(1460, 160)} />
      <path d={seg(P.D, P.E)} pathLength={1} className="figure-conclusion" style={temps(1560, 240)} />
      <path d={seg(P.O, P.M)} pathLength={1} className="figure-conclusion" style={temps(1560, 240)} />

      {/* Croisements des arcs : la pointe du compas */}
      <circle cx={COMPAS.AB.X.x} cy={COMPAS.AB.X.y} r={5} className="figure-repere" style={temps(500)} />
      <circle cx={COMPAS.AC.X.x} cy={COMPAS.AC.X.y} r={5} className="figure-repere" style={temps(580)} />

      {/* Points, dans l'ordre de leur construction */}
      <Pt p={P.A} delai={0} />
      <Pt p={P.B} delai={80} />
      <Pt p={P.C} delai={160} />
      <Pt p={P.O} delai={820} />
      <Pt p={P.D} delai={1220} />
      <Pt p={P.E} delai={1460} />
      <Pt p={P.M} delai={1560} />

      <Etiquette p={P.A} dx={-5} dy={-15} delai={0}>A</Etiquette>
      <Etiquette p={P.B} dx={-26} dy={8} delai={80}>B</Etiquette>
      <Etiquette p={P.C} dx={14} dy={8} delai={160}>C</Etiquette>
      <Etiquette p={P.O} dx={-8} dy={-14} delai={820}>O</Etiquette>
      <Etiquette p={P.D} dx={-8} dy={28} delai={1220}>D</Etiquette>
      <Etiquette p={P.E} dx={12} dy={-10} delai={1460}>E</Etiquette>
      <Etiquette p={P.M} dx={-22} dy={28} delai={1560}>M</Etiquette>
    </svg>
  );
}
