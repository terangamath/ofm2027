import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ExternalLink, ArrowRight, Star } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { getOrganisation, getPartenaires } from "@/lib/content";
import { PartenairesSection } from "@/components/sections/PartenairesSection";
import type { OrgMember, CommitteeType } from "@/types/content";

export const metadata: Metadata = {
  title: "Organisation",
  description: "Présentation de Terangamath, des comités d'organisation et scientifique de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

// Rôles qui méritent une carte « featured »
const FEATURED_ROLES = [
  "président",
  "coordinateur général",
  "responsable scientifique",
  "président du jury",
];

function isFeatured(role: string): boolean {
  const r = role.toLowerCase();
  return FEATURED_ROLES.some((f) => r.includes(f));
}

const COMMITTEE_ORDER: CommitteeType[] = ["organisation", "scientifique", "jury"];

const COMMITTEE_META: Record<CommitteeType, { label: string; surtitre: string; accent: string; bg: "white" | "sable" }> = {
  organisation: {
    label:    "Comité d'organisation",
    surtitre: "Pilotage",
    accent:   "text-vert border-vert/15 bg-vert/8",
    bg:       "white",
  },
  scientifique: {
    label:    "Comité scientifique",
    surtitre: "Expertise",
    accent:   "text-or border-or/20 bg-or/8",
    bg:       "sable",
  },
  jury: {
    label:    "Jury international",
    surtitre: "Délibération",
    accent:   "text-vert border-vert/15 bg-vert/8",
    bg:       "white",
  },
  benevole: {
    label:    "Équipe bénévole",
    surtitre: "Support",
    accent:   "text-gris border-gray-200 bg-gray-50",
    bg:       "sable",
  },
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

  const totalMembers = org.comites.length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Organisation OFM 2027"
      >
        {/* Décoratifs — même système que la homepage */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(45,106,79,0.5), transparent 65%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[45%] h-[70%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.15), transparent 60%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 50%, transparent)" }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <Breadcrumb
            items={[{ label: "Organisation" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[560px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Structure</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                L'équipe<br />
                <span className="text-or">organisatrice</span>
              </h1>
              <p className="type-body text-white/65 max-w-[50ch]">
                L'OFM 2027 est portée par Terangamath en collaboration avec
                un comité d'organisation et un comité scientifique internationaux.
              </p>
            </div>

            {/* Droite — stats rapides */}
            <div className="hidden lg:block">
              <div
                className="rounded-2xl overflow-hidden border border-white/[0.12]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
                }}
              >
                <div
                  className="px-5 py-3.5 border-b border-white/[0.08]"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                >
                  <span className="type-label text-white/45">Structure · OFM 2027</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {[
                    { label: "Organisateur principal", value: "Terangamath" },
                    { label: "Comités",                value: "Organisation · Scientifique · Jury" },
                    { label: "Membres",                value: `${totalMembers} rôles identifiés` },
                    { label: "Pays représentés",       value: "Sénégal + partenaires" },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-5 py-3.5">
                      <p className="type-label text-white/35 mb-1">{label}</p>
                      <p className="text-blanc text-sm font-semibold leading-snug">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3.5 border-t border-white/[0.07]">
                  <a
                    href={org.terangamath.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm text-white/40 hover:text-blanc transition-colors duration-200 group"
                  >
                    <span>terangamath.org</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Terangamath ──────────────────────────────────────────────────── */}
      <Section bg="sable" id="terangamath">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-4 h-px bg-or" aria-hidden="true" />
          <span className="type-label text-or">Organisateur principal</span>
        </div>
        <h2 className="type-h2 text-anthracite mb-10">Terangamath</h2>

        <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Texte */}
          <div className="space-y-6 max-w-[65ch]">
            <p className="type-body text-gris">{org.terangamath.description}</p>

            {/* Mission */}
            <div className="rounded-xl border-l-4 border-vert bg-vert/5 px-5 py-4">
              <p className="type-label text-vert mb-2">Mission</p>
              <p className="type-body-sm text-gris leading-relaxed">{org.terangamath.mission}</p>
            </div>

            <a
              href={org.terangamath.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair hover:gap-3 transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Visiter terangamath.org
            </a>
          </div>

          {/* Carte identité */}
          <div
            className="rounded-2xl border border-gray-100 bg-blanc overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            {/* Header card */}
            <div className="bg-vert px-6 py-5 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-or/20 border border-or/30 flex items-center justify-center mx-auto mb-3">
                  <span className="font-serif text-2xl font-bold text-or">T</span>
                </div>
                <h3 className="type-h3 text-blanc">Terangamath</h3>
              </div>
            </div>
            {/* Body card */}
            <div className="divide-y divide-gray-50">
              <div className="px-5 py-3.5 flex justify-between items-center">
                <span className="type-label text-gris/50">Pays</span>
                <span className="text-sm font-semibold text-anthracite">Sénégal</span>
              </div>
              <div className="px-5 py-3.5 flex justify-between items-center">
                <span className="type-label text-gris/50">Fondée en</span>
                <span className="text-sm font-semibold text-anthracite">{org.terangamath.founded}</span>
              </div>
              <div className="px-5 py-3.5 flex justify-between items-center">
                <span className="type-label text-gris/50">Rôle OFM 2027</span>
                <span className="text-sm font-semibold text-vert">Organisateur</span>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-50">
              <a
                href={org.terangamath.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm font-medium text-gris hover:text-vert transition-colors duration-200 group"
              >
                <span>terangamath.org</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Comités ──────────────────────────────────────────────────────── */}
      {COMMITTEE_ORDER.map((type) => {
        const members = grouped[type];
        if (!members || members.length === 0) return null;
        const meta = COMMITTEE_META[type];

        const featured = members.filter((m) => isFeatured(m.role));
        const regular  = members.filter((m) => !isFeatured(m.role));

        return (
          <Section key={type} bg={meta.bg}>
            {/* Titre de section */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-or" aria-hidden="true" />
              <span className="type-label text-or">{meta.surtitre}</span>
            </div>
            <h2 className="type-h2 text-anthracite mb-8">{meta.label}</h2>

            {/* Rôles clés — cartes prominentes */}
            {featured.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {featured.map((member, idx) => (
                  <FeaturedMemberCard key={idx} member={member} accentClass={meta.accent} />
                ))}
              </div>
            )}

            {/* Membres réguliers — cartes compactes */}
            {regular.length > 0 && (
              <>
                {featured.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="type-label text-gris/40">Membres</span>
                    <div className="flex-1 h-px bg-gray-100" aria-hidden="true" />
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {regular.map((member, idx) => (
                    <CompactMemberCard key={idx} member={member} />
                  ))}
                </div>
              </>
            )}
          </Section>
        );
      })}

      {/* ── Partenaires ──────────────────────────────────────────────────── */}
      <PartenairesSection partenaires={partenaires} />
    </>
  );
}

/* ── Carte membre featured ─────────────────────────────────────────────────── */
function FeaturedMemberCard({ member, accentClass }: { member: OrgMember; accentClass: string }) {
  const isPlaceholder = member.name.startsWith("[");

  return (
    <div
      className={`bg-blanc rounded-2xl border overflow-hidden transition-all duration-200 ${
        isPlaceholder
          ? "border-dashed border-gray-200 opacity-60"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* Bande couleur en haut */}
      <div className={`h-1 ${accentClass.includes("vert") ? "bg-vert" : "bg-or"}`} aria-hidden="true" />

      <div className="p-5">
        {/* Avatar + badge rôle clé */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${
            isPlaceholder ? "bg-gray-100 text-gray-300" : `border ${accentClass}`
          }`}>
            {isPlaceholder ? "?" : member.name.trim().charAt(0).toUpperCase()}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border type-label ${accentClass}`}>
            <Star className="w-2.5 h-2.5" aria-hidden="true" />
            <span>Rôle clé</span>
          </div>
        </div>

        {/* Nom */}
        <p className={`text-sm font-bold leading-tight mb-1 ${
          isPlaceholder ? "text-gris/50 italic" : "text-anthracite"
        }`}>
          {isPlaceholder ? member.name.replace(/^\[/, "").replace(/\]$/, "") : member.name}
        </p>

        {/* Rôle */}
        <p className="type-body-sm text-gris leading-snug mb-2">{member.role}</p>

        {/* Pays */}
        {member.country && (
          <p className={`type-label ${
            member.country.startsWith("[") ? "text-gris/35 italic" : "text-gris/50"
          }`}>
            {member.country}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Carte membre compact ──────────────────────────────────────────────────── */
function CompactMemberCard({ member }: { member: OrgMember }) {
  const isPlaceholder = member.name.startsWith("[");

  return (
    <div
      className={`bg-blanc rounded-xl border flex items-center gap-3.5 p-4 transition-all duration-200 ${
        isPlaceholder
          ? "border-dashed border-gray-200 opacity-55"
          : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        isPlaceholder ? "bg-gray-100 text-gray-300" : "bg-vert-pale text-vert"
      }`}>
        {isPlaceholder ? "?" : member.name.trim().charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold leading-tight truncate ${
          isPlaceholder ? "text-gris/50 italic" : "text-anthracite"
        }`}>
          {isPlaceholder ? member.name.replace(/^\[/, "").replace(/\]$/, "") : member.name}
        </p>
        <p className="type-body-sm text-gris leading-tight truncate mt-0.5">{member.role}</p>
        {member.country && (
          <p className={`type-label mt-0.5 ${
            member.country.startsWith("[") ? "text-gris/30 italic" : "text-gris/45"
          }`}>
            {member.country}
          </p>
        )}
      </div>
    </div>
  );
}
