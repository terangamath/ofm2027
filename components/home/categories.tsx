import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import { ReferenceCategories } from "@/components/shared/reference-categories";
import { evenement as eventInfo } from "@/lib/contenu";
import type { Locale } from "@/content/types";

/** Deux catégories en diptyque : un filet vertical, pas de boîtes. */
export async function CategoriesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Categories" });

  const notes: Record<string, string> = {
    junior: t("juniorNote"),
    senior: t("seniorNote"),
  };

  return (
    <section className="bg-surface-alt py-16 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
        <SectionHeading title={t("title")} lead={t("lead")} />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
          {eventInfo.categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex flex-col gap-4 ${index === 1 ? "md:border-l md:border-hairline md:pl-12" : "md:pr-12"}`}
            >
              <h3 className="font-display text-h2 text-foreground">{category.name[locale]}</h3>
              <p className="text-body-l text-muted-foreground">{category.scope[locale]}</p>
              <p className="max-w-md text-body text-foreground/85">{notes[category.id]}</p>
            </div>
          ))}
        </div>

        <ReferenceCategories locale={locale} className="-mt-4 max-w-2xl" />

        <Link href="/programme" className="link-text self-start text-link">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
