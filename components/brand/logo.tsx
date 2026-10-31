import Image from "next/image";
import { maille } from "@/lib/pavage";
import emblemePi from "@/public/icons/logo-embleme.png";

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
 * Les icônes (favicon, apple-touch-icon, manifeste) sont générées depuis
 * l'emblème par scripts/icones.mjs ; l'image de partage par
 * scripts/images-marque.mjs. À reprendre en même temps.
 *
 * `embleme="pi"` : l'emblème de l'OFM 2027 (π aux couleurs du Sénégal), utilisé
 * par l'en-tête. public/icons/logo-embleme.png est tiré de
 * public/icons/logo-without-text.png (recadré, 192 px de haut).
 * En thème sombre, un disque sable garde le baobab et la pirogue lisibles.
 */
const MAILLE = maille(18);

export function Logo({ className, embleme = "maille" }: { className?: string; embleme?: "maille" | "pi" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {embleme === "pi" ? (
        <Image src={emblemePi} alt="" width={47} height={48} priority className="h-11 w-auto lg:h-12 dark:rounded-full dark:bg-sable dark:p-1" />
      ) : (
        <svg aria-hidden viewBox={`0 0 ${MAILLE.largeur} ${MAILLE.hauteur}`} className="h-8 w-auto">
          <path d={MAILLE.vert} style={{ fill: "var(--pastille-vert)" }} />
          <path d={MAILLE.jaune} style={{ fill: "var(--soleil)" }} />
          <path d={MAILLE.rouge} style={{ fill: "var(--rouge)" }} />
        </svg>
      )}
      <span className="text-[1.375rem] leading-none font-bold tracking-[-0.02em] text-foreground">
        OFM <span className="text-primary">2027</span>
      </span>
    </span>
  );
}
