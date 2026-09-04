import type { Metadata } from "next";
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
  return { title: t("title"), description: t("lead") };
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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6">
          {problems.length === 0 ? (
            <ComingSoonPanel title={t("comingSoonTitle")} body={t("comingSoonBody")} />
          ) : (
            <div className="flex flex-col gap-4">
              {problems.map((problem) => (
                <Link
                  key={problem.slug}
                  href={`/problemes/${problem.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-hairline bg-card p-7 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="label-mono text-link">
                      {problem.category.toUpperCase()} · N°{problem.number}
                    </span>
                    <span className="label-mono text-muted-foreground">
                      {problem.hasSolution ? t("hasSolution") : t("noSolutionYet")}
                    </span>
                  </div>
                  <h2 className="font-display text-h4 text-foreground">{problem.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {problem.topics.map((topic) => (
                      <span
                        key={topic}
                        className="label-mono rounded-full border border-hairline px-2.5 py-0.5 text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <span className="label-mono mt-1 text-link group-hover:text-foreground">
                    {t("readProblem")} →
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
