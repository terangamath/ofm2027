import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getProblemBySlug, getProblems } from "@/lib/content";

export function generateStaticParams() {
  return getProblems("fr").map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getProblemBySlug(locale === "en" ? "en" : "fr", slug);
  if (!doc) return {};
  return { title: doc.frontmatter.title };
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.ProblemDetail" });
  const doc = getProblemBySlug(locale === "en" ? "en" : "fr", slug);

  if (!doc) notFound();

  const { frontmatter, content } = doc;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <Link
          href="/problemes"
          className="link-text self-start text-link"
        >
          {t("back")}
        </Link>

        <div className="flex flex-col gap-3 border-b border-hairline pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label text-link">
              {t(`category.${frontmatter.category}`)} · <span className="data">nº {frontmatter.number} · {frontmatter.edition}</span>
            </span>
            <span className="label text-muted-foreground">
              {frontmatter.hasSolution ? t("solutionAvailable") : t("solutionPending")}
            </span>
          </div>
          <h1 className="font-display text-display-l text-foreground">{frontmatter.title}</h1>
          <div className="flex flex-wrap gap-2">
            {frontmatter.topics.map((topic) => (
              <span
                key={topic}
                className="label rounded-full border border-hairline px-2.5 py-0.5 text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <MdxContent source={content} locale={locale === "en" ? "en" : "fr"} />
      </div>
    </section>
  );
}
