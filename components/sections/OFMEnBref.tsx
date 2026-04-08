import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Users, Globe, Trophy, BookOpen } from "lucide-react";

const STATS = [
  { key: "stat_pays", value: "15+", icon: Globe },
  { key: "stat_eleves", value: "200+", icon: Users },
  { key: "stat_categories", value: "2", icon: BookOpen },
  { key: "stat_editions", value: "7+", icon: Trophy },
];

export function OFMEnBref() {
  const t = useTranslations("ofm_bref");

  return (
    <section className="section-padding bg-sable">
      <div className="container-main">
        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <SectionHeader
              surtitre={useTranslations("sections")("ofm_en_bref")}
              titre={t("titre")}
              className="mb-6"
            />
            <p className="text-gris leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ key, value, icon: Icon }) => (
              <div
                key={key}
                className="bg-blanc rounded-xl p-6 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-vert-pale flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-vert" aria-hidden="true" />
                </div>
                <div className="font-serif text-2xl font-bold text-anthracite mb-1">
                  {value}
                </div>
                <div className="text-sm text-gris">{t(key)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div>
          <h3 className="font-serif text-xl font-bold text-anthracite mb-6 text-center">
            {t("categories_titre")}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Junior */}
            <div className="relative bg-blanc rounded-2xl p-8 border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-vert rounded-l-2xl" aria-hidden="true" />
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-vert-pale text-vert text-xs font-semibold rounded-full uppercase tracking-wide">
                  {t("junior_titre")}
                </span>
              </div>
              <p className="text-gris leading-relaxed">{t("junior_desc")}</p>
              <div className="mt-4 text-vert font-semibold text-sm">
                Collège · Jusqu'en 3ème
              </div>
            </div>

            {/* Senior */}
            <div className="relative bg-blanc rounded-2xl p-8 border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-or rounded-l-2xl" aria-hidden="true" />
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-or-pale text-or text-xs font-semibold rounded-full uppercase tracking-wide">
                  {t("senior_titre")}
                </span>
              </div>
              <p className="text-gris leading-relaxed">{t("senior_desc")}</p>
              <div className="mt-4 text-or font-semibold text-sm">
                Lycée · Seconde à Terminale
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
