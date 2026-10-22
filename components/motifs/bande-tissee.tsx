import { bandeTissee, svgMasque } from "@/lib/pavage";

/**
 * Bande tissée — la transition de la variante C.
 *
 * Une rangée double du pavage triangulaire {3,6} : un losange sur deux est
 * rempli d'or, l'autre reste ouvert sur les droites du pavage. Une frise de
 * groupe p2mm, celle des bandes de losanges des pagnes tissés. Posée sur la
 * limite entre le hero et la partition, dans la largeur du contenu, à la
 * place du filet.
 *
 * Trois calques superposés, chacun un masque CSS (la géométrie, générée par
 * lib/pavage.ts) sur un fond de couleur (le rôle, qui suit le thème).
 * mask-repeat: round ajuste le nombre de motifs à la largeur : jamais de
 * losange coupé ni d'interruption des droites (écart d'échelle < 3 %).
 */
const COTE = 14;
const BANDE = bandeTissee(COTE);
const TAILLE = `${BANDE.largeur}px ${BANDE.hauteur}px`;

const MASQUES = {
  trame: svgMasque(BANDE.largeur, BANDE.hauteur, `<path d="${BANDE.trame}" fill="none" stroke="black" stroke-width="1"/>`),
  losange: svgMasque(BANDE.largeur, BANDE.hauteur, `<path d="${BANDE.losangeA}" fill="black"/>`),
};

function Calque({ masque, className }: { masque: string; className: string }) {
  return (
    <span
      className={`absolute inset-0 ${className}`}
      style={{ maskImage: masque, maskSize: TAILLE, maskRepeat: "round no-repeat", WebkitMaskImage: masque, WebkitMaskSize: TAILLE, WebkitMaskRepeat: "round no-repeat" }}
    />
  );
}

export function BandeTissee() {
  return (
    <div aria-hidden className="bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative" style={{ height: BANDE.hauteur }}>
          <Calque masque={MASQUES.trame} className="bg-pavage-trame" />
          <Calque masque={MASQUES.losange} className="bg-pavage-a" />
        </div>
      </div>
    </div>
  );
}
