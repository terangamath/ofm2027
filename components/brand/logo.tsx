/**
 * Logo de l'OFM 2027 — fichier unique.
 *
 * Le logo définitif n'est pas encore arrêté par l'association : c'est ici, et
 * seulement ici, qu'il se remplace (en-tête et pied de page l'importent). Un
 * logo fourni en SVG prendra la place de ce rendu typographique ; garder
 * `aria-hidden` sur le graphisme et le nom en texte (ou dans `alt`).
 * Les icônes (favicon, image de partage) sont générées séparément par
 * scripts/images-marque.mjs, à reprendre en même temps.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="font-display text-2xl leading-none text-primary" aria-hidden>
        Σ
      </span>
      <span className="label text-foreground">OFM 2027</span>
    </span>
  );
}
