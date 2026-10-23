import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";
import { Link } from "@/i18n/navigation";
import { getProblems } from "@/lib/content";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Problems" });
  return metadonneesPage({ locale, chemin: "/problemes", titre: t("title"), description: t("lead") });
}

export default async function ProblemsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Problems" });
  const problems = getProblems(typedLocale);

  return (
    <>
      <PageHero chemin="/problemes" title={t("title")} lead={t("lead")} />

      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          {problems.length === 0 ? (
            <ComingSoonPanel title={t("comingSoonTitle")} body={t("comingSoonBody")} />
          ) : (
            <div className="flex flex-col gap-4">
              {problems.map((problem) => (
                <Link
                  key={problem.slug}
                  href={`/problemes/${problem.slug}`}
                  className="group flex flex-col gap-3 border-b border-hairline py-6 hover:text-primary"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="label text-link">
                      {t(`category.${problem.category}`)} · <span className="data">nº {problem.number}</span>
                    </span>
                    <span className="label text-muted-foreground">
                      {problem.hasSolution ? t("hasSolution") : t("noSolutionYet")}
                    </span>
                  </div>
                  <h2 className="font-display text-h4 text-foreground">{problem.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {problem.topics.map((topic) => (
                      <span
                        key={topic}
                        className="label rounded-full border border-hairline px-2.5 py-0.5 text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <span className="link-text mt-1 self-start text-link">
                    {t("readProblem")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
