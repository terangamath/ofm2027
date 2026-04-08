import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site officiel de l'OFM 2027.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function MentionsLegalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="bg-vert pt-24 pb-12">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Mentions légales" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <h1 className="font-serif text-3xl font-bold text-blanc">Mentions légales</h1>
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main max-w-2xl">
          <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="prose-ofm text-gris space-y-6">
              <section>
                <h2>Éditeur du site</h2>
                <p>
                  Le présent site est édité par l'association <strong>Terangamath</strong>,
                  organisatrice de l'Olympiade Francophone de Mathématiques 2027.
                </p>
                <p>
                  Contact : <a href="mailto:contact@ofm2027.org">contact@ofm2027.org</a>
                </p>
              </section>

              <section>
                <h2>Hébergement</h2>
                <p>
                  Ce site est hébergé par <strong>Vercel Inc.</strong><br />
                  340 Pine Street, Suite 701, San Francisco, CA 94104, USA
                </p>
              </section>

              <section>
                <h2>Propriété intellectuelle</h2>
                <p>
                  L'ensemble du contenu de ce site (textes, problèmes mathématiques, logos,
                  graphismes) est la propriété de Terangamath et/ou de ses partenaires.
                  Toute reproduction sans autorisation est interdite.
                </p>
              </section>

              <section>
                <h2>Données personnelles</h2>
                <p>
                  Les données collectées via le formulaire de contact sont utilisées
                  uniquement pour répondre à vos demandes. Elles ne sont pas cédées à des
                  tiers. Conformément à la réglementation applicable, vous disposez d'un
                  droit d'accès, de rectification et de suppression de vos données.
                </p>
              </section>

              <section>
                <h2>Cookies</h2>
                <p>
                  Ce site n'utilise pas de cookies à des fins de traçage ou de publicité.
                  Les seuls cookies éventuellement présents sont fonctionnels et nécessaires
                  au bon fonctionnement du site.
                </p>
              </section>

              <p className="text-xs text-gris/60 pt-4 border-t border-gray-100">
                Dernière mise à jour : avril 2027
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
