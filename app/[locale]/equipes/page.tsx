import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { ViewTransition } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDelegations } from "@/lib/content";
import { DrapeauFlottant } from "@/components/shared/drapeau-flottant";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  return metadonneesPage({ locale, chemin: "/equipes", titre: t("title"), description: t("lead") });
}

/**
 * Les délégations : une galerie de drapeaux sur fond blanc. Pays hôte en
 * premier, puis ordre alphabétique (getDelegations). Chaque élément est un
 * seul lien vers la fiche du pays. Chaque drapeau, entier, est suspendu
 * au-dessus de la page (DrapeauFlottant) et monte au survol et au focus.
 */
export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  const delegations = getDelegations();

  return (
    <section className="flex-grow bg-entete-fond pb-16 text-vert-profond lg:pb-24 dark:text-foreground">
      <div className="relative mx-auto max-w-[75rem] overflow-hidden px-4 pt-10 pb-10 sm:px-6 lg:pt-14 lg:pb-14">
        <span
          aria-hidden
          className="annee-contour pointer-events-none absolute -top-2 right-2 text-[clamp(5rem,16vw,12rem)] leading-none font-bold select-none sm:right-6"
        >
          2027
        </span>
        <div className="relative flex flex-col gap-3">
          <span aria-hidden className="flex h-1.5 w-[4.5rem] overflow-hidden rounded-full">
            <span className="flex-1 bg-pastille-vert" />
            <span className="flex-1 bg-soleil" />
            <span className="flex-1 bg-rouge" />
          </span>
          <p className="text-xl font-bold text-or-trait dark:text-or-clair">{t("kicker")}</p>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-bold text-vert-profond dark:text-foreground">
            {t("heading")}
          </h1>
          <span aria-hidden className="h-0.5 w-16 bg-accent" />
        </div>
      </div>

      <ul className="mx-auto grid max-w-[75rem] grid-cols-1 gap-x-4 gap-y-6 px-4 min-[22rem]:grid-cols-2 sm:px-6 md:grid-cols-3 md:gap-x-8 md:gap-y-8 lg:grid-cols-4 lg:gap-x-10">
        {delegations.map((delegation) => {
          const nom = delegation.name[typedLocale];
          return (
            <li key={delegation.slug}>
              <Link
                href={`/equipes/${delegation.slug}`}
                className="delegation group flex flex-col items-center gap-6 rounded-lg p-2 focus-visible:outline-or-trait dark:focus-visible:outline-or-clair"
              >
                <DrapeauFlottant
                  countryCode={delegation.countryCode}
                  hote={delegation.isHost}
                  sizes="(min-width: 1024px) 270px, 45vw"
                />
                <span className="flex flex-col items-center gap-0.5 text-center">
                  {/* La flèche suit le dernier mot, même quand le nom passe sur deux lignes. */}
                  <span className="text-base font-bold sm:text-lg">
                    <ViewTransition name={`delegation-${delegation.slug}`} share="partage">
                      <span className="decoration-or decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
                        {nom}
                      </span>
                    </ViewTransition>
                    <ArrowRight aria-hidden className="fleche-drapeau ml-1.5 inline-block size-5 align-[-0.2em] text-or" />
                  </span>
                  {delegation.isHost && (
                    <span className="text-small font-semibold text-or-profond dark:text-or-clair">{t("hostLabel")}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
