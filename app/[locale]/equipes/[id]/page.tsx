import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatusBadge } from "@/components/ui/Badge";
import { ComingSoonBlock } from "@/components/ui/ComingSoon";
import { getEquipes, getEquipeById } from "@/lib/content";
import { User, Users, ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const equipes = getEquipes();
  return equipes.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const equipe = getEquipeById(id);
  if (!equipe) return { title: "Équipe introuvable" };
  return {
    title: `Délégation — ${equipe.name}`,
    description: `Fiche de la délégation ${equipe.name} à l'OFM 2027 au Sénégal.`,
  };
}

export default async function EquipeDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const equipe = getEquipeById(id);
  if (!equipe) notFound();

  const hasDelegation =
    equipe.delegation !== undefined &&
    equipe.status === "published";

  return (
    <>
      <div className="bg-vert pt-24 pb-12">
        <div className="container-main">
          <Breadcrumb
            items={[
              { label: "Équipes", href: "/equipes" },
              { label: equipe.name },
            ]}
            className="!px-0 text-white/50 mb-6"
          />
          <div className="flex items-center gap-5">
            <div className="w-16 h-12 rounded-lg bg-blanc/20 flex items-center justify-center">
              <span className="text-sm font-mono text-white/60 uppercase">
                {equipe.id.slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-blanc mb-1">
                {equipe.name}
              </h1>
              <StatusBadge status={equipe.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main max-w-3xl">
          <Link
            href="/equipes"
            className="inline-flex items-center gap-1.5 text-sm text-gris hover:text-vert transition-colors mb-8"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Retour aux équipes
          </Link>

          {hasDelegation && equipe.delegation ? (
            <div className="space-y-6">
              {/* Chef de délégation */}
              {equipe.delegation.chefDelegation && (
                <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-serif text-lg font-bold text-anthracite mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-vert" aria-hidden="true" />
                    Chef de délégation
                  </h2>
                  <p className="text-anthracite font-medium">
                    {equipe.delegation.chefDelegation}
                  </p>
                </div>
              )}

              {/* Encadrants */}
              {equipe.delegation.encadrants &&
                equipe.delegation.encadrants.length > 0 && (
                  <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-serif text-lg font-bold text-anthracite mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-vert" aria-hidden="true" />
                      Encadrant(s)
                    </h2>
                    <ul className="space-y-2">
                      {equipe.delegation.encadrants.map((enc) => (
                        <li key={enc} className="text-anthracite">
                          {enc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Élèves Senior */}
              {equipe.delegation.elevesSenior &&
                equipe.delegation.elevesSenior.length > 0 && (
                  <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-serif text-lg font-bold text-anthracite mb-4">
                      <span className="text-or">Senior</span> — Compétiteurs
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {equipe.delegation.elevesSenior.map((e) => (
                        <div
                          key={e.name}
                          className="flex items-center gap-2 px-4 py-2.5 bg-or-pale rounded-lg"
                        >
                          <span className="w-2 h-2 rounded-full bg-or flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-anthracite">{e.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Élèves Junior */}
              {equipe.delegation.elevesJunior &&
                equipe.delegation.elevesJunior.length > 0 && (
                  <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-serif text-lg font-bold text-anthracite mb-4">
                      <span className="text-vert">Junior</span> — Compétiteurs
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {equipe.delegation.elevesJunior.map((e) => (
                        <div
                          key={e.name}
                          className="flex items-center gap-2 px-4 py-2.5 bg-vert-pale rounded-lg"
                        >
                          <span className="w-2 h-2 rounded-full bg-vert flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-anthracite">{e.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm">
              <ComingSoonBlock
                label="Composition à venir"
                description={`La composition de la délégation ${equipe.name} sera publiée prochainement.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
