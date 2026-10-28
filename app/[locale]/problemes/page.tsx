import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IntroCompacte } from "@/components/layout/intro-compacte";
import { CarteProbleme } from "@/components/problemes/carte-probleme";
import { OngletsProblemes, type CategorieProblemes } from "@/components/problemes/onglets-problemes";
import { getEnonces, getPdfArchive } from "@/lib/content";
import { evenement } from "@/lib/contenu";
import type { Locale, ProblemCategory } from "@/content/types";

const CATEGORIES: ProblemCategory[] = ["junior", "senior"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Problems" });
  return metadonneesPage({ locale, chemin: "/problemes", titre: t("title"), description: t("lead") });
}

/**
 * Problèmes et solutions de l'édition en cours : énoncés de content/problemes/
 * (statut `published`), un à la fois derrière deux niveaux d'onglets, chacun
 * suivi de son corrigé PDF. Énoncés complets et corrigés viennent de
 * content/archives.json ; ce qui manque est annoncé, jamais inventé.
 * L'ancienne adresse /solutions redirige ici (next.config.ts).
 */
export default async function ProblemsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Problems" });
  const edition = evenement.edition;
  const enonces = getEnonces(typedLocale, edition);
  const onglets = [1, 2, 3, 4].map((n) => t("problem", { n }));

  const categories: CategorieProblemes[] = CATEGORIES.map((category) => {
    const nom = t(`category.${category}`);
    return {
      id: category,
      label: nom,
      pdf: getPdfArchive(edition, category, "sujet"),
      pdfTexte: t("pdf", { category: nom }),
      pdfLabel: t("pdfLabel", { category: nom }),
      problemes: enonces[category].map((enonce, i) => {
        const n = i + 1;
        return (
          <CarteProbleme
            key={n}
            id={`solution-${category}-${n}`}
            enonce={enonce}
            solution={getPdfArchive(edition, category, "solutions", n)}
            locale={typedLocale}
            libelles={{
              repere: t("marker", { category: nom, n }),
              numero: onglets[i],
              author: enonce?.frontmatter.author ? t("author", { name: enonce.frontmatter.author }) : null,
              pending: t("pending"),
              solutionTitle: t("solutionTitle", { n }),
              solutionFormat: t("solutionFormat"),
              solutionDownload: t("solutionDownload"),
              solutionDownloadLabel: t("solutionDownloadLabel", { category: nom, n }),
              solutionPending: t("solutionPending"),
            }}
          />
        );
      }),
    };
  });

  return (
    <>
      <IntroCompacte title={t("title")} lead={t("lead")} />
      <section className="bg-entete-fond pt-8 pb-16 text-foreground lg:pt-10 lg:pb-20">
        {/* Un seul bloc centré : onglets, bouton PDF et carte partagent la même largeur. */}
        <div className="mx-auto box-border w-full max-w-[75rem] px-4 sm:px-6">
          <OngletsProblemes
            categories={categories}
            libelles={{
              categories: t("categoriesLabel"),
              problemes: {
                junior: t("problemsLabel", { category: t("category.junior") }),
                senior: t("problemsLabel", { category: t("category.senior") }),
              },
              onglets,
              pdfPending: t("pdfPending"),
            }}
          />
        </div>
      </section>
    </>
  );
}
