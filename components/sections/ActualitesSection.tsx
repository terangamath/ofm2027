import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types/content";

interface ActualitesSectionProps {
  articles: NewsArticle[];
}

const CATEGORY_LABELS: Record<string, string> = {
  annonce: "Annonce",
  resultat: "Résultat",
  document: "Document",
  information: "Information",
};

const CATEGORY_COLOR: Record<string, string> = {
  annonce:     "bg-vert",
  resultat:    "bg-or",
  document:    "bg-gray-300",
  information: "bg-gray-300",
};

export function ActualitesSection({ articles }: ActualitesSectionProps) {
  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 2);

  return (
    <Section bg="sable">
      {/* En-tête */}
      <div className="flex items-end justify-between gap-6 mb-8">
        <SectionHeading
          label="Actualités"
          title="Dernières informations"
        />
        <Link
          href="/actualites"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert hover:text-vert-clair transition-colors flex-shrink-0"
        >
          Toutes les actualités
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {articles.length === 1 ? (
        <ArticleFeatured article={featured!} />
      ) : (
        <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          <ArticleFeatured article={featured!} />
          <div className="flex flex-col gap-3">
            {secondary.map((a) => (
              <ArticleCompact key={a.slug} article={a} />
            ))}
            <Link
              href="/actualites"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-200 type-body-sm text-gris hover:border-vert/30 hover:text-vert transition-colors mt-auto"
            >
              Toutes les annonces
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </Section>
  );
}

function ArticleFeatured({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group block bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
      aria-label={article.title}
    >
      <div className={`h-1 ${CATEGORY_COLOR[article.category] ?? "bg-gray-200"}`} aria-hidden="true" />
      <div className="p-7">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 type-label text-gris">
            <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLOR[article.category] ?? "bg-gray-300"}`} aria-hidden="true" />
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          <span className="text-gray-200" aria-hidden="true">·</span>
          <time dateTime={article.date} className="text-xs text-gris flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(article.date, { day: "numeric", month: "long", year: "numeric" })}
          </time>
        </div>
        <h3 className="type-h3 text-anthracite mb-3 group-hover:text-vert transition-colors">
          {article.title}
        </h3>
        <p className="type-body-sm text-gris max-w-[60ch] mb-5">{article.excerpt}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert group-hover:gap-2.5 transition-all">
          Lire la suite
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function ArticleCompact({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group flex gap-3 bg-blanc rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all"
      aria-label={article.title}
    >
      <div className={`w-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLOR[article.category] ?? "bg-gray-200"}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="type-label text-gris">{CATEGORY_LABELS[article.category] ?? article.category}</span>
          <time dateTime={article.date} className="text-[10px] text-gris/50">
            {formatDate(article.date, { day: "numeric", month: "short" })}
          </time>
        </div>
        <h3 className="text-sm font-semibold text-anthracite leading-snug group-hover:text-vert transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-gris/30 group-hover:text-vert flex-shrink-0 mt-0.5 transition-colors" aria-hidden="true" />
    </Link>
  );
}
