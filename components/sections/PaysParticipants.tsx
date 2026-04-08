import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
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
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-vert/8 border border-vert/15 rounded-full px-3 py-1">
              <CheckCircle2 className="w-3 h-3 text-vert" aria-hidden="true" />
              <span className="type-label text-vert">
                {confirmes.length} délégations confirmées
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {confirmes.map((p) => (
              <Link
                key={p.id}
                href={`/equipes/${p.id}`}
                className="group relative flex items-center gap-2.5 bg-blanc border border-gray-100 hover:border-vert/25 rounded-xl px-3 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                aria-label={`Équipe ${p.name}`}
              >
                {/* Indicateur confirmé */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-vert opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                {/* Drapeau placeholder */}
                <div className="w-7 h-5 rounded bg-sable border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-vert/20 transition-colors">
                  <span className="text-[8px] font-bold text-gris/60 uppercase tracking-wide leading-none">
                    {p.id.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-anthracite group-hover:text-vert transition-colors truncate leading-tight">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pays en attente */}
      {enAttente.length > 0 && (
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5 type-label text-gris/50 flex-shrink-0">
            <Clock className="w-3 h-3" aria-hidden="true" />
            En attente
          </span>
          <span className="type-body-sm text-gris/45">
            {enAttente.map((p) => p.name).join(" · ")}
          </span>
        </div>
      )}
    </Section>
  );
}
