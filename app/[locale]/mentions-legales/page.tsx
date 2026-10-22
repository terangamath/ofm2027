import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";

const SECTIONS = ["Ip", "ContactRef"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Legal" });
  return metadonneesPage({ locale, chemin: "/mentions-legales", titre: t("title") });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.Legal" });

  return (
    <>
      <PageHero title={t("title")} />

      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6">
          {SECTIONS.map((section) => (
            <div key={section} className="flex flex-col gap-2 border-b border-hairline pb-8 last:border-b-0">
              <h2 className="font-display text-h4 text-foreground">{t(`${section}.title`)}</h2>
              <p className="text-body text-muted-foreground">{t(`${section}.body`)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
