import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import partnersData from "@/content/partenaires.json";
import type { Locale, Partner, PartnerCategory } from "@/content/types";

const partners = partnersData as Partner[];

const CATEGORY_ORDER: PartnerCategory[] = ["institutionnel", "financier", "technique"];
const CATEGORY_LABEL_KEY: Record<PartnerCategory, string> = {
  institutionnel: "categoryInstitutional",
  financier: "categoryFinancial",
  technique: "categoryTechnical",
};

export async function PartnersSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Partners" });

  return (
    <section className="bg-sable py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading title={t("title")} lead={t("lead")} tone="warm" />

        <div className="flex flex-col gap-12">
          {CATEGORY_ORDER.map((category) => {
            const items = partners.filter((partner) => partner.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-5">
                <h3 className="label text-encre">{t(CATEGORY_LABEL_KEY[category])}</h3>
                <div className="flex flex-wrap gap-4">
                  {items.map((partner) => (
                    <div
                      key={partner.id}
                      className={`flex min-h-24 min-w-56 flex-1 items-center justify-between gap-4 rounded-lg border bg-card px-6 py-5 sm:flex-none ${
                        partner.status === "confirmed"
                          ? "border-hairline"
                          : "border-dashed border-border"
                      }`}
                    >
                      <span
                        className={`font-display text-h4 ${
                          partner.status === "confirmed"
                            ? "text-foreground"
                            : "text-muted-foreground italic"
                        }`}
                      >
                        {partner.name[locale]}
                      </span>
                      {partner.status === "pending" && (
                        <span className="label shrink-0 text-muted-foreground">
                          {t("statusPending")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
