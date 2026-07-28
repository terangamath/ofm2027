import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import type { Locale } from "@/content/types";

export async function FaqSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Faq" });

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} align="center" />
        <FaqAccordion locale={locale} />
      </div>
    </section>
  );
}
