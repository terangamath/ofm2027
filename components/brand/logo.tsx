import { maille } from "@/lib/pavage";

/**
 * Logo de l'OFM 2027 — fichier unique.
 *
 * Le logo définitif n'est pas encore arrêté par l'association : c'est ici, et
 * seulement ici, qu'il se remplace (en-tête et pied de page l'importent). Un
 * logo fourni en SVG prendra la place de ce rendu ; garder `aria-hidden` sur
 * le graphisme et le nom en texte (ou dans `alt`). Rien ailleurs ne dépend de
 * sa forme.
 *
 * Emplacement de la variante D : une maille du bandeau tissé (lib/pavage.ts),
 * un losange du pavage {3,6} et ses losanges emboîtés.
 * Les icônes (favicon, image de partage) sont générées séparément par
 * scripts/images-marque.mjs, à reprendre en même temps.
 */
const MAILLE = maille(18);

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg aria-hidden viewBox={`0 0 ${MAILLE.largeur} ${MAILLE.hauteur}`} className="h-8 w-auto">
        <path d={MAILLE.vert} style={{ fill: "var(--pastille-vert)" }} />
        <path d={MAILLE.jaune} style={{ fill: "var(--soleil)" }} />
        <path d={MAILLE.rouge} style={{ fill: "var(--rouge)" }} />
      </svg>
      <span className="font-display text-[1.375rem] leading-none font-bold tracking-[-0.02em] text-foreground">
        OFM <span className="text-primary">2027</span>
      </span>
    </span>
  );
}
