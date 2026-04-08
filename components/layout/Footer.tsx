import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "L'Olympiade",
    links: [
      { label: "Présentation", href: "/olympiade" },
      { label: "Format de compétition", href: "/olympiade#format" },
      { label: "Catégories", href: "/olympiade#categories" },
      { label: "FAQ", href: "/olympiade#faq" },
    ],
  },
  {
    title: "Compétition",
    links: [
      { label: "Équipes participantes", href: "/equipes" },
      { label: "Programme", href: "/programme" },
      { label: "Problèmes", href: "/problemes" },
      { label: "Résultats", href: "/resultats" },
    ],
  },
  {
    title: "Organisation",
    links: [
      { label: "Terangamath", href: "/organisation#terangamath" },
      { label: "Comités", href: "/organisation" },
      { label: "Partenaires", href: "/organisation#partenaires" },
      { label: "Historique", href: "/historique" },
    ],
  },
  {
    title: "Pratique",
    links: [
      { label: "Informations pratiques", href: "/informations" },
      { label: "Actualités", href: "/actualites" },
      { label: "Galerie", href: "/galerie" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIAL_ITEMS = [
  { key: "facebook", label: "Facebook", url: "https://facebook.com/terangamath", short: "Fb" },
  { key: "twitter", label: "X / Twitter", url: "https://twitter.com/terangamath", short: "X" },
  { key: "instagram", label: "Instagram", url: "https://instagram.com/terangamath", short: "In" },
];

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-anthracite text-white/80" role="contentinfo">
      {/* Bande supérieure */}
      <div className="border-b border-white/10">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Identité */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-9 h-9 rounded-lg bg-vert flex items-center justify-center">
                  <span className="text-blanc font-serif font-bold text-sm">Σ</span>
                </div>
                <div>
                  <div className="font-serif font-bold text-blanc text-base leading-tight">OFM 2027</div>
                  <div className="text-xs text-white/50 leading-none">Sénégal</div>
                </div>
              </Link>
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                Olympiade Francophone de Mathématiques 2027 — organisée par Terangamath au Sénégal.
              </p>
              {/* Réseaux sociaux */}
              <div className="flex gap-3">
                {SOCIAL_ITEMS.map((item) => (
                  <a
                    key={item.key}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Terangamath sur ${item.label}`}
                    className="w-8 h-8 rounded-md bg-white/10 hover:bg-or/20 hover:text-or flex items-center justify-center transition-colors text-xs font-bold"
                  >
                    {item.short}
                  </a>
                ))}
              </div>
            </div>

            {/* Liens */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <h3 className="font-semibold text-blanc text-sm mb-4">{col.title}</h3>
                <ul className="space-y-2.5" role="list">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-blanc transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bande inférieure */}
      <div className="container-main py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>{t("droits").replace("2027", String(currentYear))}</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white/70 transition-colors">
              {t("contact")}
            </Link>
            <Link href="/mentions-legales" className="hover:text-white/70 transition-colors">
              {t("mentions")}
            </Link>
            <a
              href="mailto:contact@ofm2027.org"
              className="inline-flex items-center gap-1.5 hover:text-white/70 transition-colors"
            >
              <Mail className="w-3 h-3" aria-hidden="true" />
              contact@ofm2027.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
