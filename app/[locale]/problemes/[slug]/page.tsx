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
          className="label-mono self-start text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
        >
          ← {t("back")}
        </Link>

        <div className="flex flex-col gap-3 border-b border-hairline pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label-mono text-link">
              {frontmatter.category.toUpperCase()} · N°{frontmatter.number} · {frontmatter.edition}
            </span>
            <span className="label-mono text-muted-foreground">
              {frontmatter.hasSolution ? t("solutionAvailable") : t("solutionPending")}
            </span>
          </div>
          <h1 className="font-display text-display-l text-foreground">{frontmatter.title}</h1>
          <div className="flex flex-wrap gap-2">
            {frontmatter.topics.map((topic) => (
              <span
                key={topic}
                className="label-mono rounded-full border border-hairline px-2.5 py-0.5 text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <MdxContent source={content} />
      </div>
    </section>
  );
}
