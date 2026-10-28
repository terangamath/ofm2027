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
 * Carte d'un membre : photo, nom et, s'il est connu, un détail (âge, rôle).
 * Place encore vide : avatar neutre et « À confirmer », rien d'inventé.
 * La photo est décorative (alt vide) : le nom est écrit dessous.
 */
function CarteMembre({ place, locale, aConfirmer }: { place: Place; locale: Locale; aConfirmer: string }) {
  return (
    <li className="flex flex-col items-center gap-3 rounded-lg border border-hairline bg-card px-3 py-5 text-center text-card-foreground shadow-soft sm:px-4 sm:py-6">
      {place?.photo ? (
        <Image src={place.photo} alt="" width={96} height={96} className="size-20 rounded-full object-cover sm:size-24" />
      ) : (
        <span aria-hidden className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-24">
          <UserRound className="size-9 sm:size-11" strokeWidth={1.5} />
        </span>
      )}
      {place ? (
        <span className="flex flex-col gap-0.5">
          <span className="text-body font-semibold">{place.name}</span>
          {place.detail && <span className="text-small text-muted-foreground">{place.detail[locale]}</span>}
        </span>
      ) : (
        <span className="text-body font-medium text-muted-foreground">{aConfirmer}</span>
      )}
    </li>
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
              <CarteMembre key={place?.name ?? `place-${i}`} place={place} locale={locale} aConfirmer={libelles.aConfirmer} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className={sousTitre}>{libelles.encadrants}</h3>
          <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 min-[22rem]:grid-cols-2 sm:gap-4 lg:gap-6">
            {equipe.encadrants.map((place, i) => (
              <CarteMembre key={place?.name ?? `place-${i}`} place={place} locale={locale} aConfirmer={libelles.aConfirmer} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
