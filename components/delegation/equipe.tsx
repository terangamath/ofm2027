import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Locale } from "@/content/types";
import type { Equipe, Place } from "@/lib/equipes";

interface Libelles {
  titre: string;
  participants: string;
  encadrants: string;
  aConfirmer: string;
}

/**
 * Carte d'une personne (délégation, comité) : photo, nom et, s'il est connu, un
 * détail (âge, fonction). Personne pas encore nommée : avatar neutre et le
 * libellé « à confirmer », rien d'inventé. La photo est décorative (alt vide) :
 * le nom est écrit dessous.
 */
export function CarteMembre({
  nom,
  photo,
  detail,
  aConfirmer,
  className = "",
}: {
  nom: string | null;
  photo?: string | null;
  detail?: string | null;
  aConfirmer: string;
  className?: string;
}) {
  return (
    <li className={`flex flex-col items-center gap-3 rounded-lg border border-hairline bg-card px-3 py-5 text-center text-card-foreground shadow-soft sm:px-4 sm:py-6 ${className}`}>
      {photo ? (
        <Image src={photo} alt="" width={96} height={96} className="size-20 rounded-full object-cover sm:size-24" />
      ) : (
        <span aria-hidden className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-24">
          <UserRound className="size-9 sm:size-11" strokeWidth={1.5} />
        </span>
      )}
      {nom ? (
        <span className="flex flex-col gap-0.5">
          <span className="text-body font-semibold">{nom}</span>
          {detail && <span className="text-small text-muted-foreground">{detail}</span>}
        </span>
      ) : (
        <span className="text-body font-medium text-muted-foreground">{aConfirmer}</span>
      )}
    </li>
  );
}

function CartePlace({ place, locale, aConfirmer }: { place: Place; locale: Locale; aConfirmer: string }) {
  return (
    <CarteMembre nom={place?.name ?? null} photo={place?.photo} detail={place?.detail?.[locale]} aConfirmer={aConfirmer} />
  );
}

/**
 * Une équipe de la délégation (Junior ou Senior) : ses participants sur trois
 * colonnes, puis ses encadrants, centrés. Ni fond ni marge verticale : la fiche
 * pose les deux équipes sur le même fond et règle leur espacement. Titres un
 * cran sous le h1 de la page (32 px).
 */
export function SectionEquipe({
  id,
  equipe,
  locale,
  libelles,
}: {
  id: string;
  equipe: Equipe;
  locale: Locale;
  libelles: Libelles;
}) {
  const sousTitre = "text-h4 font-semibold text-center text-vert-profond dark:text-primary";

  return (
    <section aria-labelledby={id}>
      <div className="mx-auto flex max-w-[75rem] flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-2">
          <h2
            id={id}
            className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] font-bold text-vert-profond dark:text-primary"
          >
            {libelles.titre}
          </h2>
          <span aria-hidden className="h-0.5 w-12 bg-accent" />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className={sousTitre}>{libelles.participants}</h3>
          <ul className="grid grid-cols-1 gap-3 min-[22rem]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:gap-6">
            {equipe.participants.map((place, i) => (
              <CartePlace key={place?.name ?? `place-${i}`} place={place} locale={locale} aConfirmer={libelles.aConfirmer} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className={sousTitre}>{libelles.encadrants}</h3>
          <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 min-[22rem]:grid-cols-2 sm:gap-4 lg:gap-6">
            {equipe.encadrants.map((place, i) => (
              <CartePlace key={place?.name ?? `place-${i}`} place={place} locale={locale} aConfirmer={libelles.aConfirmer} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
