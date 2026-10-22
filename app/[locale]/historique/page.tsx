import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { archives, editions, nations } from "@/lib/contenu";
import type { ArchiveDocumentType, Edition, Locale } from "@/content/types";

const DOC_TYPES: ArchiveDocumentType[] = ["sujet", "solutions", "resultats"];
const CATEGORIES = ["junior", "senior"] as const;

function archivesFor(year: number, category: "junior" | "senior") {
  return archives.filter((entry) => entry.year === year && entry.category === category);
}

/**
 * Effectifs Junior/Senior lus dans la note (« 60 Junior · 72 Senior … »).
 * Présentation seulement : la donnée reste la note. Si le motif ne correspond
 * pas, la note s'affiche telle quelle.
 */
function effectifs(edition: Edition): { junior: number; senior: number } | null {
  const note = edition.note?.fr ?? "";
  const m = /(\d+)\s*Junior\s*·\s*(\d+)\s*Senior/u.exec(note);
  return m ? { junior: Number(m[1]), senior: Number(m[2]) } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.History" });
  return metadonneesPage({ locale, chemin: "/historique", titre: t("title"), description: t("lead") });
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.History" });

  const hasNoteColumn = editions.some((edition) => edition.note && !effectifs(edition));

  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} />

      {/* Le seul endroit du site où des chiffres se comparent en colonne : une vraie table. */}
      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-small text-foreground">
              <thead>
                <tr className="border-b border-primary/30 text-left align-bottom">
                  <th scope="col" className="label py-3 pr-6 font-medium text-muted-foreground">{t("columns.edition")}</th>
                  <th scope="col" className="label py-3 pr-6 font-medium text-muted-foreground">{t("columns.host")}</th>
                  <th scope="col" className="label py-3 pr-6 font-medium text-muted-foreground">{t("columns.dates")}</th>
                  <th scope="col" className="label py-3 pr-6 text-right font-medium text-muted-foreground">{t("columns.countries")}</th>
                  <th scope="col" className="label py-3 pr-6 text-right font-medium text-muted-foreground">{t("archivesCategory.junior")}</th>
                  <th scope="col" className="label py-3 pr-6 text-right font-medium text-muted-foreground">{t("archivesCategory.senior")}</th>
                  {hasNoteColumn && (
                    <th scope="col" className="label py-3 pr-6 font-medium text-muted-foreground">{t("columns.note")}</th>
                  )}
                  <th scope="col" className="label py-3 font-medium text-muted-foreground">{t("columns.archives")}</th>
                </tr>
              </thead>
              <tbody>
                {editions.map((edition) => {
                  const nombres = effectifs(edition);
                  return (
                    <tr key={edition.year} className="border-b border-hairline align-top">
                      <th scope="row" className="py-5 pr-6 text-left font-display text-h3 leading-none tabular-nums text-primary">
                        {edition.year}
                      </th>
                      <td className="py-5 pr-6 font-medium">
                        {edition.host[typedLocale]}
                        {edition.city && `, ${edition.city[typedLocale]}`}
                      </td>
                      <td className="data py-5 pr-6 whitespace-nowrap text-muted-foreground">{edition.dates?.[typedLocale]}</td>
                      <td className="data py-5 pr-6 text-right">{edition.countriesCount ?? ""}</td>
                      <td className="data py-5 pr-6 text-right">{nombres?.junior ?? ""}</td>
                      <td className="data py-5 pr-6 text-right">{nombres?.senior ?? ""}</td>
                      {hasNoteColumn && (
                        <td className="py-5 pr-6 text-muted-foreground">{!nombres && edition.note ? edition.note[typedLocale] : ""}</td>
                      )}
                      <td className="py-5">
                        <div className="flex flex-col gap-1.5">
                          {CATEGORIES.map((category) => {
                            const entries = archivesFor(edition.year, category);
                            if (entries.length === 0) return null;
                            return (
                              <div key={category} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="w-12 text-muted-foreground">{t(`archivesCategory.${category}`)}</span>
                                {DOC_TYPES.map((type) => {
                                  const entry = entries.find((item) => item.type === type);
                                  if (!entry) return null;
                                  return (
                                    <a
                                      key={type}
                                      href={entry.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="link-text text-link"
                                    >
                                      {t(`archivesType.${type}`)}
                                    </a>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt py-20 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6">
          <h2 className="font-display text-h3 text-foreground">{t("nationsTitle")}</h2>
          <p className="max-w-2xl text-body text-muted-foreground">{t("nationsLead")}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nations.map((nation) => (
              <li key={nation.countryCode} className="text-body text-foreground">
                {nation.name[typedLocale]}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
