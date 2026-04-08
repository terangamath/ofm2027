import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getAllActualites, getActualiteBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllActualites();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getActualiteBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getActualiteBySlug(slug);
  if (!article || article.status !== "published") notFound();

  const CATEGORY_LABELS: Record<string, string> = {
    annonce: "Annonce",
    resultat: "Résultat",
    document: "Document",
    information: "Information",
  };
  const CATEGORY_VARIANTS: Record<string, "vert" | "or" | "gris"> = {
    annonce: "vert",
    resultat: "or",
    document: "gris",
    information: "gris",
  };

  return (
    <>
      <div className="bg-vert pt-24 pb-12">
        <div className="container-main">
          <Breadcrumb
            items={[
              { label: "Actualités", href: "/actualites" },
              { label: article.title },
            ]}
            className="!px-0 text-white/50 mb-6"
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          <div className="max-w-2xl">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-1.5 text-sm text-gris hover:text-vert transition-colors mb-8"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Retour aux actualités
            </Link>

            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-8">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-5">
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

              {/* Titre */}
              <h1 className="font-serif text-2xl font-bold text-anthracite leading-tight mb-6">
                {article.title}
              </h1>

              {/* Contenu */}
              <div
                className="prose-ofm text-gris"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Conversion Markdown basique vers HTML (sans dépendance externe) */
function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|l])/gm, "")
    .trim();
}
