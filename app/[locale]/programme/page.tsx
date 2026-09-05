import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import type { Locale, ScheduleEventKind } from "@/content/types";
import { programme } from "@/lib/contenu";

const DATE_FORMAT: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Programme" });
  return { title: t("title"), description: t("lead") };
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Programme" });
  const formatter = new Intl.DateTimeFormat(DATE_FORMAT[typedLocale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kindLabel = (kind: ScheduleEventKind) => t(`kinds.${kind}`);
  const formatDate = (date: string | null) => (date ? formatter.format(new Date(date)) : t("dateTBC"));

  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6">
          <div className="flex flex-col gap-14">
            {programme.days.map((day) => (
              <div key={day.label.fr} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 border-b border-hairline pb-4">
                  <span className="data text-link">{formatDate(day.date)}</span>
                  <h2 className="font-display text-h3 text-foreground">{day.label[typedLocale]}</h2>
                </div>

                <ol className="flex flex-col gap-5">
                  {day.events.map((event, eventIndex) => (
                    <li
                      key={eventIndex}
                      className="flex flex-col gap-1.5 border-l-2 border-hairline pl-5"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        {event.time && (
                          <span className="data text-muted-foreground">
                            {event.time}
                          </span>
                        )}
                        <span className="label rounded-full bg-accent/15 px-2.5 py-0.5 text-link">
                          {kindLabel(event.kind)}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{event.title[typedLocale]}</p>
                      {event.location && (
                        <p className="text-small text-muted-foreground">
                          {event.location[typedLocale]}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
