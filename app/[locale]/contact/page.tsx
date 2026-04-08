import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe organisatrice de l'OFM 2027 — Terangamath, Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Contact" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Nous contacter"
            sousTitre="Une question sur l'OFM 2027 ? L'équipe Terangamath est à votre disposition."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-serif text-xl font-bold text-anthracite mb-6">
                  Envoyer un message
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Infos de contact */}
            <div className="space-y-5">
              {/* Email */}
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-anthracite mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-vert" aria-hidden="true" />
                  Email direct
                </h3>
                <a
                  href="mailto:contact@ofm2027.org"
                  className="text-sm font-medium text-vert hover:text-vert-clair transition-colors break-all"
                >
                  contact@ofm2027.org
                </a>
              </div>

              {/* Localisation */}
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-anthracite mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-vert" aria-hidden="true" />
                  Localisation
                </h3>
                <p className="text-sm text-gris">
                  Dakar, Sénégal
                  <br />
                  Afrique de l'Ouest
                </p>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-serif font-bold text-anthracite mb-4">
                  Réseaux sociaux
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Facebook", url: "https://facebook.com/terangamath", short: "Fb" },
                    { label: "Twitter / X", url: "https://twitter.com/terangamath", short: "X" },
                    { label: "Instagram", url: "https://instagram.com/terangamath", short: "In" },
                  ].map(({ label, url, short }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gris hover:text-vert transition-colors group"
                    >
                      <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-bold group-hover:bg-vert-pale group-hover:text-vert transition-colors" aria-hidden="true">{short}</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Note délégations */}
              <div className="bg-vert-pale rounded-2xl p-5">
                <p className="text-xs font-semibold text-vert uppercase tracking-wide mb-1">
                  Délégations nationales
                </p>
                <p className="text-sm text-gris">
                  Pour les questions relatives aux inscriptions et à la participation officielle, veuillez contacter votre coordinateur national ou écrire directement à l'équipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
