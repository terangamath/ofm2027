import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { partenaires as partners } from "@/lib/contenu";
import type { Locale, PartnerCategory } from "@/content/types";

const CATEGORY_ORDER: PartnerCategory[] = ["institutionnel", "financier", "technique"];
const CATEGORY_LABEL_KEY: Record<PartnerCategory, string> = {
  institutionnel: "categoryInstitutional",
  financier: "categoryFinancial",
  technique: "categoryTechnical",
};

/** Partenaires : des noms composés en Fraunces sur des lignes filetées, pas de logos fantômes. */
export async function PartnersSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Partners" });

  return (
    <section className="bg-sable py-16 text-anthracite lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading title={t("title")} lead={t("lead")} tone="warm" />

        <div className="flex flex-col gap-8">
          {CATEGORY_ORDER.map((category) => {
            const items = partners.filter((partner) => partner.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="flex flex-col">
                <h3 className="label pb-3 text-encre">{t(CATEGORY_LABEL_KEY[category])}</h3>
                <ul className="flex flex-col">
                  {items.map((partner) => {
                    const pending = partner.status === "pending";
                    const nom = (
                      <span className={`font-display text-h4 ${pending ? "text-encre" : "text-anthracite"}`}>
                        {partner.name[locale]}
                      </span>
                    );
                    return (
                      <li
                        key={partner.id}
                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-hairline py-4 last:border-b"
                      >
                        {partner.url && !pending ? (
                          <a href={partner.url} target="_blank" rel="noopener noreferrer" className="link-text">
                            {nom}
                          </a>
                        ) : (
                          nom
                        )}
                        {pending && <span className="label text-encre">{t("statusPending")}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
