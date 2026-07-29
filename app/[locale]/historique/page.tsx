import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import editionsData from "@/content/editions.json";
import type { Edition, Locale } from "@/content/types";

const editions = editionsData as Edition[];

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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

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
                {edition.countriesCount !== null && (
                  <p className="label-mono text-muted-foreground">
                    {edition.countriesCount} {t("countriesLabel")}
                  </p>
                )}
                {edition.note && (
                  <p className="text-body text-muted-foreground">{edition.note[typedLocale]}</p>
                )}
                {edition.status === "coming_soon" && (
                  <span className="label-mono self-start rounded-full bg-accent/15 px-2.5 py-0.5 text-link">
                    {tCommon("comingSoon")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
