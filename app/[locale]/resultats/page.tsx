import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IntroCompacte } from "@/components/layout/intro-compacte";
import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";
import { Classement, type LibellesClassement } from "@/components/resultats/classement";
import { nations, resultats, resultatsFictifs } from "@/lib/contenu";
import { APERCUS_FICTIFS } from "@/lib/site";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Results" });
  return metadonneesPage({ locale, chemin: "/resultats", titre: t("title"), description: t("lead") });
}

/**
 * Résultats de l'édition 2027. Classements officiels (content/resultats.json)
 * dès qu'ils sont publiés ; d'ici là, le message d'attente. Hors production,
 * un classement fictif (content/apercu/) permet de prévisualiser le tableau,
 * signalé comme tel.
 */
export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Results" });

  const apercu = !resultats.published && APERCUS_FICTIFS;
  const classements = resultats.published ? resultats : apercu ? resultatsFictifs : null;

  let contenu = <ComingSoonPanel title={t("notPublishedTitle")} body={t("notPublished")} />;
  if (classements) {
    const plusGrand = Math.max(classements.junior.length, classements.senior.length);
    // Les gabarits gardent leurs variables, remplies côté navigateur.
    const libelles: LibellesClassement = {
      categories: t("categoriesLabel"),
      junior: t("junior"),
      senior: t("senior"),
      searchLabel: t("searchLabel"),
      searchPlaceholder: t("searchPlaceholder"),
      countryLabel: t("countryLabel"),
      allCountries: t("allCountries"),
      caption: t("caption", { category: "{category}" }),
      previewCaption: t("previewCaption"),
      countryPlaceholder: t("countryPlaceholder"),
      colRank: t("colRank"),
      colAward: t("colAward"),
      colParticipant: t("colParticipant"),
      colCountry: t("colCountry"),
      colProblem: t("colProblem", { n: "{n}" }),
      colProblemLong: t("colProblemLong", { n: "{n}" }),
      colTotal: t("colTotal"),
      gold: t("gold"),
      silver: t("silver"),
      bronze: t("bronze"),
      noAward: t("noAward"),
      compte: Array.from({ length: plusGrand + 1 }, (_, count) => t("count", { count })),
      noMatch: t("noMatch"),
      resetFilters: t("resetFilters"),
      paginationLabel: t("paginationLabel"),
      previous: t("previous"),
      next: t("next"),
      pageOf: t("pageOf", { page: "{page}", pages: "{pages}" }),
      legend: t("legend"),
      download: t("download"),
      previewBadge: t("previewBadge"),
      scrollHint: t("scrollHint"),
    };
    const nomsPays = Object.fromEntries(nations.map((nation) => [nation.countryCode, nation.name[typedLocale]]));

    contenu = (
      <div className="flex flex-col gap-6">
        {apercu && (
          <div role="note" className="flex flex-col gap-1 self-start rounded-lg border border-or bg-or/10 px-4 py-3">
            <p className="font-bold text-or-encre dark:text-or-clair">{t("previewBadge")}</p>
            <p className="text-small text-foreground">{t("previewNote")}</p>
          </div>
        )}
        <Classement classements={classements} nomsPays={nomsPays} apercu={apercu} libelles={libelles} />
      </div>
    );
  }

  return (
    <>
      <IntroCompacte title={t("title")} lead={t("lead")} />
      <section className="bg-entete-fond pt-8 pb-16 text-foreground lg:pt-10 lg:pb-20">
        <div className="mx-auto max-w-[75rem] px-4 sm:px-6">{contenu}</div>
      </section>
    </>
  );
}
