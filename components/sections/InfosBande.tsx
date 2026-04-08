import { MapPin, Calendar, Building2, Languages, Layout } from "lucide-react";

const INFOS = [
  { icon: MapPin,     label: "Lieu",              value: "Dakar, Sénégal" },
  { icon: Calendar,   label: "Dates",             value: "[À confirmer — 2027]" },
  { icon: Building2,  label: "Organisateur",      value: "Terangamath" },
  { icon: Languages,  label: "Langue officielle", value: "Français" },
  { icon: Layout,     label: "Format",            value: "Junior · Senior" },
];

/**
 * Bande horizontale d'infos clés — sous le Hero.
 * Full-bleed blanc, container interne.
 */
export function InfosBande() {
  return (
    <div className="bg-blanc border-b border-gray-100 shadow-sm">
      <div className="container-main">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-gray-100">
          {INFOS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-4 px-1 sm:px-2">
              <Icon className="w-4 h-4 text-or flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="type-label text-gris mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-anthracite truncate leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
