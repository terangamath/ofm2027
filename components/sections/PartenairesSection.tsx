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

export function PartenairesSection({ partenaires }: PartenairesSectionProps) {
  const grouped = partenaires.reduce<Record<string, Partner[]>>((acc, p) => {
    const key = p.type;
    if (!acc[key]) acc[key] = [];
    (acc[key] as Partner[]).push(p);
    return acc;
  }, {});

  return (
    <Section bg="sable" size="sm" className="border-t border-gray-100">
      {/* En-tête sobre */}
      <div className="flex items-center gap-4 mb-6">
        <span className="type-label text-gris">Partenaires & soutiens</span>
        <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
      </div>

      <div className="space-y-5">
        {(["institutionnel", "financier", "technique"] as const).map((type) => {
          const partners = grouped[type];
          if (!partners || partners.length === 0) return null;
          return (
            <div key={type}>
              <p className="type-label text-gris/50 mb-3">{TYPE_LABELS[type]}</p>
              <div className="flex flex-wrap gap-2">
                {partners.map((p) => (
                  <PartnerTag key={p.id} partner={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 type-label text-gris/40 text-center">
        Liste complète des partenaires à paraître prochainement
      </p>
    </Section>
  );
}

function PartnerTag({ partner }: { partner: Partner }) {
  const isPlaceholder = partner.name.startsWith("[");

  const inner = (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-blanc transition-shadow ${
      isPlaceholder
        ? "border-dashed border-gray-200 opacity-50"
        : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
    }`}>
      <div className="w-6 h-6 rounded bg-sable flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-gris uppercase leading-none">
          {isPlaceholder ? "?" : partner.name.slice(0, 2)}
        </span>
      </div>
      <span className={`text-sm font-medium leading-tight max-w-[180px] truncate ${
        isPlaceholder ? "text-gris/50 italic" : "text-anthracite"
      }`}>
        {partner.name}
      </span>
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
