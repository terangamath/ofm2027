import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Constellation } from "@/components/motifs/constellation";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Hero" });
  const categories = eventInfo.categories.map((category) => category.name[locale]).join(" · ");

  return (
    <section className="relative isolate overflow-hidden bg-vert-nuit text-ivoire">
      <Constellation className="absolute inset-0 h-full w-full opacity-80" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vert-nuit from-10% via-vert-nuit/50 via-60% to-transparent"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-28 lg:py-36">
        <p className="label-mono text-or-clair">{t("eyebrow")}</p>

        <h1 className="max-w-4xl text-display-xl font-display">{t("title")}</h1>

        <p className="max-w-2xl text-body-l text-ivoire/80">{t("lead")}</p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/olympiade"
            className="inline-flex items-center justify-center rounded-md bg-or px-6 py-3 text-sm font-medium text-vert-nuit transition-colors duration-150 hover:bg-or-clair"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/equipes"
            className="inline-flex items-center justify-center rounded-md border border-ivoire/25 px-6 py-3 text-sm font-medium text-ivoire transition-colors duration-150 hover:border-ivoire/60"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-ivoire/15 pt-8 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <dt className="label-mono text-ivoire/50">{t("metaLocation")}</dt>
            <dd className="text-body font-medium">
              {eventInfo.city[locale]}, {eventInfo.country[locale]}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="label-mono text-ivoire/50">{t("metaLanguage")}</dt>
            <dd className="text-body font-medium">{eventInfo.officialLanguage[locale]}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="label-mono text-ivoire/50">{t("metaFormat")}</dt>
            <dd className="text-body font-medium">{categories}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
