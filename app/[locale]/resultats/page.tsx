import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ComingSoonBlock } from "@/components/ui/ComingSoon";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Résultats",
  description: "Résultats officiels, médailles et classements de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ResultatsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Les résultats ne sont pas encore publiés
  const resultsPublished = false;

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Résultats" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Résultats officiels"
            sousTitre="Les résultats seront publiés ici à l'issue de la compétition et de la délibération du jury."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main max-w-3xl">
          {resultsPublished ? (
            <div>
              {/* Tableau de résultats — à implémenter quand les données sont disponibles */}
              <p className="text-gris">Résultats disponibles.</p>
            </div>
          ) : (
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm">
              <ComingSoonBlock
                label="Résultats non encore disponibles"
                description="Les résultats officiels de l'OFM 2027 seront publiés après la délibération du jury, à l'issue de la compétition en juillet 2027."
              />
            </div>
          )}

          {/* Explication du système de médailles */}
          <div className="mt-8 bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-anthracite mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-or" aria-hidden="true" />
              Système de récompenses
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Médaille d'or", color: "bg-yellow-400", desc: "Meilleurs résultats individuels" },
                { label: "Médaille d'argent", color: "bg-gray-400", desc: "Très bons résultats" },
                { label: "Médaille de bronze", color: "bg-orange-400", desc: "Bons résultats" },
                { label: "Mention honorable", color: "bg-blue-400", desc: "Solution partielle notable" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 ${m.color}`} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-anthracite">{m.label}</p>
                    <p className="text-xs text-gris">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gris mt-4">
              Les seuils exacts sont déterminés par le jury lors de la délibération officielle.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
