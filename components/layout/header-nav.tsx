"use client";

import { ViewTransition, useEffect, useState } from "react";
import { useLinkStatus } from "next/link";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageList, LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/brand/logo";

export interface NavItem {
  href: "/olympiade" | "/equipes" | "/programme" | "/problemes";
  label: string;
}

interface HeaderNavProps {
  items: NavItem[];
  locale: string;
  locales: string[];
  labels: {
    skipToContent: string;
    menuOpen: string;
    menuClose: string;
    navLabel: string;
    languageSwitcher: string;
    themeToLight: string;
    themeToDark: string;
  };
}

/**
 * Retour de chargement d'un lien : un filet qui apparaît sous le libellé si la
 * navigation dure plus de 150 ms (délai porté par l'animation CSS). Invisible
 * quand la page arrive tout de suite.
 */
function Chargement() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={`lien-chargement ${pending ? "en-cours" : ""}`} />;
}

/** Rubrique courante : la page elle-même ou l'une de ses sous-pages (fiche pays…). L'accueil n'en sélectionne aucune. */
function estActif(pathname: string, href: NavItem["href"]): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav({ items, locale, locales, labels }: HeaderNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const premier = window.setTimeout(onScroll, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(premier);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background transition-[border-color] duration-150 ${
        scrolled ? "border-hairline" : "border-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        {labels.skipToContent}
      </a>

      <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:h-[5.625rem] lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start rounded-sm active:opacity-70">
          <Logo />
        </Link>

        <nav aria-label={labels.navLabel} className="hidden lg:block">
          <ul className="flex h-[3.125rem] items-center gap-1 rounded-full border border-nav-capsule-bord bg-nav-capsule p-1">
            {items.map((item) => {
              const active = estActif(pathname, item.href);
              return (
                <li key={item.href} className="h-full">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-full items-center rounded-full px-4 text-[1.0625rem] leading-none font-semibold whitespace-nowrap transition-[background-color] duration-100 xl:px-5 ${
                      active ? "text-nav-actif-texte" : "text-nav-texte hover:bg-nav-survol active:bg-nav-survol"
                    }`}
                  >
                    {/* La capsule de la page courante glisse vers sa nouvelle position au changement de page. */}
                    {active && (
                      <ViewTransition name="nav-actif" share="nav-actif">
                        <span aria-hidden className="absolute inset-0 rounded-full bg-nav-actif" />
                      </ViewTransition>
                    )}
                    <span className="relative">
                      {item.label}
                      <Chargement />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} locales={locales} label={labels.languageSwitcher} />
          </div>
          <span aria-hidden className="hidden h-6 w-px bg-nav-capsule-bord sm:block" />
          <ThemeToggle labels={{ toLight: labels.themeToLight, toDark: labels.themeToDark }} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center rounded-full text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol lg:hidden"
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            <span className="sr-only">{menuOpen ? labels.menuClose : labels.menuOpen}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-mobile" className="animer-apparition border-t border-hairline bg-background lg:hidden">
          <nav aria-label={labels.navLabel} className="px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={estActif(pathname, item.href) ? "page" : undefined}
                    className="relative flex min-h-11 items-center rounded-full px-4 py-2 text-[1.0625rem] font-semibold text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol aria-[current=page]:bg-nav-actif aria-[current=page]:text-nav-actif-texte"
                  >
                    <span className="relative">
                      {item.label}
                      <Chargement />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-hairline px-4 py-4 sm:hidden">
            <LanguageList locale={locale} locales={locales} label={labels.languageSwitcher} />
          </div>
        </div>
      )}
    </header>
  );
}
