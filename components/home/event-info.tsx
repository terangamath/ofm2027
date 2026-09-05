import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";

export async function EventInfoSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Event" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const rows = [
    {
      label: t("organizer"),
      value: `${eventInfo.organizer} — ${eventInfo.city[locale]}, ${eventInfo.country[locale]}`,
    },
    {
      label: t("dates"),
      value: eventInfo.datesConfirmed
        ? eventInfo.dates?.[locale]
        : (eventInfo.dates?.[locale] ?? tCommon("toBeConfirmed")),
      pending: !eventInfo.datesConfirmed,
    },
    { label: t("language"), value: eventInfo.officialLanguage[locale] },
    {
      label: t("format"),
      value: eventInfo.categories.map((category) => category.name[locale]).join(" · "),
    },
  ];

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-8">
          <SectionHeading title={t("title")} lead={t("lead")} />
          <p className="font-display text-display-l text-primary" aria-hidden>
            {eventInfo.edition}
          </p>
        </div>

        <dl className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 border-b border-hairline py-5 first:pt-0 last:border-b-0"
            >
              <dt className="label text-muted-foreground">{row.label}</dt>
              <dd
                className={`text-body-l ${
                  row.pending ? "italic text-muted-foreground" : "font-medium text-foreground"
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
