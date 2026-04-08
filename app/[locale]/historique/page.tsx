import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getHistorique } from "@/lib/content";
import { Globe, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Historique des éditions",
  description: "Archives et palmarès des éditions précédentes de l'Olympiade Francophone de Mathématiques.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HistoriquePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const editions = getHistorique();

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Historique" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM"
            titre="Historique des éditions"
            sousTitre="Retrouvez les archives et le palmarès de toutes les éditions précédentes de l'Olympiade Francophone de Mathématiques."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main max-w-3xl">
          {/* Timeline */}
          <div className="relative">
            {/* Ligne verticale */}
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"
              aria-hidden="true"
            />

            <div className="space-y-6">
              {/* OFM 2027 — en cours */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-or flex items-center justify-center z-10">
                  <span className="font-serif font-bold text-sm text-anthracite">27</span>
                </div>
                <div className="flex-1 bg-or-pale border border-or-clair rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold text-or uppercase tracking-widest">
                      Édition en cours
                    </span>
                    <span className="bg-or text-anthracite text-xs font-bold px-2.5 py-0.5 rounded-full">
                      2027
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-anthracite mb-1">
                    OFM 2027 — Sénégal
                  </h3>
                  <p className="text-sm text-gris">
                    Organisée par Terangamath à Dakar, Sénégal. [Dates à confirmer]
                  </p>
                </div>
              </div>

              {/* Éditions précédentes */}
              {editions.map((edition) => (
                <div key={edition.year} className="relative flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blanc border-2 border-gray-200 flex items-center justify-center z-10">
                    <span className="font-serif font-bold text-xs text-anthracite">
                      {String(edition.year).slice(2)}
                    </span>
                  </div>
                  <div className="flex-1 bg-blanc border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs text-gris font-semibold uppercase tracking-widest mb-1 block">
                          {edition.year}
                        </span>
                        <h3 className="font-serif text-base font-bold text-anthracite mb-1">
                          OFM {edition.year} — {edition.host}
                        </h3>
                        {edition.dates && (
                          <p className="text-sm text-gris mb-2">{edition.dates}</p>
                        )}
                        {edition.notes && (
                          <p className="text-xs text-gris italic">{edition.notes}</p>
                        )}
                        {edition.participatingCountries && (
                          <div className="flex items-center gap-1.5 text-xs text-gris mt-2">
                            <Globe className="w-3 h-3" aria-hidden="true" />
                            {edition.participatingCountries} pays
                          </div>
                        )}
                      </div>
                      {edition.externalUrl && (
                        <a
                          href={edition.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-vert hover:text-vert-clair transition-colors"
                          aria-label={`Site OFM ${edition.year}`}
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-gris text-center">
            [Les données historiques complètes seront progressivement complétées.]
          </p>
        </div>
      </div>
    </>
  );
}
