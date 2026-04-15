import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Plane, Bed, Shield, Sun, CreditCard, Phone,
  CheckCircle2, FileText, ArrowRight, Clock, Languages,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Informations pratiques",
  description:
    "Tout ce qu'il faut savoir pour préparer votre participation à l'OFM 2027 à Dakar, Sénégal — transport, hébergement, visa, climat, monnaie.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

// ── Sections principales (2 × 2) ──────────────────────────────────────────────

type AccentColor = "vert" | "or";

interface InfoItem {
  label: string;
  value: string;
  placeholder?: boolean;
}

interface MainSection {
  id: string;
  icon: LucideIcon;
  accent: AccentColor;
  surtitre: string;
  titre: string;
  items: InfoItem[];
}

const MAIN_SECTIONS: MainSection[] = [
  {
    id: "lieu",
    icon: MapPin,
    accent: "vert",
    surtitre: "Localisation",
    titre: "Lieu de l'événement",
    items: [
      { label: "Ville hôte", value: "Dakar, Sénégal" },
      {
        label: "Site de la compétition",
        value: "[À confirmer — informations à paraître prochainement]",
        placeholder: true,
      },
    ],
  },
  {
    id: "transport",
    icon: Plane,
    accent: "or",
    surtitre: "Logistique",
    titre: "Accès & transport",
    items: [
      {
        label: "Aéroport principal",
        value: "Aéroport International Blaise Diagne (AIBD), à ~47 km de Dakar",
      },
      {
        label: "Liaison aéroport–ville",
        value: "Navette Train Express Régional (TER) ou taxi agréé disponibles",
      },
      {
        label: "Transferts officiels",
        value: "[Organisation des transferts à confirmer]",
        placeholder: true,
      },
    ],
  },
  {
    id: "hebergement",
    icon: Bed,
    accent: "vert",
    surtitre: "Logement",
    titre: "Hébergement",
    items: [
      {
        label: "Hébergement officiel",
        value: "[À confirmer par l'organisation]",
        placeholder: true,
      },
      {
        label: "Modalités",
        value:
          "Les délégations seront logées dans un établissement désigné par l'organisation. Les détails seront communiqués à la confirmation d'inscription.",
      },
    ],
  },
  {
    id: "visa",
    icon: Shield,
    accent: "or",
    surtitre: "Formalités",
    titre: "Visa & documents",
    items: [
      {
        label: "Visa",
        value:
          "Les ressortissants de nombreux pays africains et francophones n'ont pas besoin de visa. Vérifiez les conditions selon votre nationalité.",
      },
      {
        label: "Lettre d'invitation",
        value:
          "[Des lettres officielles seront fournies aux délégations sur demande]",
        placeholder: true,
      },
    ],
  },
];

// ── Sections secondaires (3 colonnes) ─────────────────────────────────────────

interface SecondarySection {
  id: string;
  icon: LucideIcon;
  surtitre: string;
  titre: string;
  items: InfoItem[];
}

const SECONDARY_SECTIONS: SecondarySection[] = [
  {
    id: "climat",
    icon: Sun,
    surtitre: "Environnement",
    titre: "Climat",
    items: [
      {
        label: "Saison en juillet",
        value: "Hivernage (saison des pluies) — 28 à 33 °C",
      },
      {
        label: "À prévoir",
        value: "Vêtements légers, protection solaire, imperméable léger",
      },
    ],
  },
  {
    id: "monnaie",
    icon: CreditCard,
    surtitre: "Finance",
    titre: "Monnaie & paiements",
    items: [
      { label: "Monnaie locale", value: "Franc CFA (XOF)" },
      {
        label: "Cartes & espèces",
        value:
          "Espèces recommandées pour les petits achats. Cartes acceptées dans les hôtels et grands commerces.",
      },
      {
        label: "Change",
        value: "Bureaux de change à l'aéroport et en centre-ville",
      },
    ],
  },
  {
    id: "contacts",
    icon: Phone,
    surtitre: "Assistance",
    titre: "Contacts utiles",
    items: [
      { label: "Organisation", value: "Terangamath — contact@terangamath.org" },
      { label: "Urgences locales", value: "Police : 17 · SAMU : 15 · Pompiers : 18" },
      { label: "Indicatif pays", value: "+221 (Sénégal)" },
    ],
  },
];

// ── Checklist conseils pratiques ──────────────────────────────────────────────

