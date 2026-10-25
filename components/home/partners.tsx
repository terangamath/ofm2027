import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { partenairesAffiches } from "@/lib/contenu";
import type { Locale, PartnerLogo } from "@/content/types";

/**
 * Taille optique d'un logo : à surface égale plutôt qu'à hauteur égale, un
 * logo carré paraîtrait sinon minuscule à côté d'un logotype allongé. La
 * hauteur est bornée, la largeur suit le rapport d'aspect du fichier ;
 * `scale` (content/partenaires.json) corrige un logo à grandes marges.
 */
const SURFACE = 9000;
const HAUTEUR = { min: 32, max: 80 };
const LARGEUR_MAX = 200;
const HAUTEUR_MAX_CELLULE = 112;

function tailleOptique({ width, height, scale = 1 }: PartnerLogo): { largeur: number; hauteur: number } {
  const rapport = width / height;
  let hauteur = Math.min(HAUTEUR.max, Math.max(HAUTEUR.min, Math.sqrt(SURFACE / rapport))) * scale;
  hauteur = Math.min(hauteur, HAUTEUR_MAX_CELLULE, LARGEUR_MAX / rapport);
  return { largeur: Math.round(hauteur * rapport), hauteur: Math.round(hauteur) };
}

/**
 * « Nos partenaires » : les logos dans des cellules identiques, quatre par
 * ligne sur ordinateur, deux en dessous ; une ligne incomplète reste centrée.
 * Seuls les partenaires confirmés et pourvus d'un logo (content/partenaires.json)
 * sont rendus ; sans aucun, la section n'existe pas. Les logos sont des marques
 * tierces sans version claire : en thème sombre, ils reposent sur un fond blanc.
 */
export async function PartnersSection({ locale }: { locale: Locale }) {
  if (partenairesAffiches.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "Home.Partners" });

  return (
    <section aria-labelledby="partenaires" className="bg-entete-fond py-14 text-foreground lg:py-16">
      <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-10 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 id="partenaires" className="text-[clamp(1.75rem,1.5rem+0.6vw,2rem)] font-semibold text-vert-profond dark:text-primary">
            {t("title")}
          </h2>
          <span aria-hidden className="h-0.5 w-12 bg-accent" />
          <p className="text-body text-muted-foreground">{t("lead")}</p>
        </div>

        <ul className="flex w-full flex-wrap justify-center">
          {partenairesAffiches.map((partner) => {
            const { largeur, hauteur } = tailleOptique(partner.logo);
            const logo = (
              <Image
                src={partner.logo.src}
                alt={partner.name[locale]}
                width={largeur}
                height={hauteur}
                className="object-contain"
                style={{ width: largeur, maxWidth: "100%", height: "auto" }}
              />
            );
            const cellule =
              "flex h-32 w-full items-center justify-center rounded-lg transition-[background-color] duration-100 dark:bg-blanc";
            return (
              <li key={partner.id} className="w-1/2 p-2 lg:w-1/4">
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cellule} hover:bg-muted focus-visible:outline-or-encre dark:hover:bg-sable`}
                  >
                    {logo}
                  </a>
                ) : (
                  <span className={cellule}>{logo}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
