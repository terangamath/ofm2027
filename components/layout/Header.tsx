"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "olympiade",     href: "/olympiade" },
  { key: "organisation",  href: "/organisation" },
  { key: "equipes",       href: "/equipes" },
  { key: "programme",     href: "/programme" },
  { key: "informations",  href: "/informations" },
  { key: "problemes",     href: "/problemes" },
  { key: "actualites",    href: "/actualites" },
  { key: "historique",    href: "/historique" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Route active (ignore le préfixe locale)
  const localePath = pathname.replace(/^\/(fr|en)/, "") || "/";
  const isActive = (href: string) =>
    localePath === href || localePath.startsWith(href + "/");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-blanc/96 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="OFM 2027 — Accueil"
          >
            {/* Emblème */}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              scrolled ? "bg-vert" : "bg-blanc/15 border border-white/20"
            )}>
              <span className={cn(
                "font-serif font-bold text-sm",
                scrolled ? "text-blanc" : "text-blanc"
              )}>Σ</span>
            </div>
            {/* Texte logo */}
            <div className="hidden sm:block">
              <span className={cn(
                "font-serif font-bold text-sm leading-none block transition-colors",
                scrolled ? "text-anthracite" : "text-blanc"
              )}>
                OFM 2027
              </span>
              <span className={cn(
                "text-[10px] leading-none transition-colors",
                scrolled ? "text-gris" : "text-white/50"
              )}>
                Sénégal · Terangamath
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navigation principale">
            {NAV_ITEMS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                  isActive(href)
                    ? scrolled
                      ? "text-vert bg-vert-pale"
                      : "text-blanc bg-white/15"
                    : scrolled
                      ? "text-anthracite hover:text-vert hover:bg-vert-pale/60"
                      : "text-white/75 hover:text-blanc hover:bg-white/10"
                )}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {/* CTA Contact — desktop */}
            <Link
              href="/contact"
              className={cn(
                "hidden lg:inline-flex items-center px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors",
                scrolled
                  ? "bg-vert text-blanc hover:bg-vert-clair"
                  : "bg-or text-anthracite hover:bg-or-clair"
              )}
            >
              {t("contact")}
            </Link>

            {/* Bouton menu mobile */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors",
                scrolled ? "text-anthracite hover:bg-gray-100" : "text-blanc hover:bg-white/10"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("fermer") : t("menu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-blanc border-t border-gray-100 shadow-lg">
          <nav className="container-main py-3" aria-label="Navigation mobile">
            <ul className="space-y-0.5" role="list">
              {NAV_ITEMS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={cn(
                      "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive(href)
                        ? "text-vert bg-vert-pale"
                        : "text-anthracite hover:bg-gray-50"
                    )}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-100 mt-2">
                <Link
                  href="/contact"
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-blanc bg-vert hover:bg-vert-clair transition-colors text-center"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
