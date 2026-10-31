import { getTranslations } from "next-intl/server";
import { CalendarDays, FileText } from "lucide-react";
import { Flag } from "@/components/shared/flag";
import type { ArchiveDocumentType, Edition, Locale, ProblemCategory } from "@/content/types";

const CATEGORIES: ProblemCategory[] = ["junior", "senior"];
const DOCUMENTS: ArchiveDocumentType[] = ["sujet", "solutions", "resultats"];

/** Chemin de chaque document de l'édition, ou null s'il n'est pas déposé. */
export type DocumentsEdition = Record<ArchiveDocumentType, Record<ProblemCategory, string | null>>;

const TITRE_RUBRIQUE = "text-h4 font-semibold text-vert-profond dark:text-primary";

/**
 * Fiche d'une édition passée : un résumé compact (drapeau, « OFM 2025 — France »,
 * dates, badges d'effectifs), puis les pays participants par catégorie et les
 * archives PDF. Une donnée non publiée s'affiche « À compléter », un document
 * absent « Document indisponible », sans lien ni chiffre de remplacement.
 */
export async function FicheEdition({
  edition,
  locale,
  noms,
  documents,
}: {
  edition: Edition;
  locale: Locale;
  /** Nom localisé de chaque pays, par code ISO. */
  noms: Record<string, string>;
  documents: DocumentsEdition;
}) {
  const t = await getTranslations({ locale, namespace: "Pages.History" });
  const { year, competitors, participants } = edition;
  const aCompleter = <span className="font-normal text-muted-foreground italic">{t("toComplete")}</span>;

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 rounded-md border border-hairline bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h2 className="flex items-center gap-2.5 text-[1.25rem] leading-snug font-bold text-vert-profond sm:text-[1.375rem] dark:text-primary">
            <Flag countryCode={edition.hostCode} size={28} className="ring-1 ring-hairline" />
            {t("edition", { year, host: edition.host[locale] })}
          </h2>
          <p className="flex items-center gap-1.5 text-small text-muted-foreground">
            <CalendarDays aria-hidden className="size-4 shrink-0 text-or-encre dark:text-or" />
            <span className="sr-only">{t("dates")} </span>
            {edition.dates ? <span className="data text-foreground">{edition.dates[locale]}</span> : aCompleter}
          </p>
        </div>
        <dl className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <div
              key={category}
              className="inline-flex items-baseline gap-1.5 rounded-sm border border-hairline bg-entete-fond px-2.5 py-1 text-small"
            >
              <dt className="font-semibold text-or-encre dark:text-or-clair">{t(`category.${category}`)}</dt>
              <dd className="font-bold tabular-nums text-vert-profond dark:text-primary">
                {competitors ? (
                  <>
                    {competitors[category]}
                    <span className="ml-1 font-normal text-muted-foreground">{t("competitorsUnit")}</span>
                  </>
                ) : (
                  aCompleter
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="flex flex-col gap-4">
        <h3 className={`${TITRE_RUBRIQUE} flex flex-wrap items-baseline gap-x-3`}>
          {t("participants")}
          {!participants && edition.countriesCount !== null && (
            <span className="text-small font-normal text-muted-foreground">
              {t("countriesTotal", { count: edition.countriesCount })}
            </span>
          )}
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex flex-col gap-3">
              <h4 className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2 font-semibold text-foreground">
                {t(`category.${category}`)}
                {participants && (
                  <span className="text-small font-normal text-muted-foreground">
                    {t("participantsCount", { count: participants[category].length })}
                  </span>
                )}
              </h4>
              {participants ? (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {participants[category].map((code) => (
                    <li key={code} className="flex min-w-0 items-center gap-2 text-body text-foreground">
                      <Flag countryCode={code} size={20} />
                      <span className="min-w-0 break-words">{noms[code] ?? code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-body">{aCompleter}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className={TITRE_RUBRIQUE}>{t("archives")}</h3>
        <ul className="flex flex-col">
          {DOCUMENTS.map((type) => {
            const chemins = documents[type];
            const aucun = CATEGORIES.every((category) => !chemins[category]);
            return (
              <li
                key={type}
                className="flex flex-col gap-2 border-b border-hairline py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  <FileText aria-hidden className="size-5 shrink-0 text-or-encre dark:text-or" />
                  {t(`archivesType.${type}`)}
                </span>
                {aucun ? (
                  <span className="text-small text-muted-foreground">{t("unavailable")}</span>
                ) : (
                  <span className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => {
                      const chemin = chemins[category];
                      return chemin ? (
                        <a
                          key={category}
                          href={chemin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("archiveLabel", {
                            type: t(`archivesType.${type}`),
                            category: t(`category.${category}`),
                            year,
                          })}
                          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-vert-profond px-4 font-semibold text-vert-profond transition-colors hover:bg-vert-profond hover:text-blanc dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
                        >
                          {t(`category.${category}`)}
                          <span className="text-small font-normal">{t("pdf")}</span>
                        </a>
                      ) : (
                        <span
                          key={category}
                          className="inline-flex min-h-11 items-center rounded-md border border-dashed border-hairline px-4 text-small text-muted-foreground"
                        >
                          {t("unavailableCategory", { category: t(`category.${category}`) })}
                        </span>
                      );
                    })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
