import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

const BLOCKS = ["Venue", "Travel", "Visa", "Accommodation"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.PracticalInfo" });
  return { title: t("title"), description: t("lead") };
}

export default async function PracticalInfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.PracticalInfo" });

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-hairline pb-6">
            <span className="label-mono text-muted-foreground">
              {eventInfo.city[typedLocale]}, {eventInfo.country[typedLocale]}
            </span>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="label-mono text-muted-foreground">
              {eventInfo.dates?.[typedLocale]}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {BLOCKS.map((block) => (
              <div
                key={block}
                className="flex flex-col gap-3 rounded-xl border border-hairline bg-card p-8"
              >
                <span className="label-mono text-link">{t(`${block}.eyebrow`)}</span>
                <h2 className="font-display text-h4 text-foreground">{t(`${block}.title`)}</h2>
                <p className="text-body text-muted-foreground">{t(`${block}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
