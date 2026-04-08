import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { getEquipes } from "@/lib/content";
import { CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Équipes participantes",
  description:
    "Découvrez les pays et délégations qui participent à l'OFM 2027 au Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function EquipesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const equipes = getEquipes();
  const confirmes = equipes.filter((e) => e.confirmed);
  const enAttente = equipes.filter((e) => !e.confirmed);

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Équipes" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Équipes participantes"
            sousTitre={`${equipes.length} pays engagés dans la compétition — les compositions des délégations seront publiées progressivement.`}
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          {/* Compteur */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-blanc rounded-xl px-5 py-3 border border-gray-100 shadow-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-vert" aria-hidden="true" />
              <span className="text-sm font-semibold text-anthracite">
                {confirmes.length} confirmé{confirmes.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="bg-blanc rounded-xl px-5 py-3 border border-gray-100 shadow-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gris" aria-hidden="true" />
              <span className="text-sm text-gris">
                {enAttente.length} en attente de confirmation
              </span>
            </div>
          </div>

          {/* Pays confirmés */}
          {confirmes.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-xl font-bold text-anthracite mb-6">
                Délégations confirmées
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {confirmes.map((equipe) => (
                  <Link
                    key={equipe.id}
                    href={`/equipes/${equipe.id}`}
                    className="bg-blanc rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4 group"
                    aria-label={`Voir la délégation ${equipe.name}`}
                  >
                    {/* Drapeau placeholder */}
                    <div className="w-12 h-9 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-gray-400 uppercase">
                        {equipe.id.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-anthracite group-hover:text-vert transition-colors truncate">
                        {equipe.name}
                      </p>
                      <StatusBadge status={equipe.status} />
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-vert flex-shrink-0" aria-label="Confirmé" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pays en attente */}
          {enAttente.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-anthracite mb-6">
                Pays invités — confirmation à venir
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {enAttente.map((equipe) => (
                  <div
                    key={equipe.id}
                    className="bg-blanc/70 rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-75"
                  >
                    <div className="w-9 h-7 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-gray-400 uppercase">
                        {equipe.id.slice(0, 2)}
                      </span>
                    </div>
                    <p className="text-sm text-gris truncate">{equipe.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
