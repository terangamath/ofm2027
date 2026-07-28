import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

export async function CategoriesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Categories" });

  const notes: Record<string, string> = {
    junior: t("juniorNote"),
    senior: t("seniorNote"),
  };

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {eventInfo.categories.map((category, index) => {
            const inverted = index === 1;
            return (
              <div
                key={category.id}
                className={`flex flex-col gap-6 rounded-xl border p-8 lg:p-10 ${
                  inverted
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-hairline bg-card text-card-foreground"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-1 w-12 rounded-full ${inverted ? "bg-primary-foreground/60" : "bg-accent"}`}
                />
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-h3">{category.name[locale]}</h3>
                  <p className={inverted ? "text-primary-foreground/70" : "text-muted-foreground"}>
                    {category.scope[locale]}
                  </p>
                </div>
                <p className={`text-body ${inverted ? "text-primary-foreground/85" : "text-foreground/80"}`}>
                  {notes[category.id]}
                </p>
              </div>
            );
          })}
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
