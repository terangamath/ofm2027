import Link from "next/link";
import { Mail } from "lucide-react";

const NAV_COLS = [
  {
    title: "Compétition",
    links: [
      { label: "L'Olympiade", href: "/olympiade" },
      { label: "Équipes",     href: "/equipes" },
      { label: "Programme",   href: "/programme" },
      { label: "Problèmes",   href: "/problemes" },
      { label: "Résultats",   href: "/resultats" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Organisation",       href: "/organisation" },
      { label: "Infos pratiques",    href: "/informations" },
      { label: "Actualités",         href: "/actualites" },
      { label: "Historique",         href: "/historique" },
      { label: "Galerie",            href: "/galerie" },
    ],
  },
];

const SOCIAL = [
  { label: "Fb", title: "Facebook",   url: "https://facebook.com/terangamath" },
  { label: "X",  title: "Twitter / X", url: "https://twitter.com/terangamath" },
  { label: "In", title: "Instagram",   url: "https://instagram.com/terangamath" },
];

export function Footer() {
  return (
    <footer className="bg-anthracite" role="contentinfo">
      <div className="container-main py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-8 md:gap-12">

          {/* Identité */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="w-7 h-7 rounded-md bg-vert flex items-center justify-center">
                <span className="font-serif font-bold text-xs text-blanc">Σ</span>
              </div>
              <span className="font-serif font-bold text-sm text-blanc leading-tight">OFM 2027</span>
            </Link>
            <p className="text-white/45 text-xs leading-relaxed max-w-[220px] mb-4">
              Olympiade Francophone de Mathématiques 2027 — Dakar, Sénégal.
              <br />Organisée par Terangamath.
            </p>
            {/* Réseaux */}
            <div className="flex gap-2 mb-4">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Terangamath sur ${s.title}`}
                  className="w-7 h-7 rounded-md bg-white/8 hover:bg-or/20 hover:text-or text-white/40 flex items-center justify-center text-[10px] font-bold transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href="mailto:contact@ofm2027.org"
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-blanc transition-colors"
            >
              <Mail className="w-3 h-3" aria-hidden="true" />
              contact@ofm2027.org
            </a>
          </div>

          {/* Colonnes de nav */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-3">
                {col.title}
              </p>
              <ul className="space-y-2" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/50 hover:text-blanc transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-3">
              Contact
            </p>
            <ul className="space-y-2" role="list">
              <li>
                <Link href="/contact" className="text-xs text-white/50 hover:text-blanc transition-colors">
                  Formulaire de contact
                </Link>
              </li>
              <li>
                <Link href="/informations" className="text-xs text-white/50 hover:text-blanc transition-colors">
                  Infos pratiques
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-xs text-white/50 hover:text-blanc transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="mt-8 pt-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/25">
          <p>© 2027 OFM 2027 — Terangamath. Tous droits réservés.</p>
          <p>Site officiel · Sénégal</p>
        </div>
      </div>
    </footer>
  );
}
