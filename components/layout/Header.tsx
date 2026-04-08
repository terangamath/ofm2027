"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  href: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { key: "olympiade", href: "/olympiade" },
  { key: "organisation", href: "/organisation" },
  { key: "equipes", href: "/equipes" },
  { key: "programme", href: "/programme" },
  { key: "informations", href: "/informations" },
  {
    key: "problemes",
    href: "/problemes",
    children: [
      { key: "problemes", href: "/problemes" },
      { key: "resultats", href: "/resultats" },
    ],
  },
  { key: "actualites", href: "/actualites" },
  { key: "contact", href: "/contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu mobile lors des changements de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const localePath = pathname.replace(/^\/(fr|en)/, "") || "/";
    return localePath === href || localePath.startsWith(href + "/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-blanc/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <nav className="container-main" aria-label="Navigation principale">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="OFM 2027 — Accueil"
          >
            <div className="w-9 h-9 rounded-lg bg-vert flex items-center justify-center flex-shrink-0">
              <span className="text-blanc font-serif font-bold text-sm">Σ</span>
            </div>
            <div className="hidden sm:block">
              <div
                className={cn(
                  "font-serif font-bold text-base leading-tight transition-colors",
                  isScrolled ? "text-anthracite" : "text-anthracite"
                )}
              >
                OFM 2027
              </div>
              <div className="text-xs text-gris leading-none">
                Sénégal • Terangamath
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-vert bg-vert-pale"
                      : "text-anthracite hover:text-vert hover:bg-vert-pale/50"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-vert text-blanc hover:bg-vert-clair transition-colors"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="lg:hidden p-2 rounded-md text-anthracite hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("fermer") : t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-blanc border-t border-gray-100 shadow-lg">
          <nav className="container-main py-4" aria-label="Navigation mobile">
            <ul className="space-y-1" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-vert bg-vert-pale"
                        : "text-anthracite hover:bg-gray-50"
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-blanc bg-vert hover:bg-vert-clair transition-colors text-center"
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
