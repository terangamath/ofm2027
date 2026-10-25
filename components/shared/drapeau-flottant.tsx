import Image from "next/image";
import { calageDrapeau, rapportDrapeau, srcDrapeau } from "@/lib/drapeaux";

/** Rapport de la zone commune à tous les drapeaux. */
const RAPPORT_ZONE = 3 / 2;
/** Largeur du repère SVG du drapeau en relief : le déplacement du filtre y est calibré. */
const LARGEUR_TISSU = 300;

/**
 * Drapeau « en tissu », suspendu au-dessus de la page. Décoratif : alt vide,
 * le nom du pays est écrit dans le même lien. Survol et focus sont pilotés
 * par le lien parent (voir globals.css).
 *
 * - variante « plat » : rectangle 3:2 rempli (rognage centré), voile de plis
 *   léger, ombre elliptique (.drapeau-flottant, lien .lien-drapeau) ;
 * - variante « relief » (en essai) : le drapeau entier, sans rognage, dans une
 *   zone 3:2 commune, légèrement incliné en perspective, avec des plis larges
 *   éclairés et ombrés et une ombre au sol indépendante (.flag-stage, lien
 *   .delegation).
 */
export function DrapeauFlottant({
  countryCode,
  hote = false,
  sizes,
  relief = false,
}: {
  countryCode: string;
  hote?: boolean;
  sizes: string;
  relief?: boolean;
}) {
  if (relief) {
    const rapport = rapportDrapeau(countryCode);
    const large = rapport >= RAPPORT_ZONE;
    const hauteur = Math.round((LARGEUR_TISSU / rapport) * 100) / 100;
    return (
      <span className="flag-stage">
        <span className="flag-shadow" aria-hidden />
        <span
          className={`flag-fabric ${hote ? "flag-fabric-hote" : ""}`}
          style={{ aspectRatio: rapport, width: large ? "100%" : "auto", height: large ? "auto" : "100%" }}
        >
          <span className="flag-clip">
            {/* Souplesse du tissu : le filtre #tissu-souple (défini dans la page) tourne
                dans ce SVG, rendu d'un bloc (un filtre CSS sur du HTML laisse des raccords
                de tuiles). Repère de 300 unités de large : déplacement de 1,5 px au plus. */}
            <svg
              aria-hidden
              viewBox={`0 0 ${LARGEUR_TISSU} ${hauteur}`}
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible"
            >
              <g filter="url(#tissu-souple)">
                <image href={srcDrapeau(countryCode)} width={LARGEUR_TISSU} height={hauteur} preserveAspectRatio="xMidYMid meet" />
              </g>
            </svg>
            <span className="flag-folds" aria-hidden />
            <span className="flag-light" aria-hidden />
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="drapeau-flottant">
      <span className={`drapeau ${hote ? "drapeau-hote" : ""}`}>
        <Image
          src={srcDrapeau(countryCode)}
          alt=""
          fill
          sizes={sizes}
          className={`object-cover ${calageDrapeau(countryCode)}`}
        />
      </span>
    </span>
  );
}
