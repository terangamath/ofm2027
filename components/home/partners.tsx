import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { partenairesAffiches } from "@/lib/contenu";
import type { Locale, PartnerCategory } from "@/content/types";

const CATEGORY_ORDER: (PartnerCategory | null)[] = ["institutionnel", "financier", "technique", null];
const CATEGORY_LABEL_KEY: Record<PartnerCategory, string> = {
  institutionnel: "categoryInstitutional",
  financier: "categoryFinancial",
  technique: "categoryTechnical",
};

/** Hauteur d'affichage commune à tous les logos ; la largeur suit le rapport d'aspect du fichier. */
const HAUTEUR_LOGO = 48;

/**
 * Partenaires : les logos fournis par l'association, à hauteur égale, sur une
 * bande entre deux filets. Seuls les partenaires confirmés et pourvus d'un logo sont
 * rendus ; sans aucun, la section n'existe pas.
 */
export async function PartnersSection({ locale }: { locale: Locale }) {
  if (partenairesAffiches.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "Home.Partners" });
  // Un intitulé de catégorie n'aide que s'il en départage plusieurs.
  const categoriesPresentes = new Set(partenairesAffiches.map((partner) => partner.category));
  const avecIntitules = categoriesPresentes.size > 1;

  return (
    <section className="bg-surface py-16 text-foreground lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading title={t("title")} lead={t("lead")} />

        <div className="flex flex-col gap-8">
          {CATEGORY_ORDER.map((category) => {
            const items = partenairesAffiches.filter((partner) => partner.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category ?? "autres"} className="flex flex-col gap-3">
                {avecIntitules && category && (
                  <h3 className="label text-muted-foreground">{t(CATEGORY_LABEL_KEY[category])}</h3>
                )}
                <ul className="flex flex-wrap items-center gap-x-12 gap-y-8 border-y border-hairline py-8">
                  {items.map((partner) => {
                    const largeur = Math.round((HAUTEUR_LOGO * partner.logo.width) / partner.logo.height);
                    const logo = (
                      <Image
                        src={partner.logo.src}
                        alt={partner.name[locale]}
                        width={largeur}
                        height={HAUTEUR_LOGO}
                        className="h-12 w-auto max-w-full object-contain"
                      />
                    );
                    return (
                      <li key={partner.id} className="flex items-center">
                        {partner.url ? (
                          <a href={partner.url} target="_blank" rel="noopener noreferrer" className="rounded-sm">
                            {logo}
                          </a>
                        ) : (
                          logo
                        )}
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
