import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

export async function CountdownSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Countdown" });

  const units = [
    { label: t("days") },
    { label: t("hours") },
    { label: t("minutes") },
    { label: t("seconds") },
  ];

  return (
    <section className="bg-vert py-24 text-ivoire lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 text-center">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} align="center" tone="inverted" />

        <div className="flex gap-6 sm:gap-10" role="group" aria-label={t("title")}>
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center gap-2">
              <span className="font-display text-display-l tabular-nums text-or-clair" aria-hidden>
                —
              </span>
              <span className="label-mono text-ivoire/60">{unit.label}</span>
            </div>
          ))}
        </div>

        <p className="text-small text-ivoire/50">
          {eventInfo.datesConfirmed ? eventInfo.dates?.[locale] : t("datesPending")}
        </p>
      </div>
    </section>
  );
}
