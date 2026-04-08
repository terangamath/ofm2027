import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { getAllActualites } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toutes les annonces et informations de l'Olympiade Francophone de Mathématiques 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
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

export default async function ActualitesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = getAllActualites().filter((a) => a.status === "published");

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Actualités" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Actualités"
            sousTitre="Suivez toutes les annonces et informations concernant l'OFM 2027."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          {articles.length === 0 ? (
            <p className="text-gris text-center py-12">
              Aucune actualité publiée pour le moment.
            </p>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/actualites/${article.slug}`}
                  className="block bg-blanc rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  aria-label={`Lire : ${article.title}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={CATEGORY_VARIANTS[article.category] ?? "gris"}>
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </Badge>
                    <time
                      dateTime={article.date}
                      className="text-xs text-gris flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {formatDate(article.date)}
                    </time>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-anthracite mb-2 group-hover:text-vert transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gris text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert group-hover:gap-2.5 transition-all">
                    Lire la suite
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
