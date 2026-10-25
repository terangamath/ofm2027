import Image from "next/image";
import { calageDrapeau, srcDrapeau } from "@/lib/drapeaux";

/**
 * Drapeau « en tissu », suspendu au-dessus de la page : le drapeau officiel
 * (public/drapeaux/) dans un rectangle 3:2 net, un voile de plis très léger
 * (::after de .drapeau), et une ombre elliptique diffuse détachée sous lui
 * (::after de .drapeau-flottant). Décoratif : alt vide, le nom du pays est
 * écrit à côté. Survol et focus : piloté par le lien parent `.lien-drapeau`
 * (voir globals.css).
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
