import Image from "next/image";
import { rapportDrapeau, srcDrapeau } from "@/lib/drapeaux";

/** Rapport de la zone commune à tous les drapeaux. */
const RAPPORT_ZONE = 3 / 2;

/**
 * Drapeau suspendu au-dessus de la page : le drapeau entier, sans rognage,
 * centré dans une zone 3:2 commune (les noms restent alignés), et une ombre
 * ovale détachée, indépendante du drapeau. Le CSS ne porte que l'ombre et
 * l'interaction (lien parent .delegation, voir globals.css) : le relief du
 * tissu viendra des fichiers de drapeaux eux-mêmes. Décoratif : alt vide, le
 * nom du pays est écrit dans le même lien.
 */
export function DrapeauFlottant({
  countryCode,
  hote = false,
  sizes,
}: {
  countryCode: string;
  hote?: boolean;
  sizes: string;
}) {
  const rapport = rapportDrapeau(countryCode);
  const large = rapport >= RAPPORT_ZONE;
  return (
    <span className="flag-stage">
      <span className="flag-shadow" aria-hidden />
      <span
        className={`flag-fabric ${hote ? "flag-fabric-hote" : ""}`}
        style={{ aspectRatio: rapport, width: large ? "100%" : "auto", height: large ? "auto" : "100%" }}
      >
        <Image src={srcDrapeau(countryCode)} alt="" fill sizes={sizes} className="object-contain" />
      </span>
    </span>
  );
}
