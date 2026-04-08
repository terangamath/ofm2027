import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { getFAQ } from "@/lib/content";
import { BookOpen, Trophy, Users, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "L'Olympiade",
  description:
    "Présentation de l'Olympiade Francophone de Mathématiques : objectifs, format, catégories Junior et Senior, et mode d'organisation.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function OlympiadePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faq = getFAQ();

  return (
    <>
      {/* En-tête de page */}
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "L'Olympiade" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="L'Olympiade Francophone\nde Mathématiques"
            sousTitre="La grande compétition mathématique du monde francophone, réunissant chaque année les meilleurs jeunes talents."
            light
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="section-padding bg-sable">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Corps principal */}
            <div className="lg:col-span-2 space-y-10">

              {/* Qu'est-ce que l'OFM */}
              <section aria-labelledby="section-presentation">
                <h2 id="section-presentation" className="font-serif text-2xl font-bold text-anthracite mb-4">
                  Qu'est-ce que l'OFM ?
                </h2>
                <div className="prose-ofm text-gris">
                  <p>
                    L'<strong>Olympiade Francophone de Mathématiques (OFM)</strong> est une compétition internationale
                    de mathématiques qui rassemble chaque année des élèves francophones du monde entier. Elle célèbre
                    l'excellence mathématique, renforce les liens entre les communautés éducatives francophones et
                    valorise la jeunesse africaine et internationale.
                  </p>
                  <p>
                    Organisée annuellement dans un pays hôte différent, l'OFM constitue un rendez-vous incontournable
                    pour les élèves passionnés de mathématiques, leurs enseignants et les institutions académiques du
                    monde francophone.
                  </p>

                  <h2>Objectifs</h2>
                  <ul>
                    <li>Promouvoir l'excellence mathématique dans l'espace francophone</li>
                    <li>Encourager les jeunes talents et soutenir leur développement</li>
                    <li>Renforcer les échanges éducatifs et culturels entre nations francophones</li>
                    <li>Valoriser le rôle des mathématiques dans le développement scientifique</li>
                    <li>Créer une communauté mathématique francophone vivante et dynamique</li>
                  </ul>

                  <h2>Format de la compétition</h2>
                  <p>
                    La compétition se déroule sur plusieurs jours, avec des épreuves individuelles écrites.
                    Chaque participant résout un ensemble de problèmes originaux, élaborés par le comité scientifique.
                    Les résultats sont arrêtés par un jury international.
                  </p>
                  <ul>
                    <li>2 jours d'épreuves écrites individuelles</li>
                    <li>4 à 6 problèmes par épreuve</li>
                    <li>Notation sur 7 points par problème</li>
                    <li>Jury international pour la délibération</li>
                  </ul>
                </div>
              </section>

              {/* Mode d'organisation 2027 */}
              <section aria-labelledby="section-2027">
                <h2 id="section-2027" className="font-serif text-2xl font-bold text-anthracite mb-4">
                  L'édition 2027 au Sénégal
                </h2>
                <div className="prose-ofm text-gris">
                  <p>
                    L'OFM 2027 est organisée par l'association <strong>Terangamath</strong>, en partenariat avec les
                    institutions académiques sénégalaises. Elle se déroulera à Dakar, capitale scientifique et
                    culturelle de l'Afrique de l'Ouest.
                  </p>
                  <p>
                    [Le programme détaillé, les lieux et les modalités précises seront communiqués progressivement
                    sur ce site.]
                  </p>
                </div>
              </section>

              {/* Documents */}
              <section aria-labelledby="section-documents">
                <h2 id="section-documents" className="font-serif text-2xl font-bold text-anthracite mb-4">
                  Documents officiels
                </h2>
                <div className="space-y-3">
                  {[
                    { title: "Règlement officiel OFM 2027", status: "coming_soon" },
                    { title: "Guide des délégations", status: "coming_soon" },
                    { title: "Formulaire d'inscription", status: "coming_soon" },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center justify-between p-4 bg-blanc rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gris" aria-hidden="true" />
                        <span className="text-sm font-medium text-anthracite">{doc.title}</span>
                      </div>
                      <span className="text-xs text-gris italic">[Bientôt disponible]</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Catégories */}
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-anthracite mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-vert" aria-hidden="true" />
                  Catégories
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-vert-pale rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-vert" aria-hidden="true" />
                      <span className="font-semibold text-vert text-sm">Junior</span>
                    </div>
                    <p className="text-xs text-gris">Élèves de collège (jusqu'en 3ème incluse)</p>
                  </div>
                  <div className="p-4 bg-or-pale rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-or" aria-hidden="true" />
                      <span className="font-semibold text-or text-sm">Senior</span>
                    </div>
                    <p className="text-xs text-gris">Élèves de lycée (Seconde à Terminale)</p>
                  </div>
                </div>
              </div>

              {/* Format rapide */}
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-anthracite mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-or" aria-hidden="true" />
                  Médailles
                </h3>
                <div className="space-y-2 text-sm">
                  {["Or", "Argent", "Bronze", "Mention honorable"].map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          m === "Or" ? "bg-yellow-400"
                          : m === "Argent" ? "bg-gray-400"
                          : m === "Bronze" ? "bg-orange-400"
                          : "bg-blue-400"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-gris">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-vert rounded-2xl p-6 text-center">
                <BookOpen className="w-6 h-6 text-or mx-auto mb-3" aria-hidden="true" />
                <p className="text-white/80 text-sm mb-4">
                  Des questions sur l'OFM 2027 ?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-or text-anthracite font-semibold rounded-lg text-sm hover:bg-or-clair transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQSection items={faq} limit={6} showLink={false} />
    </>
  );
}
