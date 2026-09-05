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
  const t = await getTranslations({ locale, namespace: "Pages.Gallery" });
  return { title: t("title"), description: t("lead") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.Gallery" });

  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} />

      <section className="bg-sable pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <ComingSoonPanel title={t("comingSoonTitle")} body={t("comingSoonBody")} />
        </div>
      </section>
    </>
  );
}
