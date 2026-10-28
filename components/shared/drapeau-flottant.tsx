import type { CSSProperties } from "react";
import { cadrageDrapeau, srcDrapeau } from "@/lib/drapeaux";

/** Repère du drapeau : 300 × 200, ses proportions 3:2. */
const L = 300;
const H = 200;
/** Creux et crêtes des bords, en unités du repère, côté flottant. */
const ONDULATION = 4;
const ECHANTILLONS = 48;

/**
 * Trois tissus : même vent, plis différents. Des voisins de galerie ne portent
 * jamais les mêmes (rang % 3). `periode` : distance entre deux grands plis ;
 * `angle` : inclinaison de la direction du vent (les plis lui sont
 * perpendiculaires, donc tombent en biais) ; `ondes` et `phase` : bords.
 */
const TISSUS = [
  { periode: 150, angle: -38, ondes: 1.6, phase: 0.5 },
  { periode: 165, angle: -45, ondes: 1.8, phase: 2.1 },
  { periode: 140, angle: -32, ondes: 1.5, phase: 3.6 },
];
type Tissu = (typeof TISSUS)[number];

/** Profil d'un pli sur une période (u de 0 à 1) : un grand pli et un plus fin, entre -1 et 1 environ. */
const profil = (u: number) => 0.62 * Math.sin(2 * Math.PI * u) + 0.38 * Math.sin(4 * Math.PI * u + 1.1);

/** Reflet satiné : seules les crêtes s'éclairent, avec une montée douce. */
const reflet = (s: number) => 0.4 * Math.max(0, (s - 0.15) / 0.85) ** 1.4;
/** Creux : l'ombre s'installe dès que le tissu se dérobe. */
const creux = (s: number) => 0.3 * Math.max(0, (-s - 0.05) / 0.95) ** 1.2;

/** Déplacement des bords le long du drapeau : nul à la hampe, ample au bout flottant. */
function bord(x: number, { ondes, phase }: Tissu): number {
  const t = Math.min(1, Math.max(0, x / L));
  return ONDULATION * (0.3 + 0.7 * t) * Math.sin(2 * Math.PI * ondes * t + phase);
}

/** Contour ondulé du tissu, élargi de `marge` (cadre du pays hôte). */
function contour(tissu: Tissu, marge = 0): string {
  const xs = Array.from({ length: ECHANTILLONS + 1 }, (_, i) => -marge + (i / ECHANTILLONS) * (L + 2 * marge));
  const haut = xs.map((x) => `${x.toFixed(2)},${(bord(x, tissu) - marge).toFixed(2)}`);
  const bas = [...xs].reverse().map((x) => `${x.toFixed(2)},${(H + bord(x, tissu) + marge).toFixed(2)}`);
  return `M${haut.join("L")}L${bas.join("L")}Z`;
}

/** Vecteur d'une période de plis, dans la direction du vent. */
function vecteur({ periode, angle }: Tissu) {
  const a = (angle * Math.PI) / 180;
  return { dx: periode * Math.cos(a), dy: periode * Math.sin(a) };
}

/** Dégradé répété sur une période : `alpha` donne l'opacité de `couleur` en chaque point du pli. */
function DegradePlis({ id, tissu, couleur, alpha }: { id: string; tissu: Tissu; couleur: string; alpha: (s: number) => number }) {
  const { dx, dy } = vecteur(tissu);
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={dx} y2={dy} spreadMethod="repeat">
      {Array.from({ length: ECHANTILLONS + 1 }, (_, i) => {
        const u = i / ECHANTILLONS;
        return <stop key={i} offset={u} stopColor={couleur} stopOpacity={alpha(profil(u)).toFixed(3)} />;
      })}
    </linearGradient>
  );
}

/**
 * Définitions partagées du tissu, une fois par page avant la galerie : pour
 * chaque tissu, sa forme ondulée (clipPath) et ses deux couches de plis, les
 * creux en noir et les reflets en blanc, répétées le long du vent.
 */
export function TissusDrapeaux() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {TISSUS.map((tissu, i) => (
          <g key={i}>
            <clipPath id={`drapeau-forme-${i}`}>
              <path d={contour(tissu)} />
            </clipPath>
            <DegradePlis id={`drapeau-creux-${i}`} tissu={tissu} couleur="#000" alpha={creux} />
            <DegradePlis id={`drapeau-reflets-${i}`} tissu={tissu} couleur="#fff" alpha={reflet} />
          </g>
        ))}
      </defs>
    </svg>
  );
}

/**
 * Drapeau « en tissu », suspendu au-dessus de la page : le drapeau officiel
 * (public/drapeaux/), intact, découpé dans une forme aux bords ondulés ; par-
 * dessus toute sa surface, des plis diagonaux (creux sombres, reflets satinés)
 * qui traversent bandes et symboles, et glissent lentement dans le sens du vent
 * (.drapeau-plis, figés sous prefers-reduced-motion : le relief reste) ; une
 * ombre elliptique diffuse sous lui (::after de .drapeau-flottant). Le cadre
 * du pays hôte suit le même contour. Décoratif : le nom du pays est écrit à
 * côté. Survol et focus : piloté par le lien parent `.lien-drapeau` (voir
 * globals.css). `rang` (place dans la galerie) choisit le tissu et décale le
 * drapeau dans ses cycles, pour que ses voisins ne bougent pas à l'unisson.
 */
export function DrapeauFlottant({
  countryCode,
  hote = false,
  rang = 0,
}: {
  countryCode: string;
  hote?: boolean;
  rang?: number;
}) {
  const n = rang % TISSUS.length;
  const tissu = TISSUS[n];
  const { dx, dy } = vecteur(tissu);
  // Couvre le drapeau quelle que soit l'avancée des plis (une période au plus).
  const etendue = tissu.periode + 20;
  const couche = { x: -etendue, y: -etendue, width: L + 2 * etendue, height: H + 2 * etendue };
  // Le drapeau couvre aussi ce que les bords ondulés soulèvent au-dessus et au-dessous du rectangle.
  const cadre = cadrageDrapeau(countryCode, L, H + 2 * ONDULATION);

  return (
    <span className="drapeau-flottant" style={{ "--rang": rang } as CSSProperties}>
      <svg viewBox={`0 0 ${L} ${H}`} aria-hidden className="drapeau">
        <g clipPath={`url(#drapeau-forme-${n})`}>
          <image href={srcDrapeau(countryCode)} {...cadre} y={cadre.y - ONDULATION} />
          <g className="drapeau-plis" style={{ "--pli-dx": `${dx}px`, "--pli-dy": `${dy}px` } as CSSProperties}>
            <rect {...couche} fill={`url(#drapeau-creux-${n})`} />
            <rect {...couche} fill={`url(#drapeau-reflets-${n})`} />
          </g>
          <path d={contour(tissu)} className="drapeau-lisere" />
        </g>
        {hote && <path d={contour(tissu, 5)} className="drapeau-cadre-hote" />}
      </svg>
    </span>
  );
}
