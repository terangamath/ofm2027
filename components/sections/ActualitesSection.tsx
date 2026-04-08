import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
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

const CATEGORY_VARIANTS: Record<string, "vert" | "or" | "gris" | "rouge"> = {
  annonce: "vert",
  resultat: "or",
  document: "gris",
  information: "gris",
};

export function ActualitesSection({ articles }: ActualitesSectionProps) {
  const t = useTranslations("sections");

  const displayed = articles.slice(0, 3);

  return (
    <section className="section-padding bg-sable">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            surtitre={t("actualites")}
            titre="Dernières actualités"
            sousTitre="Suivez toutes les annonces et informations de l'OFM 2027."
          />
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair transition-colors flex-shrink-0"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {displayed.length === 0 ? (
          <p className="text-gris text-center py-8">Aucune actualité pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((article, idx) => (
              <ArticleCard key={article.slug} article={article} featured={idx === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  featured,
}: {
  article: NewsArticle;
  featured: boolean;
}) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={`group bg-blanc rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 flex flex-col ${featured ? "md:col-span-1" : ""}`}
      aria-label={`Lire : ${article.title}`}
    >
      {/* Bande colorée */}
      <div
        className={`h-1 ${article.category === "annonce" ? "bg-vert" : article.category === "resultat" ? "bg-or" : "bg-gray-200"}`}
        aria-hidden="true"
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Catégorie + Date */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={CATEGORY_VARIANTS[article.category] ?? "gris"}>
            {CATEGORY_LABELS[article.category] ?? article.category}
          </Badge>
          <time
            dateTime={article.date}
            className="text-xs text-gris flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(article.date, { day: "numeric", month: "short", year: "numeric" })}
          </time>
        </div>

        {/* Titre */}
        <h3 className="font-serif text-base font-bold text-anthracite leading-tight mb-2 group-hover:text-vert transition-colors">
          {article.title}
        </h3>

        {/* Extrait */}
        <p className="text-gris text-sm leading-relaxed flex-1">{article.excerpt}</p>

        {/* Lire la suite */}
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-vert group-hover:gap-2.5 transition-all">
          Lire la suite
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
