import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MapPin, Bed, Car, Globe, Utensils, FileText, Users, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Informations pratiques",
  description: "Toutes les informations pratiques pour les délégations, encadrants et visiteurs de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

const SECTIONS = [
  {
    id: "lieu",
    icon: MapPin,
    titre: "Lieu de la compétition",
    contenu: [
      {
        label: "Ville hôte",
        value: "Dakar, Sénégal",
      },
      {
        label: "Lieu précis",
        value: "[À confirmer — informations à paraître prochainement]",
      },
    ],
  },
  {
    id: "hebergement",
    icon: Bed,
    titre: "Hébergement",
    contenu: [
      {
        label: "Hébergement officiel",
        value: "[À confirmer]",
      },
      {
        label: "Modalités",
        value: "Les délégations seront logées dans un établissement désigné par l'organisation. Toutes les informations seront communiquées lors de la confirmation d'inscription.",
      },
    ],
  },
  {
    id: "transports",
    icon: Car,
    titre: "Transports",
    contenu: [
      {
        label: "Aéroport principal",
        value: "Aéroport International Blaise Diagne (AIBD), Dakar",
      },
      {
        label: "Transferts",
        value: "[Organisation des transferts à confirmer]",
      },
    ],
  },
  {
    id: "visas",
    icon: Globe,
    titre: "Visas & formalités",
    contenu: [
      {
        label: "Visa",
        value: "Les ressortissants de nombreux pays africains et francophones n'ont pas besoin de visa pour entrer au Sénégal. Vérifiez les conditions selon votre nationalité.",
      },
      {
        label: "Lettre d'invitation",
        value: "[Des lettres d'invitation officielles seront fournies aux délégations sur demande]",
      },
    ],
  },
  {
    id: "restauration",
    icon: Utensils,
    titre: "Restauration",
    contenu: [
      {
        label: "Repas",
        value: "[Les modalités de restauration seront précisées dans le guide des délégations]",
      },
      {
        label: "Régimes alimentaires",
        value: "Les besoins spéciaux (allergies, régimes religieux) devront être signalés lors de l'inscription.",
      },
    ],
  },
  {
    id: "delegations",
    icon: Users,
    titre: "Consignes pour chefs de délégation",
    contenu: [
      {
        label: "Réunion des chefs de délégation",
        value: "[Date et lieu à confirmer]",
      },
      {
        label: "Procédure",
        value: "Un guide complet à destination des chefs de délégation sera publié prochainement. Il détaillera toutes les procédures administratives et pratiques.",
      },
    ],
  },
  {
    id: "fuseaux",
    icon: Clock,
    titre: "Fuseau horaire",
    contenu: [
      {
        label: "Fuseau Dakar",
        value: "UTC+0 (GMT) — le Sénégal n'applique pas l'heure d'été",
      },
    ],
  },
];

export default async function InformationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Informations pratiques" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Informations pratiques"
            sousTitre="Tout ce qu'il faut savoir pour préparer votre venue à l'OFM 2027 au Sénégal."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="font-serif text-lg font-bold text-anthracite mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-vert-pale flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-vert" aria-hidden="true" />
                    </div>
                    {section.titre}
                  </h2>
                  <dl className="space-y-3">
                    {section.contenu.map((item, idx) => (
                      <div key={idx}>
                        <dt className="text-xs font-semibold text-gris uppercase tracking-wide mb-0.5">
                          {item.label}
                        </dt>
                        <dd className="text-sm text-anthracite leading-relaxed">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Documents */}
          <div id="documents" className="bg-vert rounded-2xl p-6 text-center">
            <FileText className="w-8 h-8 text-or mx-auto mb-3" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold text-blanc mb-2">
              Guide des délégations
            </h2>
            <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
              Un guide complet sera publié prochainement avec toutes les informations pratiques détaillées pour les délégations.
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blanc/20 text-blanc font-semibold rounded-lg text-sm cursor-default">
              [Document bientôt disponible]
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
