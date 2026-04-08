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
          <div className="flex flex-col gap-2.5">
            {secondary.map((a) => (
              <ArticleCompact key={a.slug} article={a} />
            ))}
            <Link
              href="/actualites"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-gray-200 type-body-sm font-medium text-gris hover:border-vert/30 hover:text-vert hover:bg-vert-pale/20 transition-all duration-200 mt-auto"
            >
              Toutes les actualités
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
      className="group block bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200"
      aria-label={article.title}
    >
      {/* Barre catégorie + gradient subtil */}
      <div className={`h-1.5 ${CATEGORY_COLOR[article.category] ?? "bg-gray-200"}`} aria-hidden="true" />
      <div className="p-7 lg:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-1.5 type-label px-2.5 py-1 rounded-full border ${
            article.category === "annonce"
              ? "bg-vert/8 text-vert border-vert/15"
              : article.category === "resultat"
              ? "bg-or/10 text-or border-or/20"
              : "bg-gray-50 text-gris border-gray-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLOR[article.category] ?? "bg-gray-300"}`} aria-hidden="true" />
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          <time dateTime={article.date} className="text-xs text-gris/60 flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(article.date, { day: "numeric", month: "long", year: "numeric" })}
          </time>
        </div>
        <h3 className="type-h3 text-anthracite mb-3 group-hover:text-vert transition-colors duration-200">
          {article.title}
        </h3>
        <p className="type-body-sm text-gris max-w-[60ch] mb-6 leading-relaxed">{article.excerpt}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert group-hover:gap-2.5 transition-all duration-200">
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
      className="group flex gap-3.5 bg-blanc rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 hover:-translate-y-px transition-all duration-200"
      aria-label={article.title}
    >
      {/* Barre couleur catégorie */}
      <div className={`w-1 rounded-full flex-shrink-0 self-stretch ${CATEGORY_COLOR[article.category] ?? "bg-gray-200"}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="type-label text-gris">{CATEGORY_LABELS[article.category] ?? article.category}</span>
          <span className="text-gray-200" aria-hidden="true">·</span>
          <time dateTime={article.date} className="text-[10px] text-gris/50">
            {formatDate(article.date, { day: "numeric", month: "short" })}
          </time>
        </div>
        <h3 className="text-sm font-semibold text-anthracite leading-snug group-hover:text-vert transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
      </div>
      <div className="flex-shrink-0 mt-0.5">
        <ArrowRight className="w-3.5 h-3.5 text-gris/25 group-hover:text-vert group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
      </div>
    </Link>
  );
}
