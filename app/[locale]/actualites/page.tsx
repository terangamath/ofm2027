import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar, ArrowRight, Newspaper, Clock,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { getAllActualites } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { NewsArticle, ArticleCategory } from "@/types/content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toutes les annonces et informations de l'Olympiade Francophone de Mathématiques 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

// ── Méta des catégories ───────────────────────────────────────────────────────

const CATEGORY_META: Record<
  ArticleCategory,
  { label: string; variant: "vert" | "or" | "gris" | "rouge" }
> = {
  annonce:     { label: "Annonce",     variant: "vert" },
  resultat:    { label: "Résultat",    variant: "or"   },
  document:    { label: "Document",   variant: "gris"  },
  information: { label: "Information", variant: "gris" },
};

function categoryMeta(cat: string) {
  return CATEGORY_META[cat as ArticleCategory] ?? { label: cat, variant: "gris" as const };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ActualitesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = getAllActualites().filter((a) => a.status === "published");
  const [featured, ...rest] = articles;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Actualités OFM 2027"
      >
        {/* Fond décoratif */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(45,106,79,0.5), transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[45%] h-[70%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.15), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 50%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <Breadcrumb
            items={[{ label: "Actualités" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[520px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Suivez-nous</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                Actualités
                <br />
                <span className="text-or">& annonces</span>
              </h1>
              <p className="type-body text-white/65 max-w-[46ch]">
                Toutes les annonces, résultats et informations concernant
                l'OFM 2027 au Sénégal.
              </p>
            </div>

            {/* Droite — légende catégories */}
            <div className="hidden lg:block">
              <div
                className="rounded-2xl overflow-hidden border border-white/[0.12]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
                }}
              >
                <div
                  className="px-5 py-3.5 border-b border-white/[0.08]"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                >
                  <span className="type-label text-white/45">
                    {articles.length > 0
                      ? `${articles.length} article${articles.length > 1 ? "s" : ""} publié${articles.length > 1 ? "s" : ""}`
                      : "Aucun article pour le moment"}
                  </span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {(
                    [
                      { icon: Newspaper, label: "Annonce",     desc: "Informations officielles" },
                      { icon: Calendar,  label: "Résultat",    desc: "Palmarès et classements"  },
                      { icon: Clock,     label: "Document",    desc: "Guides et formulaires"    },
                    ] as { icon: LucideIcon; label: string; desc: string }[]
                  ).map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="px-5 py-3.5 flex items-start gap-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(201,168,76,0.12)",
                          border: "1px solid rgba(201,168,76,0.18)",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 text-or" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-blanc text-sm font-semibold leading-snug">{label}</p>
                        <p className="type-label text-white/30 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenu ───────────────────────────────────────────────────────── */}
      <Section bg="sable">
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl">
            {/* Article à la une */}
            {featured && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-4 h-px bg-or" aria-hidden="true" />
                  <span className="type-label text-or">À la une</span>
                </div>
                <ArticleCardFeatured article={featured} />
              </div>
            )}

            {/* Autres articles */}
            {rest.length > 0 && (
              <div>
                {featured && (
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-4 h-px bg-or" aria-hidden="true" />
                    <span className="type-label text-or">Toutes les actualités</span>
                  </div>
                )}
                <div className="space-y-3">
                  {rest.map((article) => (
                    <ArticleCardCompact key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
}

// ── Carte à la une ────────────────────────────────────────────────────────────

function ArticleCardFeatured({ article }: { article: NewsArticle }) {
  const meta = categoryMeta(article.category);

  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group block bg-blanc rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      aria-label={`Lire : ${article.title}`}
    >
      <div className="p-6 md:p-8">
        {/* Meta ligne */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          <time
            dateTime={article.date}
            className="flex items-center gap-1.5 type-label text-gris/50"
          >
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(article.date)}
          </time>
        </div>

        {/* Titre */}
        <h2 className="type-h3 text-anthracite mb-3 group-hover:text-vert transition-colors duration-200 leading-snug">
          {article.title}
        </h2>

        {/* Extrait */}
        <p className="type-body text-gris leading-relaxed mb-6 max-w-[60ch]">
          {article.excerpt}
        </p>

        {/* CTA */}
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-vert group-hover:gap-3 transition-all duration-200">
          Lire la suite
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

// ── Carte compacte ────────────────────────────────────────────────────────────

function ArticleCardCompact({ article }: { article: NewsArticle }) {
  const meta = categoryMeta(article.category);

  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group flex items-start gap-4 bg-blanc rounded-xl border border-gray-100 px-5 py-4 hover:shadow-md hover:-translate-y-px transition-all duration-200"
      aria-label={`Lire : ${article.title}`}
    >
      {/* Indicateur catégorie */}
      <div
        className={`w-1 self-stretch rounded-full flex-shrink-0 mt-0.5 ${
          meta.variant === "vert" ? "bg-vert/30" :
          meta.variant === "or"   ? "bg-or/40"   : "bg-gray-200"
        }`}
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          <time
            dateTime={article.date}
            className="flex items-center gap-1 type-label text-gris/40"
          >
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(article.date)}
          </time>
        </div>
        <h2 className="text-sm font-semibold text-anthracite leading-snug group-hover:text-vert transition-colors duration-200 truncate">
          {article.title}
        </h2>
        <p className="type-body-sm text-gris/60 mt-1 line-clamp-1">{article.excerpt}</p>
      </div>

      {/* Flèche */}
      <ArrowRight
        className="w-4 h-4 text-gris/20 group-hover:text-vert group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 mt-1"
        aria-hidden="true"
      />
    </Link>
  );
}

// ── État vide ─────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="w-14 h-14 rounded-2xl bg-or/10 border border-or/20 flex items-center justify-center mx-auto mb-5">
        <Newspaper className="w-6 h-6 text-or" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-xl font-bold text-anthracite mb-2">
        Aucune actualité pour le moment
      </h2>
      <p className="type-body-sm text-gris max-w-[42ch] mx-auto leading-relaxed">
        Les annonces et informations concernant l'OFM 2027 seront publiées
        ici au fur et à mesure.
      </p>
    </div>
  );
}
