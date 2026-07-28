import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import programmeData from "@/content/programme.json";
import type { Locale, Schedule } from "@/content/types";

const programme = programmeData as Schedule;

export async function ProgrammeTeaserSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Programme" });

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="flex flex-col gap-8 rounded-xl border border-hairline bg-card p-8 lg:p-10">
          <ol className="flex flex-col gap-6 sm:flex-row sm:gap-0">
            {programme.days.map((day, index) => (
              <li key={day.label.fr} className="relative flex flex-1 flex-col gap-2 sm:px-6">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 hidden h-px w-6 -translate-x-full bg-hairline sm:block"
                  />
                )}
                <span className="label-mono text-link">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-medium text-foreground">{day.label[locale]}</p>
              </li>
            ))}
          </ol>

          <p className="border-t border-hairline pt-6 text-body text-muted-foreground">
            {t("comingSoon")}
          </p>
        </div>

        <Link
          href="/programme"
          className="label-mono self-start text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
