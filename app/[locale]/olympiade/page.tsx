import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Users, FileText, CheckCircle2, Calendar, MapPin, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { getFAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "L'Olympiade",
  description:
    "Présentation de l'Olympiade Francophone de Mathématiques : objectifs, format, catégories Junior et Senior, et mode d'organisation.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

const OBJECTIFS = [
  "Promouvoir l'excellence mathématique dans l'espace francophone",
  "Encourager les jeunes talents et soutenir leur développement",
  "Renforcer les échanges éducatifs et culturels entre nations francophones",
  "Valoriser le rôle des mathématiques dans le développement scientifique",
  "Créer une communauté mathématique francophone vivante et dynamique",
];

const FORMAT_ITEMS = [
  { label: "2 jours",          detail: "d'épreuves écrites individuelles" },
  { label: "4 à 6 problèmes",  detail: "par épreuve, originaux et inédits" },
  { label: "7 points",         detail: "par problème (notation internationale)" },
  { label: "Jury international", detail: "pour la délibération et validation" },
];

const DOCUMENTS = [
  { title: "Règlement officiel OFM 2027" },
  { title: "Guide des délégations" },
  { title: "Formulaire d'inscription" },
];

const MEDAILLES = [
  { label: "Or",               color: "bg-yellow-400",  text: "text-yellow-700" },
  { label: "Argent",           color: "bg-gray-300",    text: "text-gray-600"   },
  { label: "Bronze",           color: "bg-orange-400",  text: "text-orange-700" },
  { label: "Mention honorable", color: "bg-blue-300",   text: "text-blue-700"   },
];

export default async function OlympiadePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faq = getFAQ();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="L'Olympiade Francophone de Mathématiques"
      >
        {/* Fond décoratif — même système que la home */}
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
          {/* Breadcrumb */}
          <Breadcrumb
            items={[{ label: "L'Olympiade" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[580px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Dakar, Sénégal</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                L'Olympiade
                <br />Francophone
                <br /><span className="text-or">de Mathématiques</span>
              </h1>
              <p className="type-body text-white/65 max-w-[52ch]">
                La grande compétition internationale de mathématiques du monde
                francophone, réunissant chaque année les meilleurs jeunes talents.
              </p>
            </div>

            {/* Droite — résumé compact */}
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
                  <span className="type-label text-white/45">Informations clés · édition 2027</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {[
                    { icon: MapPin,    label: "Lieu",       value: "Dakar, Sénégal" },
                    { icon: Calendar,  label: "Dates",      value: "[À confirmer] — Juillet 2027" },
                    { icon: Users,     label: "Catégories", value: "Junior (collège) · Senior (lycée)" },
                    { icon: Clock,     label: "Format",     value: "2 jours d'épreuves écrites" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3.5 px-5 py-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.18)" }}
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
                <div className="px-5 py-3.5 border-t border-white/[0.07]">
                  <Link
                    href="/informations"
                    className="flex items-center justify-between text-sm text-white/40 hover:text-blanc transition-colors duration-200 group"
                  >
                    <span>Informations pratiques</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenu + Sidebar ─────────────────────────────────────────────── */}
      <Section bg="sable">
        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-14 items-start">

          {/* ── Corps principal ────────────────────────────────────────────── */}
          <div className="space-y-14">

            {/* Qu'est-ce que l'OFM */}
            <section aria-labelledby="section-presentation">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">Présentation</span>
              </div>
              <h2 id="section-presentation" className="type-h2 text-anthracite mb-5">
                Qu'est-ce que l'OFM ?
              </h2>
              <div className="space-y-4 max-w-[65ch]">
                <p className="type-body text-gris">
                  L'<strong className="font-semibold text-anthracite">Olympiade Francophone de Mathématiques (OFM)</strong> est
                  une compétition internationale de mathématiques qui rassemble chaque année
                  des élèves francophones du monde entier. Elle célèbre l'excellence
                  mathématique, renforce les liens entre les communautés éducatives
                  francophones et valorise la jeunesse africaine et internationale.
                </p>
                <p className="type-body text-gris">
                  Organisée annuellement dans un pays hôte différent, l'OFM constitue
                  un rendez-vous incontournable pour les élèves passionnés de mathématiques,
                  leurs enseignants et les institutions académiques du monde francophone.
                </p>
              </div>
            </section>

            {/* Objectifs */}
            <section aria-labelledby="section-objectifs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">Mission</span>
              </div>
              <h2 id="section-objectifs" className="type-h2 text-anthracite mb-6">
                Objectifs
              </h2>
              <ul className="space-y-3" role="list">
                {OBJECTIFS.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-lg bg-vert/8 border border-vert/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-vert" aria-hidden="true" />
                    </div>
                    <p className="type-body text-gris leading-snug pt-0.5">{obj}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Format de la compétition */}
            <section aria-labelledby="section-format">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">Organisation</span>
              </div>
              <h2 id="section-format" className="type-h2 text-anthracite mb-3">
                Format de la compétition
              </h2>
              <p className="type-body text-gris max-w-[60ch] mb-6">
                La compétition se déroule sur plusieurs jours avec des épreuves
                individuelles écrites. Chaque participant résout un ensemble de
                problèmes originaux élaborés par le comité scientifique. Les
                résultats sont arrêtés par un jury international.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {FORMAT_ITEMS.map(({ label, detail }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-blanc border border-gray-100 rounded-xl p-4 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-vert text-blanc text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-anthracite leading-tight">{label}</p>
                      <p className="text-xs text-gris mt-0.5 leading-snug">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Édition 2027 */}
            <section aria-labelledby="section-2027">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">Sénégal</span>
              </div>
              <h2 id="section-2027" className="type-h2 text-anthracite mb-5">
                L'édition 2027 au Sénégal
              </h2>
              <div className="space-y-4 max-w-[65ch]">
                <p className="type-body text-gris">
                  L'OFM 2027 est organisée par l'association <strong className="font-semibold text-anthracite">Terangamath</strong>,
                  en partenariat avec les institutions académiques sénégalaises.
                  Elle se déroulera à Dakar, capitale scientifique et culturelle
                  de l'Afrique de l'Ouest.
                </p>
                <p className="type-body-sm text-gris/65 italic border-l-2 border-or/30 pl-4">
                  Le programme détaillé, les lieux et les modalités précises
                  seront communiqués progressivement sur ce site.
                </p>
              </div>
            </section>

            {/* Documents */}
            <section aria-labelledby="section-documents">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">Ressources</span>
              </div>
              <h2 id="section-documents" className="type-h2 text-anthracite mb-5">
                Documents officiels
              </h2>
              <div className="space-y-2.5">
                {DOCUMENTS.map((doc) => (
                  <div
                    key={doc.title}
                    className="flex items-center justify-between px-5 py-3.5 bg-blanc rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sable border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-gris" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-semibold text-anthracite">{doc.title}</span>
                    </div>
                    <span className="type-label text-gris/40 flex-shrink-0">Bientôt disponible</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 space-y-4">

            {/* Catégories */}
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-vert/8 border border-vert/15 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-vert" aria-hidden="true" />
                </div>
                <h3 className="type-h4 text-anthracite">Catégories</h3>
              </div>
              <div className="p-4 space-y-3">
                {/* Junior */}
                <div className="rounded-xl border border-vert/15 bg-vert-pale/30 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-vert flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-vert">Junior</span>
                  </div>
                  <p className="type-body-sm text-gris">Élèves de collège</p>
                  <p className="type-label text-gris/50 mt-1">jusqu'en 3ème incluse</p>
                </div>
                {/* Senior */}
                <div className="rounded-xl border border-or/20 bg-or-pale/50 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-or flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-or">Senior</span>
                  </div>
                  <p className="type-body-sm text-gris">Élèves de lycée</p>
                  <p className="type-label text-gris/50 mt-1">Seconde à Terminale</p>
                </div>
              </div>
            </div>

            {/* Médailles */}
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-or/10 border border-or/20 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-or" aria-hidden="true" />
                </div>
                <h3 className="type-h4 text-anthracite">Distinctions</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {MEDAILLES.map(({ label, color, text }) => (
                    <div key={label} className="flex items-center gap-3 py-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${color}`} aria-hidden="true" />
                      <span className={`text-sm font-semibold ${text}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA contact */}
            <div
              className="rounded-2xl p-5 text-center overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-or/15 border border-or/25 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-4.5 h-4.5 text-or" aria-hidden="true" />
                </div>
                <p className="type-label text-white/50 mb-1">Une question ?</p>
                <p className="text-blanc text-sm font-semibold mb-4">
                  Notre équipe répond à toutes vos questions sur l'OFM 2027.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-or text-anthracite font-semibold rounded-lg text-sm hover:bg-or-clair transition-colors duration-200"
                >
                  Nous contacter
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Lien équipes */}
            <Link
              href="/equipes"
              className="group flex items-center justify-between px-5 py-4 bg-blanc rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-vert/20 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gris/50" aria-hidden="true" />
                <span className="text-sm font-semibold text-anthracite group-hover:text-vert transition-colors duration-200">
                  Voir les équipes
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gris/30 group-hover:text-vert group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </Section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FAQSection items={faq} limit={6} showLink={false} />
    </>
  );
}
