import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Results" });
  return { title: t("title"), description: t("lead") };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.Results" });

  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <ComingSoonPanel title={t("comingSoonTitle")} body={t("comingSoonBody")} />
        </div>
      </section>
    </>
  );
}
