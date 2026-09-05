import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { evenement as eventInfo, statistiques as stats } from "@/lib/contenu";
import type { Locale } from "@/content/types";

/**
 * La fiche de l'événement et ses chiffres, réunis : une fiche à gauche,
 * une ligne de chiffres en travers. Pas de tuiles.
 */
export async function FicheSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Event" });
  const tStats = await getTranslations({ locale, namespace: "Home.Stats" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const hasProvisional = stats.some((stat) => stat.provisional);

  const rows = [
    {
      label: t("organizer"),
      value: `${eventInfo.organizer} — ${eventInfo.city[locale]}, ${eventInfo.country[locale]}`,
    },
    {
      label: t("dates"),
      value: eventInfo.dates?.[locale] ?? tCommon("toBeConfirmed"),
      data: eventInfo.datesConfirmed,
    },
    { label: t("language"), value: eventInfo.officialLanguage[locale] },
    {
      label: t("format"),
      value: eventInfo.categories.map((category) => category.name[locale]).join(" · "),
    },
  ];

  return (
    <section className="bg-sable py-20 text-anthracite lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="font-display text-display-l leading-none text-vert" aria-hidden>
              {eventInfo.edition}
            </p>
            <SectionHeading title={t("title")} lead={t("lead")} tone="warm" />
          </div>

          <dl className="flex flex-col self-end">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(8rem,10rem)_1fr] items-baseline gap-6 border-b border-hairline py-4 first:border-t"
              >
                <dt className="label text-encre">{row.label}</dt>
                <dd className={row.data ? "data text-body-l text-vert" : "text-body-l font-medium text-anthracite"}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Une ligne de chiffres entre deux filets, pas une grille de tuiles. */}
        <div className="flex flex-col gap-3">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-hairline py-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label.fr} className="flex flex-col gap-1">
                <dd className="font-display text-h2 leading-none tabular-nums text-vert">{stat.value}</dd>
                <dt className="text-small text-encre">
                  {stat.label[locale]}
                  {stat.provisional && <span aria-hidden> *</span>}
                </dt>
              </div>
            ))}
          </dl>
          {hasProvisional && <p className="text-small text-encre">* {tStats("provisionalNote")}</p>}
        </div>
      </div>
    </section>
  );
}
