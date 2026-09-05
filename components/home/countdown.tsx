import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { CountdownTimer } from "@/components/home/countdown-timer";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";

export async function CountdownSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Countdown" });

  return (
    <section className="bg-vert py-24 text-ivoire lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 text-center">
        <SectionHeading title={t("title")} lead={t("lead")} align="center" tone="inverted" />

        {eventInfo.datesConfirmed && eventInfo.startDate ? (
          <CountdownTimer
            targetDate={eventInfo.startDate}
            groupLabel={t("title")}
            labels={{
              days: t("days"),
              hours: t("hours"),
              minutes: t("minutes"),
              seconds: t("seconds"),
            }}
          />
        ) : (
          <div className="flex gap-6 sm:gap-10" role="group" aria-label={t("title")}>
            {[t("days"), t("hours"), t("minutes"), t("seconds")].map((label) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="font-display text-display-l tabular-nums text-or-clair" aria-hidden>
                  —
                </span>
                <span className="label text-ivoire/60">{label}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-small text-ivoire/50">
          {eventInfo.datesConfirmed ? eventInfo.dates?.[locale] : t("datesPending")}
        </p>
      </div>
    </section>
  );
}
