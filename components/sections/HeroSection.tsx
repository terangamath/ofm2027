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
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      {/* Halo vert-clair haut-gauche */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(45,106,79,0.55), transparent 65%)" }}
        aria-hidden="true"
      />
      {/* Halo or bas-droite */}
      <div
        className="absolute bottom-0 right-0 w-[55%] h-[60%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.18), transparent 60%)" }}
        aria-hidden="true"
      />
      {/* Ligne lumineuse horizontale subtile */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 50%, transparent)" }}
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
              className="rounded-2xl overflow-hidden border border-white/[0.13]"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Card header */}
              <div
                className="px-5 py-4 border-b border-white/10 flex items-center justify-between"
                style={{ background: "rgba(201,168,76,0.07)" }}
              >
                <span className="type-label text-white/50">Événement officiel · OFM 2027</span>
                <span className="inline-flex items-center gap-1.5 type-label bg-or/20 text-or border border-or/30 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-or animate-pulse" aria-hidden="true" />
                  En préparation
                </span>
              </div>

              {/* Card body */}
              <div className="divide-y divide-white/[0.06]">
                {EVENT_INFOS.map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-center gap-4 px-5 py-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      <Icon className="w-4 h-4 text-or" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="type-label text-white/35 mb-1">{label}</p>
                      <p className="text-blanc text-sm font-semibold leading-tight">{value}</p>
                    </div>
                    <span className="text-white/20 text-xs hidden xl:block flex-shrink-0 text-right leading-tight">{sub}</span>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="px-5 py-4 border-t border-white/[0.08]">
                <Link
                  href="/equipes"
                  className="flex items-center justify-between text-sm text-white/45 hover:text-blanc transition-colors duration-200 group"
                >
                  <span>Voir les équipes participantes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
