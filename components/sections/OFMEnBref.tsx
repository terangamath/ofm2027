import Link from "next/link";
import { ArrowRight, Globe, Users, BookOpen, Trophy } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STATS = [
  { icon: Globe,    value: "15+",  label: "pays participants" },
  { icon: Users,    value: "200+", label: "élèves compétiteurs" },
  { icon: BookOpen, value: "2",    label: "catégories" },
  { icon: Trophy,   value: "7+",   label: "éditions" },
];

export function OFMEnBref() {
  return (
    <Section bg="sable">
      <div className="grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">

        {/* ── Gauche ── */}
        <div>
          <SectionHeading
            label="L'OFM en bref"
            title="Qu'est-ce que l'Olympiade Francophone de Mathématiques ?"
            className="mb-6"
          />
          <p className="type-body text-gris max-w-[58ch] mb-6">
            L'OFM rassemble chaque année les meilleurs jeunes mathématiciens
            du monde francophone. Élèves de collège et de lycée s'affrontent
            dans un esprit d'excellence et de fraternité internationale,
            portés par des problèmes originaux élaborés par un comité scientifique
            de haut niveau.
          </p>

          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-blanc rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-vert-pale flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-vert" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-anthracite leading-none">{value}</p>
                  <p className="text-xs text-gris leading-tight mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/olympiade"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert hover:text-vert-clair transition-colors"
          >
            En savoir plus sur l'OFM
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Droite — Catégories ── */}
        <div>
          <p className="type-label text-gris mb-4">Deux catégories de compétition</p>

          <div className="space-y-3">
            {/* Junior */}
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex">
                <div className="w-1 bg-vert flex-shrink-0" aria-hidden="true" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="type-label text-vert">Junior</span>
                    <span className="text-xs text-gris bg-vert-pale rounded-full px-2.5 py-0.5 font-medium">Collège</span>
                  </div>
                  <p className="type-body-sm text-gris mb-2">
                    Destinée aux élèves jusqu'en 3ème. Créativité mathématique
                    et rigueur de raisonnement à l'honneur.
                  </p>
                  <p className="text-xs text-vert font-semibold">Jusqu'en 3ème incluse</p>
                </div>
              </div>
            </div>

            {/* Senior */}
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex">
                <div className="w-1 bg-or flex-shrink-0" aria-hidden="true" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="type-label text-or">Senior</span>
                    <span className="text-xs text-gris bg-or-pale rounded-full px-2.5 py-0.5 font-medium">Lycée</span>
                  </div>
                  <p className="type-body-sm text-gris mb-2">
                    Réunit les lycéens les plus brillants autour de problèmes
                    exigeants, proches des Olympiades internationales.
                  </p>
                  <p className="text-xs text-or font-semibold">Seconde à Terminale incluse</p>
                </div>
              </div>
            </div>

            {/* Format */}
            <div className="bg-vert-pale rounded-xl px-4 py-3">
              <p className="text-sm text-vert leading-relaxed">
                <span className="font-semibold">Format :</span> 2 jours d'épreuves · 4 à 6 problèmes · Jury international
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
