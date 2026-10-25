"use client";

import { ViewTransition, useEffect, useState } from "react";
import { useLinkStatus } from "next/link";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageList, LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/brand/logo";

export interface NavItem {
  href: "/" | "/olympiade" | "/equipes" | "/programme" | "/problemes";
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

/** Rubrique courante : la page elle-même ou l'une de ses sous-pages (fiche pays…). L'accueil ne s'active que sur lui-même. */
function estActif(pathname: string, href: NavItem["href"]): boolean {
  if (href === "/") return pathname === "/";
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
      className={`sticky top-0 z-50 border-b bg-entete-fond transition-[border-color] duration-150 ${
        scrolled ? "border-hairline" : "border-nav-filet"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        {labels.skipToContent}
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20">
        <Link href="/" className="shrink-0 rounded-sm active:opacity-70">
          <Logo embleme="pi" />
        </Link>

        <nav aria-label={labels.navLabel} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {items.map((item) => {
              const active = estActif(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="relative flex min-h-11 items-center text-[0.9375rem] font-medium whitespace-nowrap text-nav-texte aria-[current=page]:font-semibold hover:underline hover:decoration-nav-filet hover:decoration-2 hover:underline-offset-8 xl:text-base"
                  >
                    {item.label}
                    <Chargement />
                    {/* Le soulignement de la page courante glisse vers sa nouvelle position au changement de page. */}
                    {active && (
                      <ViewTransition name="nav-actif" share="nav-actif">
                        <span aria-hidden className="absolute inset-x-0 bottom-1.5 h-0.5 bg-accent" />
                      </ViewTransition>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} locales={locales} label={labels.languageSwitcher} />
          </div>
          <span aria-hidden className="hidden h-6 w-px bg-nav-filet sm:block" />
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
                    className="relative flex min-h-11 items-center rounded-full px-4 py-2 text-[1.0625rem] font-medium text-nav-texte aria-[current=page]:font-semibold transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol aria-[current=page]:bg-nav-actif aria-[current=page]:text-nav-actif-texte"
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
