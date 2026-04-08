import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Country } from "@/types/content";

interface PaysParticipantsProps {
  pays: Country[];
}

export function PaysParticipants({ pays }: PaysParticipantsProps) {
  const confirmes = pays.filter((p) => p.confirmed);
  const enAttente = pays.filter((p) => !p.confirmed);

  return (
    <Section bg="white">
      {/* En-tête */}
      <div className="flex items-end justify-between gap-6 mb-8">
        <SectionHeading
          label="Nations participantes"
          title={`${pays.length} pays engagés`}
        />
        <Link
          href="/equipes"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert hover:text-vert-clair transition-colors flex-shrink-0"
        >
          Toutes les équipes
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Pays confirmés */}
      {confirmes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-vert" aria-hidden="true" />
            <span className="type-label text-vert">
              Confirmés — {confirmes.length} délégations
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {confirmes.map((p) => (
              <Link
                key={p.id}
                href={`/equipes/${p.id}`}
                className="group flex items-center gap-2 bg-sable hover:bg-vert-pale border border-transparent hover:border-vert/15 rounded-lg px-3 py-2.5 transition-all"
                aria-label={`Équipe ${p.name}`}
              >
                <div className="w-6 h-4.5 rounded-sm bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <span className="text-[8px] font-mono text-gray-400 uppercase leading-none">
                    {p.id.slice(0, 2)}
                  </span>
                </div>
                <span className="text-xs font-medium text-anthracite group-hover:text-vert transition-colors truncate">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pays en attente */}
      {enAttente.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <span className="type-body-sm text-gris mr-2">En attente de confirmation :</span>
          <span className="type-body-sm text-gris/55">
            {enAttente.map((p) => p.name).join(" · ")}
          </span>
        </div>
      )}
    </Section>
  );
}
