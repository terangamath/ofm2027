import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { ComingSoonBlock } from "@/components/ui/ComingSoon";
import { getProblemes } from "@/lib/content";
import { Download } from "lucide-react";
import type { MathContent } from "@/types/content";

export const metadata: Metadata = {
  title: "Problèmes & Solutions",
  description: "Problèmes et solutions des épreuves Junior et Senior de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProblemesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const juniorProblemes = getProblemes("junior");
  const seniorProblemes = getProblemes("senior");

  const allComingSoon =
    [...juniorProblemes, ...seniorProblemes].every(
      (p) => p.status !== "published"
    );

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Problèmes & Solutions" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Problèmes & Solutions"
            sousTitre="Retrouvez ici les problèmes des épreuves Junior et Senior, ainsi que leurs solutions officielles après publication."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          {allComingSoon ? (
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm">
              <ComingSoonBlock
                label="Problèmes non encore disponibles"
                description="Les problèmes seront publiés après les épreuves de l'OFM 2027. Revenez après la compétition."
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <ProblemCategory
                title="Catégorie Junior"
                color="vert"
                problemes={juniorProblemes}
              />
              <ProblemCategory
                title="Catégorie Senior"
                color="or"
                problemes={seniorProblemes}
              />
            </div>
          )}

          {/* Note sur les formules */}
          <p className="mt-8 text-xs text-gris text-center">
            Les formules mathématiques sont rendues en LaTeX. Les énoncés complets sont disponibles en PDF.
          </p>
        </div>
      </div>
    </>
  );
}

function ProblemCategory({
  title,
  color,
  problemes,
}: {
  title: string;
  color: "vert" | "or";
  problemes: MathContent[];
}) {
  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-anthracite mb-5 flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${color === "vert" ? "bg-vert" : "bg-or"}`}
          aria-hidden="true"
        />
        {title}
      </h2>
      <div className="space-y-3">
        {problemes.map((p) => (
          <ProblemCard key={p.id} problem={p} color={color} />
        ))}
      </div>
    </div>
  );
}

function ProblemCard({
  problem,
  color,
}: {
  problem: MathContent;
  color: "vert" | "or";
}) {
  return (
    <div
      className={`bg-blanc rounded-xl border shadow-sm p-5 ${
        color === "vert" ? "border-gray-100" : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              color === "vert"
                ? "bg-vert-pale text-vert"
                : "bg-or-pale text-or"
            }`}
          >
            {problem.number}
          </div>
          <div>
            <p className="font-semibold text-anthracite text-sm">{problem.title}</p>
            <StatusBadge status={problem.status} />
          </div>
        </div>

        {problem.status === "published" && problem.pdfUrl && (
          <a
            href={problem.pdfUrl}
            download
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-vert hover:text-vert-clair transition-colors"
            aria-label={`Télécharger le PDF du ${problem.title}`}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            PDF
          </a>
        )}
      </div>

      {problem.status === "published" && problem.contentMDX && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <pre className="font-mono text-xs text-gris whitespace-pre-wrap">
            {problem.contentMDX}
          </pre>
        </div>
      )}
    </div>
  );
}
