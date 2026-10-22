import { getTranslations } from "next-intl/server";
import { documents } from "@/lib/contenu";
import type { Locale } from "@/content/types";

/** Règlement général de l'IMO, auquel renvoie l'art. 4.4 du règlement OFM (clause 2.2). */
const REGLEMENT_IMO = "https://www.imo-official.org/documents/RegulationsIMO.pdf";

const reglementOfm = documents.find((doc) => doc.id === "reglement-2025");

/**
 * Source des conditions d'âge et de scolarité des catégories : les professeurs
 * qui sélectionnent leurs élèves doivent pouvoir remonter au texte.
 */
export async function ReferenceCategories({ locale, className }: { locale: Locale; className?: string }) {
  const t = await getTranslations({ locale, namespace: "Common" });
  return (
    <p className={`text-small text-muted-foreground ${className ?? ""}`}>
      {t.rich("categoriesReference", {
        ofm: (chunks) =>
          reglementOfm ? (
            <a href={reglementOfm.path} target="_blank" rel="noopener noreferrer" className="link-text text-link">
              {chunks}
            </a>
          ) : (
            chunks
          ),
        imo: (chunks) => (
          <a href={REGLEMENT_IMO} target="_blank" rel="noopener noreferrer" className="link-text text-link">
            {chunks}
          </a>
        ),
      })}
    </p>
  );
}
