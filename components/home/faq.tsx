import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import type { Locale } from "@/content/types";

export async function FaqSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Faq" });

  return (
    <section className="bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
        <SectionHeading title={t("title")} lead={t("lead")} align="center" />
        <FaqAccordion locale={locale} />
      </div>
    </section>
  );
}
