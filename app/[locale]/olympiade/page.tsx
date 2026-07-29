import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/home/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Olympiad" });
  return { title: t("title"), description: t("lead") };
}

export default async function OlympiadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Olympiad" });

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6">
          <SectionHeading eyebrow={t("Presentation.eyebrow")} title={t("Presentation.title")} />
          <p className="text-body-l text-foreground/85">{t("Presentation.body1")}</p>
          <p className="text-body-l text-foreground/85">{t("Presentation.body2")}</p>
        </div>
      </section>

      <section className="bg-sable py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
          <SectionHeading
            eyebrow={t("Format.eyebrow")}
            title={t("Format.title")}
            lead={t("Format.lead")}
            tone="warm"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {eventInfo.categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-3 rounded-xl border border-hairline bg-card p-8"
              >
                <h3 className="font-display text-h3 text-foreground">
                  {category.name[typedLocale]}
                </h3>
                <p className="text-muted-foreground">{category.scope[typedLocale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6">
          <SectionHeading
            eyebrow={t("Faq.eyebrow")}
            title={t("Faq.title")}
            lead={t("Faq.lead")}
            align="center"
          />
          <FaqAccordion locale={typedLocale} />
        </div>
      </section>
    </>
  );
}
