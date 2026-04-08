import { Section } from "@/components/ui/Section";
import type { Partner } from "@/types/content";

interface PartenairesSectionProps {
  partenaires: Partner[];
}

const TYPE_LABELS: Record<string, string> = {
  institutionnel: "Partenaires institutionnels",
  financier:      "Partenaires financiers",
  technique:      "Partenaires techniques",
  media:          "Partenaires médias",
};

const TYPE_ORDER = ["institutionnel", "financier", "technique", "media"] as const;

export function PartenairesSection({ partenaires }: PartenairesSectionProps) {
  const grouped = partenaires.reduce<Record<string, Partner[]>>((acc, p) => {
    const key = p.type;
    if (!acc[key]) acc[key] = [];
    (acc[key] as Partner[]).push(p);
    return acc;
  }, {});

  return (
    <Section bg="sable" size="sm" className="border-t border-gray-100">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <p className="type-label text-gris/50 mb-1.5">Partenaires &amp; soutiens</p>
          <div className="w-8 h-0.5 bg-or rounded-full" aria-hidden="true" />
        </div>
        <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
        <p className="type-label text-gris/35 flex-shrink-0">OFM 2027 · Dakar</p>
      </div>

      <div className="space-y-8">
        {TYPE_ORDER.map((type) => {
          const partners = grouped[type];
          if (!partners || partners.length === 0) return null;
          return (
            <div key={type}>
              <p className="type-label text-gris/45 mb-3">{TYPE_LABELS[type]}</p>
              <div className="flex flex-wrap gap-2.5">
                {partners.map((p) => (
                  <PartnerCard key={p.id} partner={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 type-label text-gris/30 text-center">
        Liste complète des partenaires à paraître prochainement
      </p>
    </Section>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const isPlaceholder = partner.name.startsWith("[");
  const initials = isPlaceholder ? "?" : partner.name.slice(0, 2).toUpperCase();

  const inner = (
    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border bg-blanc transition-all duration-200 ${
      isPlaceholder
        ? "border-dashed border-gray-200 opacity-40"
        : "border-gray-100 shadow-sm hover:shadow-lg hover:border-vert/20 hover:-translate-y-px"
    }`}>
      {/* Logo placeholder */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
        isPlaceholder
          ? "bg-gray-100 text-gray-300"
          : "bg-sable text-vert border border-gray-100"
      }`}>
        {initials}
      </div>
      <div className="min-w-0">
        <span className={`block text-sm font-semibold leading-tight max-w-[160px] truncate ${
          isPlaceholder ? "text-gris/40 italic" : "text-anthracite"
        }`}>
          {partner.name}
        </span>
        {!isPlaceholder && (
          <span className="block text-[10px] text-gris/40 mt-0.5 uppercase tracking-wide">
            {partner.type}
          </span>
        )}
      </div>
    </div>
  );

  if (partner.url && !isPlaceholder) {
    return (
      <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={`Visiter ${partner.name}`}>
        {inner}
      </a>
    );
  }
  return inner;
}
