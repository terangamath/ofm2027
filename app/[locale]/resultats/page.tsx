import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Results" });
  return metadonneesPage({ locale, chemin: "/resultats", titre: t("title") });
}

/** Résultats de l'édition 2027 : publiés à l'issue de la compétition. */
export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.Results" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <PageHero chemin="/resultats" title={t("title")} />

      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-body-l text-muted-foreground">{tCommon("contentComingSoon")}</p>
        </div>
      </section>
    </>
  );
}