const CHECKLIST = [
  "Vérifier les conditions de visa selon votre nationalité",
  "Prévoir un adaptateur électrique (prises françaises, 220 V)",
  "Emporter une petite pharmacie personnelle",
  "Prévoir de la monnaie locale (Franc CFA) pour les petits achats",
  "Souscrire une assurance voyage couvrant l'Afrique de l'Ouest",
  "Conserver une copie de votre passeport séparément de l'original",
  "Télécharger les documents de l'OFM et les contacts d'urgence",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isPlaceholder(value: string) {
  return value.startsWith("[");
}

export default async function InformationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Informations pratiques OFM 2027"
      >
        {/* Fond décoratif */}
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
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(45,106,79,0.5), transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[45%] h-[70%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.15), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 50%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <Breadcrumb
            items={[{ label: "Informations pratiques" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[540px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Dakar, Sénégal</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                Informations
                <br />
                <span className="text-or">pratiques</span>
              </h1>
              <p className="type-body text-white/65 max-w-[48ch]">
                Tout ce qu'il faut savoir pour préparer votre participation à
                l'OFM 2027 au Sénégal — transport, hébergement, formalités et
                conseils de voyage.
              </p>
            </div>

            {/* Droite — résumé rapide */}
            <div className="hidden lg:block">
              <div
                className="rounded-2xl overflow-hidden border border-white/[0.12]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
                }}
              >
                <div
                  className="px-5 py-3.5 border-b border-white/[0.08]"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                >
                  <span className="type-label text-white/45">Repères · Dakar</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {[
                    { icon: MapPin,     label: "Ville",      value: "Dakar, Sénégal" },
                    { icon: Plane,      label: "Aéroport",   value: "AIBD — Blaise Diagne" },
                    { icon: Clock,      label: "Fuseau",     value: "UTC+0 (GMT) — sans heure d'été" },
                    { icon: Languages,  label: "Langue",     value: "Français / Wolof" },
                    { icon: CreditCard, label: "Monnaie",    value: "Franc CFA (XOF)" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-5 py-3.5 flex items-start gap-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(201,168,76,0.12)",
                          border: "1px solid rgba(201,168,76,0.18)",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 text-or" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="type-label text-white/35 mb-1">{label}</p>
                        <p className="text-blanc text-sm font-semibold leading-snug">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1 : 4 informations principales ────────────────────────── */}
      <Section bg="sable" id="principal">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-or" aria-hidden="true" />
            <span className="type-label text-or">Essentiel</span>
          </div>
          <h2 className="type-h2 text-anthracite">Ce qu'il faut savoir</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {MAIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const iconBg =
              section.accent === "vert"
                ? "bg-vert/8 border-vert/15"
                : "bg-or/10 border-or/20";
            const iconColor =
              section.accent === "vert" ? "text-vert" : "text-or";
            const labelColor =
              section.accent === "vert" ? "text-vert" : "text-or";

            return (
              <article
                key={section.id}
                id={section.id}
                className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* En-tête de carte */}
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className={`type-label mb-0.5 ${labelColor}`}>
                      {section.surtitre}
                    </p>
                    <h3 className="type-h4 text-anthracite">{section.titre}</h3>
                  </div>
                </div>

                {/* Contenu */}
                <dl className="p-5 space-y-4">
                  {section.items.map((item, idx) => (
                    <div key={idx}>
                      <dt className="type-label text-gris/50 mb-1">{item.label}</dt>
                      <dd
                        className={`type-body-sm leading-relaxed ${
                          isPlaceholder(item.value)
                            ? "text-gris/40 italic"
                            : "text-anthracite"
                        }`}
                      >
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ── Section 2 : Climat, Monnaie, Contacts ─────────────────────────── */}
      <Section bg="white" id="details">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-or" aria-hidden="true" />
            <span className="type-label text-or">Sur place</span>
          </div>
          <h2 className="type-h2 text-anthracite">Vie quotidienne à Dakar</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {SECONDARY_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.id}
                id={section.id}
                className="bg-sable rounded-2xl border border-sable-fonce/50 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-sable-fonce/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blanc border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-4 h-4 text-vert-clair" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="type-label text-gris/40 mb-0.5">{section.surtitre}</p>
                    <h3 className="type-h4 text-anthracite">{section.titre}</h3>
                  </div>
                </div>

                <dl className="p-5 space-y-4">
                  {section.items.map((item, idx) => (
                    <div key={idx}>
                      <dt className="type-label text-gris/50 mb-1">{item.label}</dt>
                      <dd className="type-body-sm text-anthracite leading-relaxed">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ── Section 3 : Checklist conseils pratiques ──────────────────────── */}
      <Section bg="sable" id="conseils">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-or" aria-hidden="true" />
              <span className="type-label text-or">Conseils pratiques</span>
            </div>
            <h2 className="type-h2 text-anthracite mb-3">Checklist avant le départ</h2>
            <p className="type-body text-gris max-w-[58ch]">
              Pour voyager sereinement et profiter pleinement de l'OFM 2027.
            </p>
          </div>

          <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <ul
              className="grid sm:grid-cols-2 gap-x-8 gap-y-3"
              role="list"
              aria-label="Checklist avant le départ"
            >
              {CHECKLIST.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-vert/8 border border-vert/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-vert" aria-hidden="true" />
                  </div>
                  <span className="type-body-sm text-anthracite leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── CTA Guide des délégations ─────────────────────────────────────── */}
      <Section bg="vert" id="guide">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icône */}
          <div className="w-12 h-12 rounded-2xl bg-or/15 border border-or/25 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-5 h-5 text-or" aria-hidden="true" />
          </div>

          <p className="type-label text-white/40 mb-2">Document officiel</p>
          <h2 className="font-serif text-2xl font-bold text-blanc mb-3">
            Guide des délégations
          </h2>
          <p className="type-body-sm text-white/60 max-w-[48ch] mx-auto mb-8">
            Un guide complet avec toutes les informations pratiques,
            administratives et logistiques sera publié prochainement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm font-semibold text-white/60 cursor-default">
              [Document bientôt disponible]
            </span>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-or text-anthracite font-semibold rounded-lg text-sm hover:bg-or-clair transition-colors duration-200"
            >
              Nous contacter
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
