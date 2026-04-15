import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  Download, Clock, BookOpen, Users, Star, FileText,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/Badge";
import { getProblemes } from "@/lib/content";
import type { MathContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Problèmes & Solutions",
  description:
    "Problèmes et solutions officiels des épreuves Junior et Senior de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

// ── Méta des catégories ───────────────────────────────────────────────────────

const CATEGORY_META = {
  junior: {
    label: "Junior",
    surtitre: "Collège",
    description: "Élèves jusqu'en 3ème incluse",
    dotColor: "bg-vert",
    badgeBg: "bg-vert/8 border-vert/20",
    badgeText: "text-vert",
    numberBg: "bg-vert-pale text-vert",
    accentLine: "border-vert/30",
  },
  senior: {
    label: "Senior",
    surtitre: "Lycée",
    description: "Élèves de Seconde à Terminale",
    dotColor: "bg-or",
    badgeBg: "bg-or/10 border-or/20",
    badgeText: "text-or",
    numberBg: "bg-or-pale text-or",
    accentLine: "border-or/30",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_META;

export default async function ProblemesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const juniorProblemes = getProblemes("junior");
  const seniorProblemes = getProblemes("senior");

  const allComingSoon = [...juniorProblemes, ...seniorProblemes].every(
    (p) => p.status !== "published"
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Problèmes et solutions OFM 2027"
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
            items={[{ label: "Problèmes & Solutions" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[540px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Épreuves</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                Problèmes
                <br />
                <span className="text-or">& Solutions</span>
              </h1>
              <p className="type-body text-white/65 max-w-[48ch]">
                Les énoncés et solutions officiels des épreuves Junior et Senior
                seront publiés ici après la compétition.
              </p>
            </div>

            {/* Droite — format des épreuves */}
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
                  <span className="type-label text-white/45">Format des épreuves</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {(
                    [
                      { icon: Users,    label: "Catégories",   value: "Junior · Senior" },
                      { icon: BookOpen, label: "Épreuves",     value: "2 jours d'épreuves écrites" },
                      { icon: Star,     label: "Problèmes",    value: "4 à 6 par épreuve" },
                      { icon: FileText, label: "Notation",     value: "7 points par problème" },
                    ] as { icon: LucideIcon; label: string; value: string }[]
                  ).map(({ icon: Icon, label, value }) => (
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
                        <p className="type-label text-white/35 mb-1">{label}</p>
                        <p className="text-blanc text-sm font-semibold leading-snug">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenu principal ─────────────────────────────────────────────── */}
      <Section bg="sable">
        {allComingSoon ? (
          <ComingSoonLayout
            juniorCount={juniorProblemes.length}
            seniorCount={seniorProblemes.length}
          />
        ) : (
          <PublishedLayout
            juniorProblemes={juniorProblemes}
            seniorProblemes={seniorProblemes}
          />
        )}
      </Section>
    </>
  );
}

// ── État : pas encore publié ──────────────────────────────────────────────────

function ComingSoonLayout({
  juniorCount,
  seniorCount,
}: {
  juniorCount: number;
  seniorCount: number;
}) {
  return (
    <div>
      {/* Bandeau d'annonce */}
      <div
        className="rounded-2xl border border-or/20 bg-or-pale/40 px-6 py-5 flex items-start gap-4 mb-10"
      >
        <div className="w-9 h-9 rounded-xl bg-or/15 border border-or/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Clock className="w-4.5 h-4.5 text-or" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-anthracite text-sm mb-0.5">
            Publication après les épreuves
          </p>
          <p className="type-body-sm text-gris max-w-[58ch]">
            Les énoncés et solutions seront mis en ligne après la semaine de compétition
            de l'OFM 2027 (juillet 2027). Revenez après la compétition.
          </p>
        </div>
      </div>

      {/* Aperçu des deux catégories */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPreview categoryKey="junior" count={juniorCount} />
        <CategoryPreview categoryKey="senior" count={seniorCount} />
      </div>
    </div>
  );
}

function CategoryPreview({
  categoryKey,
  count,
}: {
  categoryKey: CategoryKey;
  count: number;
}) {
  const meta = CATEGORY_META[categoryKey];
  const placeholderCount = count > 0 ? count : 5;

  return (
    <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dotColor}`}
            aria-hidden="true"
          />
          <div>
            <p className={`type-label mb-0.5 ${meta.badgeText}`}>{meta.surtitre}</p>
            <h2 className="type-h4 text-anthracite">Catégorie {meta.label}</h2>
          </div>
        </div>
        <span className="type-label text-gris/40">{meta.description}</span>
      </div>

      {/* Problèmes placeholder */}
      <div className="p-4 space-y-2.5">
        {Array.from({ length: placeholderCount }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-50 bg-sable/50"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 opacity-40 ${meta.numberBg}`}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="h-3 w-32 bg-gray-200/70 rounded skeleton" />
            </div>
            <span className="type-label text-gris/30">À venir</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── État : problèmes publiés ──────────────────────────────────────────────────

function PublishedLayout({
  juniorProblemes,
  seniorProblemes,
}: {
  juniorProblemes: MathContent[];
  seniorProblemes: MathContent[];
}) {
  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-4 h-px bg-or" aria-hidden="true" />
          <span className="type-label text-or">OFM 2027</span>
        </div>
        <h2 className="type-h2 text-anthracite">Épreuves</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProblemCategory categoryKey="junior" problemes={juniorProblemes} />
        <ProblemCategory categoryKey="senior" problemes={seniorProblemes} />
      </div>

      <p className="mt-10 type-label text-gris/40 text-center">
        Les formules mathématiques sont rendues en LaTeX. Énoncés complets disponibles en PDF.
      </p>
    </div>
  );
}

function ProblemCategory({
  categoryKey,
  problemes,
}: {
  categoryKey: CategoryKey;
  problemes: MathContent[];
}) {
  const meta = CATEGORY_META[categoryKey];

  return (
    <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dotColor}`}
          aria-hidden="true"
        />
        <div>
          <p className={`type-label mb-0.5 ${meta.badgeText}`}>{meta.surtitre}</p>
          <h2 className="type-h4 text-anthracite">Catégorie {meta.label}</h2>
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        {problemes.map((p) => (
          <ProblemCard key={p.id} problem={p} categoryKey={categoryKey} />
        ))}
      </div>
    </div>
  );
}

function ProblemCard({
  problem,
  categoryKey,
}: {
  problem: MathContent;
  categoryKey: CategoryKey;
}) {
  const meta = CATEGORY_META[categoryKey];
  const published = problem.status === "published";

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        published
          ? "bg-blanc border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-px"
          : "bg-sable/50 border-gray-50"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Numéro */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            published ? meta.numberBg : "bg-gray-100 text-gris/40"
          }`}
        >
          {problem.number}
        </div>

        {/* Titre + statut */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold leading-tight truncate ${
              published ? "text-anthracite" : "text-gris/50"
            }`}
          >
            {problem.title}
          </p>
          <div className="mt-1">
            <StatusBadge status={problem.status} />
          </div>
        </div>

        {/* Téléchargement PDF */}
        {published && problem.pdfUrl && (
          <a
            href={problem.pdfUrl}
            download
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vert/8 border border-vert/15 text-xs font-semibold text-vert hover:bg-vert/12 transition-colors duration-200"
            aria-label={`Télécharger le PDF — ${problem.title}`}
          >
            <Download className="w-3 h-3" aria-hidden="true" />
            PDF
          </a>
        )}
      </div>

      {/* Contenu MDX si publié */}
      {published && problem.contentMDX && (
        <div className="mx-4 mb-4 pt-3.5 border-t border-gray-100">
          <pre className="font-mono text-xs text-gris whitespace-pre-wrap leading-relaxed">
            {problem.contentMDX}
          </pre>
        </div>
      )}
    </div>
  );
}
