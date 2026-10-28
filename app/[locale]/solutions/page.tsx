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
  const t = await getTranslations({ locale, namespace: "Pages.Solutions" });
  return metadonneesPage({ locale, chemin: "/solutions", titre: t("title") });
}

/** Solutions de l'édition 2027 : publiées à l'issue de la compétition. */
export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.Solutions" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <PageHero chemin="/solutions" title={t("title")} />

      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-body-l text-muted-foreground">{tCommon("contentComingSoon")}</p>
        </div>
      </section>
    </>
  );
}
