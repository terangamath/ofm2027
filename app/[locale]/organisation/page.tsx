import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getOrganisation, getPartenaires } from "@/lib/content";
import { PartenairesSection } from "@/components/sections/PartenairesSection";
import { User, ExternalLink } from "lucide-react";
import type { OrgMember, CommitteeType } from "@/types/content";

export const metadata: Metadata = {
  title: "Organisation",
  description: "Présentation de Terangamath, des comités d'organisation et scientifique de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

const COMMITTEE_LABELS: Record<CommitteeType, string> = {
  organisation: "Comité d'organisation",
  scientifique: "Comité scientifique",
  jury: "Jury",
  benevole: "Équipe bénévole",
};

export default async function OrganisationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const org = getOrganisation() as {
    comites: OrgMember[];
    terangamath: {
      description: string;
      mission: string;
      founded: string;
      website: string;
    };
  };
  const partenaires = getPartenaires();

  const grouped = org.comites.reduce<Record<string, OrgMember[]>>((acc, m) => {
    const key = m.committee;
    if (!acc[key]) acc[key] = [];
    (acc[key] as OrgMember[]).push(m);
    return acc;
  }, {});

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Organisation" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Organisation"
            sousTitre="L'OFM 2027 est portée par Terangamath, en collaboration avec un comité d'organisation et un comité scientifique internationaux."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">

          {/* Terangamath */}
          <section id="terangamath" className="mb-14" aria-labelledby="terangamath-titre">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <SectionHeader
                  surtitre="Organisateur principal"
                  titre="Terangamath"
                  className="mb-4"
                />
                <p className="text-gris leading-relaxed mb-4">
                  {org.terangamath.description}
                </p>
                <div className="bg-vert-pale rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-vert mb-1">Mission</p>
                  <p className="text-sm text-gris">{org.terangamath.mission}</p>
                </div>
                <a
                  href={org.terangamath.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Visiter terangamath.org
                </a>
              </div>
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-vert-pale flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-3xl font-bold text-vert">T</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-anthracite mb-1">Terangamath</h3>
                <p className="text-gris text-sm mb-2">Sénégal</p>
                <p className="text-xs text-gris">Fondée en {org.terangamath.founded}</p>
              </div>
            </div>
          </section>

          {/* Comités */}
          {(["organisation", "scientifique", "jury"] as CommitteeType[]).map((type) => {
            const members = grouped[type];
            if (!members || members.length === 0) return null;
            return (
              <section key={type} className="mb-12" aria-labelledby={`comite-${type}`}>
                <h2
                  id={`comite-${type}`}
                  className="font-serif text-2xl font-bold text-anthracite mb-6"
                >
                  {COMMITTEE_LABELS[type]}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-blanc rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-vert-pale flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-vert" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-anthracite text-sm leading-tight truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gris mt-0.5 leading-tight">{member.role}</p>
                        {member.country && (
                          <p className="text-xs text-gris/60 mt-0.5">{member.country}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Partenaires */}
      <PartenairesSection partenaires={partenaires} />
    </>
  );
}
