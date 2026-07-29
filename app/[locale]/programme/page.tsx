import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Callout } from "@/components/mdx/callout";
import programmeData from "@/content/programme.json";
import type { Locale, Schedule, ScheduleEventKind } from "@/content/types";

const programme = programmeData as Schedule;

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

  const kindLabel = (kind: ScheduleEventKind) => t(`kinds.${kind}`);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6">
          {programme.status === "coming_soon" && (
            <Callout status="coming_soon">{t("statusComingSoon")}</Callout>
          )}

          <div className="flex flex-col gap-14">
            {programme.days.map((day, dayIndex) => (
              <div key={day.label.fr} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 border-b border-hairline pb-4">
                  <span className="label-mono text-link">
                    {String(dayIndex + 1).padStart(2, "0")} — {day.date ?? t("dateTBC")}
                  </span>
                  <h2 className="font-display text-h3 text-foreground">{day.label[typedLocale]}</h2>
                </div>

                <ol className="flex flex-col gap-5">
                  {day.events.map((event, eventIndex) => (
                    <li
                      key={eventIndex}
                      className="flex flex-col gap-1.5 border-l-2 border-hairline pl-5"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="label-mono tabular-nums text-muted-foreground">
                          {event.time ?? t("timeTBC")}
                        </span>
                        <span className="label-mono rounded-full bg-accent/15 px-2 py-0.5 text-link">
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
