import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IntroCompacte } from "@/components/layout/intro-compacte";
import { FicheEdition, type DocumentsEdition } from "@/components/historique/fiche-edition";
import { OngletsEditions } from "@/components/historique/onglets-editions";
import { Flag } from "@/components/shared/flag";
import { archives, editions, nations } from "@/lib/contenu";
import type { ArchiveDocumentType, Edition, Locale, ProblemCategory } from "@/content/types";

const DOCUMENTS: ArchiveDocumentType[] = ["sujet", "solutions", "resultats"];
const CATEGORIES: ProblemCategory[] = ["junior", "senior"];

/** Documents d'une édition. Les corrigés propres à un problème (page Problèmes et solutions) n'en font pas partie. */
function documentsDe(year: number): DocumentsEdition {
  const chemin = (type: ArchiveDocumentType, category: ProblemCategory) =>
    archives.find(
      (entry) => entry.year === year && entry.type === type && entry.category === category && entry.problem === undefined,
    )?.path ?? null;
  return Object.fromEntries(
    DOCUMENTS.map((type) => [type, Object.fromEntries(CATEGORIES.map((category) => [category, chemin(type, category)]))]),
  ) as DocumentsEdition;
}

/** Une édition dont les effectifs et les pays participants sont publiés. */
const estDocumentee = (edition: Edition) => edition.competitors !== null && edition.participants !== null;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.History" });
  return metadonneesPage({ locale, chemin: "/historique", titre: t("title"), description: t("lead") });
}

/**
 * Historique des éditions passées : une fiche à la fois derrière des onglets
 * d'années, puis le tableau des pays organisateurs. Données de
 * content/editions.json et content/archives.json ; rien n'est complété à la
 * main pour une édition dont les chiffres n'ont pas été publiés.
 */
export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.History" });

  const chronologie = [...editions].sort((a, b) => a.year - b.year);
  const noms = Object.fromEntries(nations.map((nation) => [nation.countryCode, nation.name[typedLocale]]));
  // Par défaut : la dernière édition dont les données sont publiées.
  const derniere = chronologie.findLastIndex(estDocumentee);

  return (
    <>
      <IntroCompacte title={t("title")} lead={t("lead")} />

      <section className="bg-entete-fond pt-6 pb-16 text-foreground lg:pt-8 lg:pb-20">
        <div className="mx-auto box-border flex w-full max-w-[75rem] flex-col gap-12 px-4 sm:px-6">
          <OngletsEditions
            libelle={t("editionsLabel")}
            annees={chronologie.map((edition) => edition.year)}
            initiale={derniere === -1 ? chronologie.length - 1 : derniere}
            fiches={chronologie.map((edition) => (
              <FicheEdition
                key={edition.year}
                edition={edition}
                locale={typedLocale}
                noms={noms}
                documents={documentsDe(edition.year)}
              />
            ))}
          />

          <section aria-labelledby="pays-organisateurs" className="flex flex-col gap-4">
            <h2
              id="pays-organisateurs"
              className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] font-bold text-vert-profond dark:text-primary"
            >
              {t("hostsTitle")}
            </h2>
            <span aria-hidden className="h-0.5 w-12 bg-accent" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-small text-foreground sm:text-body">
                <thead>
                  <tr className="border-b border-or text-left">
                    <th scope="col" className="py-2.5 pr-3 sm:pr-4 text-small font-semibold text-muted-foreground">
                      {t("columns.edition")}
                    </th>
                    <th scope="col" className="py-2.5 pr-3 sm:pr-4 text-small font-semibold text-muted-foreground">
                      {t("columns.host")}
                    </th>
                    <th scope="col" className="py-2.5 text-small font-semibold text-muted-foreground">
                      {t("columns.dates")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chronologie.map((edition) => (
                    <tr key={edition.year} className="border-b border-hairline">
                      <th scope="row" className="py-2.5 pr-3 sm:pr-4 text-left font-semibold tabular-nums text-vert-profond dark:text-primary">
                        {edition.year}
                      </th>
                      <td className="py-2.5 pr-4">
                        <span className="flex items-center gap-2">
                          <Flag countryCode={edition.hostCode} size={20} />
                          {edition.host[typedLocale]}
                        </span>
                      </td>
                      <td className="data py-2.5 text-muted-foreground">{edition.dates?.[typedLocale] ?? t("toComplete")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
