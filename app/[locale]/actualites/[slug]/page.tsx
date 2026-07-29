import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getNews, getNewsBySlug } from "@/lib/content";
import type { Locale } from "@/content/types";

const DATE_FORMAT: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

export function generateStaticParams() {
  return getNews("fr").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getNewsBySlug(locale === "en" ? "en" : "fr", slug);
  if (!doc) return {};
  return { title: doc.frontmatter.title, description: doc.frontmatter.excerpt };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.NewsDetail" });
  const doc = getNewsBySlug(typedLocale, slug);

  if (!doc) notFound();

  const { frontmatter, content } = doc;
  const formatter = new Intl.DateTimeFormat(DATE_FORMAT[typedLocale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <Link
          href="/actualites"
          className="label-mono self-start text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
        >
          ← {t("back")}
        </Link>

        <div className="flex flex-col gap-3 border-b border-hairline pb-8">
          <div className="label-mono flex items-center gap-3 text-muted-foreground">
            <time dateTime={frontmatter.date} className="tabular-nums">
              {formatter.format(new Date(frontmatter.date))}
            </time>
            <span aria-hidden>·</span>
            <span>{frontmatter.type}</span>
          </div>
          <h1 className="font-display text-display-l text-foreground">{frontmatter.title}</h1>
        </div>

        <MdxContent source={content} />
      </div>
    </section>
  );
}
