import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import editionsData from "@/content/editions.json";
import archivesData from "@/content/archives.json";
import nationsData from "@/content/nations.json";
import type { ArchiveDocumentType, ArchiveEntry, Edition, HistoricalNation, Locale } from "@/content/types";

const editions = editionsData as Edition[];
const archives = archivesData as ArchiveEntry[];
const nations = nationsData as HistoricalNation[];

const DOC_TYPES: ArchiveDocumentType[] = ["sujet", "solutions", "resultats"];
const CATEGORIES = ["junior", "senior"] as const;

function archivesFor(year: number, category: "junior" | "senior") {
  return archives.filter((entry) => entry.year === year && entry.category === category);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.History" });
  return { title: t("title"), description: t("lead") };
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
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col">
          {editions.map((edition) => (
            <div
              key={edition.year}
              className="grid grid-cols-[minmax(5rem,auto)_1fr] gap-8 border-b border-hairline py-8 first:pt-0 last:border-b-0"
            >
              <span className="font-display text-h2 tabular-nums text-primary">
                {edition.year}
              </span>
              <div className="flex flex-col gap-2">
                <p className="font-medium text-foreground">
                  {edition.host[typedLocale]}
                  {edition.city && `, ${edition.city[typedLocale]}`}
                </p>
                {edition.dates && (
                  <p className="data text-muted-foreground">{edition.dates[typedLocale]}</p>
                )}
                {edition.countriesCount !== null && (
                  <p className="text-small text-muted-foreground">
                    <span className="data">{edition.countriesCount}</span> {t("countriesLabel")}
                  </p>
                )}
                {edition.note && (
                  <p className="text-body text-muted-foreground">{edition.note[typedLocale]}</p>
                )}
                {edition.status === "coming_soon" && (
                  <span className="label self-start rounded-full bg-accent/15 px-2.5 py-0.5 text-link">
                    {tCommon("comingSoon")}
                  </span>
                )}

                {CATEGORIES.some((category) => archivesFor(edition.year, category).length > 0) && (
                  <div className="mt-2 flex flex-col gap-2 border-t border-hairline pt-3">
                    {CATEGORIES.map((category) => {
                      const entries = archivesFor(edition.year, category);
                      if (entries.length === 0) return null;
                      return (
                        <div key={category} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="label text-muted-foreground">
                            {t(`archivesCategory.${category}`)}
                          </span>
                          {DOC_TYPES.map((type) => {
                            const entry = entries.find((item) => item.type === type);
                            if (!entry) return null;
                            return (
                              <a
                                key={type}
                                href={entry.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-text text-small text-link"
                              >
                                {t(`archivesType.${type}`)}
                              </a>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sable py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6">
          <h2 className="font-display text-h3 text-anthracite">{t("nationsTitle")}</h2>
          <p className="text-body text-encre">{t("nationsLead")}</p>
          <ul className="flex flex-wrap gap-2">
            {nations.map((nation) => (
              <li
                key={nation.countryCode}
                className="rounded-full border border-hairline bg-ivoire px-3 py-1 text-small text-anthracite"
              >
                {nation.name[typedLocale]}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
