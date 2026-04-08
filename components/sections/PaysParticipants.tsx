import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Country } from "@/types/content";

interface PaysParticipantsProps {
  pays: Country[];
}

export function PaysParticipants({ pays }: PaysParticipantsProps) {
  const t = useTranslations("sections");
  const tEquipes = useTranslations("equipes");

  const confirmes = pays.filter((p) => p.confirmed);
  const nonConfirmes = pays.filter((p) => !p.confirmed);

  return (
    <section className="section-padding bg-blanc">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            surtitre={t("pays_participants")}
            titre="Nations participantes"
            sousTitre="Les délégations qui représenteront leur pays à l'OFM 2027."
          />
          <Link
            href="/equipes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair transition-colors flex-shrink-0"
          >
            Voir toutes les équipes
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Pays confirmés */}
        {confirmes.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gris uppercase tracking-widest mb-4">
              {tEquipes("confirme")} — {confirmes.length} {tEquipes("pays_participants")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {confirmes.map((pays) => (
                <CountryCard key={pays.id} pays={pays} confirmed />
              ))}
            </div>
          </div>
        )}

        {/* Pays en attente */}
        {nonConfirmes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gris uppercase tracking-widest mb-4">
              {tEquipes("en_attente")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {nonConfirmes.map((pays) => (
                <CountryCard key={pays.id} pays={pays} confirmed={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CountryCard({ pays, confirmed }: { pays: Country; confirmed: boolean }) {
  return (
    <Link
      href={`/equipes/${pays.id}`}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 group
        ${confirmed
          ? "bg-blanc border-gray-100 hover:border-vert/30 hover:shadow-sm hover:-translate-y-0.5"
          : "bg-gray-50 border-gray-100 opacity-70 hover:opacity-90"
        }`}
      aria-label={`Équipe ${pays.name}`}
    >
      {/* Drapeau placeholder */}
      <div className="w-10 h-7 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
        <span className="text-xs font-mono text-gray-400 uppercase">
          {pays.id.slice(0, 2)}
        </span>
      </div>
      <span className="text-xs font-medium text-anthracite text-center leading-tight group-hover:text-vert transition-colors">
        {pays.name}
      </span>
      {confirmed && (
        <span className="w-1.5 h-1.5 rounded-full bg-vert" aria-label="Confirmé" />
      )}
    </Link>
  );
}
