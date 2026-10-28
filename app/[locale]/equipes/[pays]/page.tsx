import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DrapeauFlottant, TissusDrapeaux } from "@/components/shared/drapeau-flottant";
import { SectionEquipe } from "@/components/delegation/equipe";
import { getDelegations } from "@/lib/content";
import { composerEquipe } from "@/lib/equipes";
import type { Locale } from "@/content/types";

export function generateStaticParams() {
  return getDelegations().map((delegation) => ({ pays: delegation.slug }));
}

/** La délégation et sa place dans la galerie : le même rang lui donne le même tissu que sur la page Équipes. */
function findDelegation(pays: string) {
  const delegations = getDelegations();
  const rang = delegations.findIndex((delegation) => delegation.slug === pays);
  return rang === -1 ? null : { delegation: delegations[rang], rang };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pays: string }>;
}): Promise<Metadata> {
  const { locale, pays } = await params;
  const trouvee = findDelegation(pays);
  if (!trouvee) return {};
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.TeamDetail" });
  return metadonneesPage({
    locale,
    chemin: `/equipes/${trouvee.delegation.slug}`,
    titre: t("title", { of: trouvee.delegation.ofName[typedLocale] }),
  });
}

/**
 * Fiche d'une délégation, commune à tous les pays : le drapeau en tissu centré
 * et le titre, puis l'équipe Junior et l'équipe Senior, sur le même fond clair,
 * séparées par un filet or. Chaque équipe montre ses membres
 * publiés (content/delegations/<pays>.json, `members`) et complète par des
 * places « À confirmer » (lib/equipes.ts).
 */
export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pays: string }>;
}) {
  const { locale, pays } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.TeamDetail" });
  const trouvee = findDelegation(pays);

  if (!trouvee) notFound();
  const { delegation, rang } = trouvee;

  const libelles = (equipe: "junior" | "senior") => ({
    titre: t(equipe),
    participants: t("participants"),
    encadrants: t("leaders"),
    aConfirmer: t("toBeConfirmed"),
  });

  return (
    <>
      {/* Introduction resserrée : sur ordinateur, l'équipe Junior et ses premiers participants tiennent dans le premier écran. */}
      <section className="bg-entete-fond pt-3 pb-2 text-foreground lg:pt-4">
        <TissusDrapeaux />
        <div className="mx-auto flex max-w-[75rem] flex-col gap-1 px-4 sm:px-6">
          <Link
            href="/equipes"
            className="inline-flex min-h-11 items-center gap-2 self-start font-medium text-vert-profond underline decoration-1 underline-offset-4 hover:decoration-2 dark:text-primary"
          >
            <ArrowLeft aria-hidden className="size-4 shrink-0" />
            {t("back")}
          </Link>

          <div className="flex flex-col items-center gap-6 text-center">
            {/* Le drapeau cliqué dans la galerie vient se poser ici. L'écart laisse place à son ombre. */}
            <ViewTransition name={`delegation-${delegation.slug}`} share="partage">
              <span className="block w-[110px] sm:w-[150px]">
                <DrapeauFlottant countryCode={delegation.countryCode} hote={delegation.isHost} rang={rang} />
              </span>
            </ViewTransition>

            <div className="flex flex-col items-center gap-1.5">
              <h1 className="text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight font-bold text-vert-profond text-balance dark:text-foreground">
                {t("title", { of: delegation.ofName[typedLocale] })}
              </h1>
              {delegation.isHost && (
                <p className="text-small font-semibold text-or-profond dark:text-or-clair">{t("hostLabel")}</p>
              )}
              {delegation.status !== "confirmed" && <p className="text-small text-muted-foreground">{t("statusPending")}</p>}
              <span aria-hidden className="mt-1.5 h-0.5 w-12 bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Les deux équipes sur le même fond clair (le pied de page porte déjà le vert), séparées par un filet or. */}
      <div className="bg-entete-fond pt-5 pb-14 text-foreground lg:pt-6 lg:pb-16">
        <SectionEquipe
          id="equipe-junior"
          equipe={composerEquipe(delegation.members, "junior")}
          locale={typedLocale}
          libelles={libelles("junior")}
        />
        <div aria-hidden className="mx-auto my-10 max-w-[75rem] px-4 sm:px-6 lg:my-12">
          <span className="mx-auto block h-px max-w-3xl bg-accent" />
        </div>
        <SectionEquipe
          id="equipe-senior"
          equipe={composerEquipe(delegation.members, "senior")}
          locale={typedLocale}
          libelles={libelles("senior")}
        />
      </div>
    </>
  );
}
