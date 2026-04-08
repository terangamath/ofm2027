import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, MapPin, Calendar, Globe, Users, BookOpen } from "lucide-react";

const EVENT_INFOS = [
  { icon: MapPin,     label: "Lieu",              value: "Dakar, Sénégal",    sub: "Afrique de l'Ouest" },
  { icon: Calendar,   label: "Dates",             value: "[À confirmer]",     sub: "Juillet 2027" },
  { icon: Globe,      label: "Langue officielle", value: "Français",          sub: "Olympiade francophone" },
  { icon: BookOpen,   label: "Catégories",        value: "Junior · Senior",   sub: "Collège et lycée" },
  { icon: Users,      label: "Délégations",       value: "15+ pays",          sub: "Monde francophone" },
];

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative bg-vert overflow-hidden flex items-center"
      style={{ minHeight: "100vh" }}
      aria-label="Présentation OFM 2027"
    >
      {/* Fond : grille de points */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      {/* Halo or bas-droite */}
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-10"
        style={{ background: "radial-gradient(ellipse at 100% 100%, #c9a84c, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Contenu ── */}
      <div className="container-main relative z-10 w-full" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-center">

          {/* Gauche */}
          <div className="max-w-[560px]">
            {/* Surtitre */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-5 h-px bg-or" aria-hidden="true" />
              <span className="type-label text-or">Sénégal · 2027</span>
            </div>

            {/* H1 */}
            <h1 className="type-h1 text-blanc mb-5">
              Olympiade
              <br />Francophone
              <br /><span className="text-or">de Mathématiques</span>
            </h1>

            <p className="type-body text-white/65 mb-7 max-w-[50ch]">
              La grande compétition internationale de mathématiques
              du monde francophone, organisée au cœur de l'Afrique de l'Ouest.
            </p>

            {/* Date + lieu */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
              <span className="flex items-center gap-1.5 text-white/55 text-sm">
                <Calendar className="w-3.5 h-3.5 text-or flex-shrink-0" aria-hidden="true" />
                {t("dates")}
              </span>
              <span className="flex items-center gap-1.5 text-white/55 text-sm">
                <MapPin className="w-3.5 h-3.5 text-or flex-shrink-0" aria-hidden="true" />
                Dakar, Sénégal
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/olympiade"
                className="inline-flex items-center gap-2 px-6 py-3 bg-or text-anthracite font-semibold rounded-lg hover:bg-or-clair transition-colors text-sm"
              >
                Découvrir l'OFM
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/informations"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/75 font-medium rounded-lg hover:bg-white/8 hover:text-blanc transition-colors text-sm"
              >
                Informations pratiques
              </Link>
            </div>

            <p className="mt-6 type-label text-white/30">Organisé par Terangamath</p>
          </div>

          {/* Droite — Event Card */}
          <div className="hidden lg:block">
            <div
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(16px)" }}
            >
              {/* Card header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                <span className="type-label text-white/40">Événement officiel</span>
                <span className="inline-flex items-center gap-1.5 type-label bg-or/15 text-or border border-or/25 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-or" aria-hidden="true" />
                  En préparation
                </span>
              </div>

              {/* Card body */}
              <div className="divide-y divide-white/[0.07]">
                {EVENT_INFOS.map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-center gap-3.5 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-or" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="type-label text-white/35 mb-0.5">{label}</p>
                      <p className="text-blanc text-sm font-semibold leading-tight">{value}</p>
                    </div>
                    <span className="text-white/25 text-xs hidden xl:block flex-shrink-0">{sub}</span>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="px-5 py-3.5 border-t border-white/10">
                <Link
                  href="/equipes"
                  className="flex items-center justify-between text-sm text-white/40 hover:text-blanc transition-colors group"
                >
                  <span>Voir les équipes participantes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
