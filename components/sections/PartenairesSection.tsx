import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Partner } from "@/types/content";

interface PartenairesSectionProps {
  partenaires: Partner[];
}

const TYPE_LABELS: Record<string, string> = {
  institutionnel: "Partenaires institutionnels",
  financier: "Partenaires financiers",
  technique: "Partenaires techniques",
  media: "Partenaires médias",
};

export function PartenairesSection({ partenaires }: PartenairesSectionProps) {
  const t = useTranslations("sections");

  const grouped = partenaires.reduce<Record<string, Partner[]>>((acc, p) => {
    const key = p.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <section className="section-padding bg-sable">
      <div className="container-main">
        <SectionHeader
          surtitre={t("partenaires")}
          titre="Nos soutiens"
          sousTitre="L'OFM 2027 est rendu possible grâce au soutien de nos partenaires institutionnels, financiers et techniques."
          center
          className="mb-12"
        />

        {Object.entries(grouped).map(([type, partners]) => (
          <div key={type} className="mb-10">
            <p className="text-xs font-semibold text-gris uppercase tracking-widest text-center mb-6">
              {TYPE_LABELS[type] ?? type}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const inner = (
    <div className="bg-blanc rounded-xl border border-gray-100 shadow-sm px-8 py-5 flex flex-col items-center gap-2 min-w-[140px] hover:shadow-md transition-shadow">
      <div className="h-10 flex items-center justify-center">
        {/* Placeholder logo */}
        <div className="w-20 h-8 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-xs text-gris font-medium truncate px-1">{partner.name.slice(0, 10)}</span>
        </div>
      </div>
      <p className="text-xs text-gris text-center leading-tight max-w-[120px]">
        {partner.name}
      </p>
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visiter le site de ${partner.name}`}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
