"use client";

import { ViewTransition, useEffect, useState } from "react";
import { useLinkStatus } from "next/link";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
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
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur transition-colors duration-150 ${
        scrolled ? "border-hairline" : "border-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        {labels.skipToContent}
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
        <Link href="/" className="rounded-sm active:opacity-70">
          <Logo />
        </Link>

        <nav aria-label={labels.navLabel} className="hidden items-center gap-8 md:flex">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm font-medium active:text-primary ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
                <Chargement />
                {/* L'indicateur de page courante glisse vers sa nouvelle position au changement de page. */}
                {active && (
                  <ViewTransition name="nav-actif" share="nav-actif">
                    <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent" />
                  </ViewTransition>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} locales={locales} label={labels.languageSwitcher} />
          </div>
          <ThemeToggle labels={{ toLight: labels.themeToLight, toDark: labels.themeToDark }} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center rounded-md text-foreground hover:bg-muted active:bg-muted md:hidden"
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            <span className="sr-only">{menuOpen ? labels.menuClose : labels.menuOpen}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-mobile" className="animer-apparition border-t border-hairline bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4" aria-label={labels.navLabel}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="relative rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted active:bg-muted aria-[current=page]:text-primary"
              >
                {item.label}
                <Chargement />
              </Link>
            ))}
          </nav>
          <div className="border-t border-hairline px-6 py-4 sm:hidden">
            <LanguageSwitcher locale={locale} locales={locales} label={labels.languageSwitcher} />
          </div>
        </div>
      )}
    </header>
  );
}
