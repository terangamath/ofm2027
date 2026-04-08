import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MapPin, Calendar, Building2, Languages } from "lucide-react";

const INFOS = [
  {
    key: "lieu",
    icon: MapPin,
    color: "bg-vert-pale text-vert",
  },
  {
    key: "date",
    icon: Calendar,
    color: "bg-or-pale text-or",
  },
  {
    key: "organisateur",
    icon: Building2,
    color: "bg-vert-pale text-vert",
  },
  {
    key: "langue",
    icon: Languages,
    color: "bg-or-pale text-or",
  },
] as const;

export function InfosCles() {
  const t = useTranslations("infos_cles");
  const tSections = useTranslations("sections");

  return (
    <section className="section-padding bg-vert">
      <div className="container-main">
        <SectionHeader
          surtitre={tSections("infos_cles")}
          titre="L'édition 2027 en un coup d'œil"
          center
          light
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFOS.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-blanc/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-blanc/15 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${color}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-1">
                {t(`${key}_titre`)}
              </p>
              <p className="text-blanc font-semibold text-sm leading-snug">
                {t(`${key}_valeur`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
