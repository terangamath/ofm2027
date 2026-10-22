import { bandeau, type Bandeau } from "@/lib/pavage";

/**
 * Bandeau tissé — la pièce de la variante D (maquette 5254).
 *
 * Une colonne du pavage triangulaire {3,6}, générée par lib/pavage.ts : aucune
 * image importée. Un <pattern> SVG répète le motif ; les couleurs sont des
 * classes (globals.css), donc elles suivent le thème.
 *
 * Le viewBox couvre `REPETITIONS` motifs ; `slice` cale la largeur de la bande
 * sur celle de l'élément et rogne la longueur en trop. Une seule géométrie
 * sert à toutes les largeurs : 28 px en tablette, 52 px en desktop.
 * Vertical à droite du hero dès la tablette ; couché sous le hero sur
 * téléphone, où une colonne prendrait 13 % de la largeur.
 */
const COTE = 16;
const REPETITIONS = 40;
const VERTICAL = bandeau(COTE);
const COUCHE = bandeau(COTE, true);

function Motif({ id, motif, horizontal }: { id: string; motif: Bandeau; horizontal: boolean }) {
  const [l, p] = [motif.largeur, motif.periode];
  const [largeur, hauteur] = horizontal ? [p, l] : [l, p];
  const [vbL, vbH] = horizontal ? [p * REPETITIONS, l] : [l, p * REPETITIONS];
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${vbL} ${vbH}`}
      preserveAspectRatio={horizontal ? "xMidYMid slice" : "xMidYMin slice"}
      className="block size-full"
    >
      <defs>
        <pattern id={id} width={largeur} height={hauteur} patternUnits="userSpaceOnUse">
          <rect width={largeur} height={hauteur} className="tissage-fond" />
          <path d={motif.vert} className="tissage-vert" />
          <path d={motif.jaune} className="tissage-jaune" />
          <path d={motif.rouge} className="tissage-rouge" />
        </pattern>
      </defs>
      <rect width={vbL} height={vbH} fill={`url(#${id})`} />
    </svg>
  );
}

/** Colonne verticale, à placer en absolu sur le bord droit d'une section `relative`. */
export function BandeauVertical({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <Motif id="bandeau-vertical" motif={VERTICAL} horizontal={false} />
    </div>
  );
}

/** Bande couchée, pleine largeur. */
export function BandeauCouche({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <Motif id="bandeau-couche" motif={COUCHE} horizontal />
    </div>
  );
}
