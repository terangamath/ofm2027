import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import { partenairesAffiches } from "@/lib/contenu";
import type { Locale, PartnerCategory, PartnerLogo } from "@/content/types";

const CATEGORY_ORDER: (PartnerCategory | null)[] = ["institutionnel", "financier", "technique", null];
const CATEGORY_LABEL_KEY: Record<PartnerCategory, string> = {
  institutionnel: "categoryInstitutional",
  financier: "categoryFinancial",
  technique: "categoryTechnical",
};

/**
 * Taille optique d'un logo : à surface égale plutôt qu'à hauteur égale, un
 * logo carré paraîtrait sinon minuscule à côté d'un logotype allongé. La
 * hauteur est bornée (un carré ne déborde pas de sa plaque, un bandeau très
 * long ne devient pas un fil), la largeur suit le rapport d'aspect du fichier.
 */
const SURFACE = 6000;
const HAUTEUR = { min: 28, max: 72 };
const LARGEUR_MAX = 184;

function tailleOptique({ width, height }: PartnerLogo): { largeur: number; hauteur: number } {
  const rapport = width / height;
  let hauteur = Math.min(HAUTEUR.max, Math.max(HAUTEUR.min, Math.sqrt(SURFACE / rapport)));
  if (hauteur * rapport > LARGEUR_MAX) hauteur = LARGEUR_MAX / rapport;
  return { largeur: Math.round(hauteur * rapport), hauteur: Math.round(hauteur) };
}

/**
 * Partenaires : les logos fournis par l'association, chacun sur une plaque
 * blanche de même hauteur, dans les deux thèmes — ce sont des marques tierces,
 * sans version claire : on ne les recolore pas, on leur donne un fond.
 * Seuls les partenaires confirmés et pourvus d'un logo sont rendus ; sans
 * aucun, la section n'existe pas.
 */
export async function PartnersSection({ locale }: { locale: Locale }) {
  if (partenairesAffiches.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "Home.Partners" });
  // Un intitulé de catégorie n'aide que s'il en départage plusieurs.
  const categoriesPresentes = new Set(partenairesAffiches.map((partner) => partner.category));
  const avecIntitules = categoriesPresentes.size > 1;

  return (
    <section className="bg-surface py-16 text-foreground lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
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
                <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
                  {items.map((partner) => {
                    const { largeur, hauteur } = tailleOptique(partner.logo);
                    const logo = (
                      <Image
                        src={partner.logo.src}
                        alt={partner.name[locale]}
                        width={largeur}
                        height={hauteur}
                        style={{ width: largeur, height: hauteur }}
                      />
                    );
                    // La plaque (fond blanc, cadre) est un support décoratif porté par le
                    // <li> ; le lien, identifié par le logo, la remplit. Encre anthracite :
                    // la couleur héritée du thème sombre (sable) tomberait sur du blanc.
                    // Anneau de focus à l'intérieur de la plaque, en or d'encre : il se lit
                    // sur le blanc dans les deux thèmes (l'or clair du sombre y ferait 1,6:1).
                    const contenu =
                      "flex h-24 w-full items-center justify-center rounded-md px-6 text-anthracite focus-visible:outline-or-encre focus-visible:-outline-offset-4";
                    return (
                      <li
                        key={partner.id}
                        className="flex min-w-36 rounded-md border border-border bg-blanc has-[a:hover]:border-foreground/40"
                      >
                        {partner.url ? (
                          <a href={partner.url} target="_blank" rel="noopener noreferrer" className={contenu}>
                            {logo}
                          </a>
                        ) : (
                          <span className={contenu}>{logo}</span>
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
