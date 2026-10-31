"use client";

import { ViewTransition, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from "react";
import { useLinkStatus } from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageList, LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/brand/logo";

export interface NavLink {
  href: "/#a-propos" | "/historique" | "/organisation" | "/equipes" | "/problemes" | "/resultats";
  label: string;
}

/** Rubrique à sous-menu (« À propos ») : un bouton qui déplie ses liens. */
export interface NavGroup {
  label: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

const estGroupe = (item: NavItem): item is NavGroup => "children" in item;

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

/** Rubrique courante : la page elle-même ou l'une de ses sous-pages (fiche pays…). */
function estActif(pathname: string, href: NavLink["href"]): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Une rubrique à sous-menu est active dès que l'une de ses pages l'est. */
const groupeActif = (pathname: string, groupe: NavGroup) =>
  groupe.children.some((lien) => estActif(pathname, lien.href));

/**
 * Lien vers une ancre de la page courante (« À propos » depuis l'accueil) :
 * défilement natif, sans passer par le routeur, qui jouerait d'abord le fondu
 * de page. La fluidité et la marge sous l'en-tête viennent du CSS
 * (scroll-behavior, scroll-margin). Le défilement attend l'image suivante, une
 * fois le menu mobile refermé, pour viser la position définitive de la section.
 * Depuis une autre page, le lien navigue normalement vers l'accueil et son ancre.
 */
function defilerVersAncre(event: MouseEvent<HTMLAnchorElement>, pathname: string, href: NavLink["href"]) {
  const [chemin, ancre] = href.split("#");
  if (!ancre || chemin !== pathname) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const cible = document.getElementById(ancre);
  if (!cible) return;
  event.preventDefault();
  window.history.pushState(null, "", `#${ancre}`);
  requestAnimationFrame(() => cible.scrollIntoView());
}

/**
 * Sous-menu de la barre d'ordinateur, sur le modèle « disclosure » : le bouton
 * ouvre et ferme la liste (clic, Entrée, Espace) ; Flèche bas l'ouvre sur le
 * premier lien ; les flèches parcourent les liens ; Échap referme et rend le
 * focus au bouton. Il se referme aussi au clic ailleurs ou quand le focus sort.
 */
function MenuDeroulant({ groupe, pathname }: { groupe: NavGroup; pathname: string }) {
  const [ouvert, setOuvert] = useState(false);
  const racine = useRef<HTMLLIElement>(null);
  const id = useId();
  const actif = groupeActif(pathname, groupe);

  useEffect(() => {
    if (!ouvert) return;
    const auClic = (event: PointerEvent) => {
      if (!racine.current?.contains(event.target as Node)) setOuvert(false);
    };
    document.addEventListener("pointerdown", auClic);
    return () => document.removeEventListener("pointerdown", auClic);
  }, [ouvert]);

  const auClavier = (event: ReactKeyboardEvent<HTMLLIElement>) => {
    const bouton = event.currentTarget.querySelector<HTMLButtonElement>("button");
    if (event.key === "Escape" && ouvert) {
      event.stopPropagation();
      setOuvert(false);
      bouton?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const racineCourante = event.currentTarget;
    const liens = () => [...racineCourante.querySelectorAll<HTMLAnchorElement>("ul a")];
    const pas = event.key === "ArrowDown" ? 1 : -1;
    if (!ouvert) {
      setOuvert(true);
      // La liste n'existe qu'après le rendu : focus à l'image suivante.
      requestAnimationFrame(() => {
        const tous = liens();
        tous[pas === 1 ? 0 : tous.length - 1]?.focus();
      });
      return;
    }
    const tous = liens();
    const courant = tous.indexOf(document.activeElement as HTMLAnchorElement);
    tous[(courant + pas + tous.length) % tous.length]?.focus();
  };

  return (
    <li
      ref={racine}
      className="relative"
      onKeyDown={auClavier}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOuvert(false);
      }}
    >
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls={id}
        onClick={() => setOuvert((o) => !o)}
        className={`relative flex min-h-11 items-center gap-1 text-[0.9375rem] whitespace-nowrap text-nav-texte hover:underline hover:decoration-nav-filet hover:decoration-2 hover:underline-offset-8 xl:text-base ${actif ? "font-semibold" : "font-medium"}`}
      >
        {groupe.label}
        <ChevronDown
          aria-hidden
          className={`size-4 transition-transform duration-150 motion-reduce:transition-none ${ouvert ? "rotate-180" : ""}`}
        />
        {/* Même soulignement que les autres rubriques quand l'une de ses pages est ouverte. */}
        {actif && (
          <ViewTransition name="nav-actif" share="nav-actif">
            <span aria-hidden className="absolute inset-x-0 bottom-1.5 h-0.5 bg-accent" />
          </ViewTransition>
        )}
      </button>
      {ouvert && (
        <ul
          id={id}
          className="animer-apparition absolute top-full left-1/2 z-10 mt-1 flex min-w-48 -translate-x-1/2 flex-col gap-0.5 rounded-md border border-hairline bg-entete-fond p-1.5 shadow-soft"
        >
          {groupe.children.map((lien) => (
            <li key={lien.href}>
              <Link
                href={lien.href}
                onClick={(event) => {
                  setOuvert(false);
                  defilerVersAncre(event, pathname, lien.href);
                }}
                aria-current={estActif(pathname, lien.href) ? "page" : undefined}
                className="relative flex min-h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium whitespace-nowrap text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol aria-[current=page]:bg-nav-actif aria-[current=page]:font-semibold aria-[current=page]:text-nav-actif-texte"
              >
                <span className="relative">
                  {lien.label}
                  <Chargement />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** Lien du menu mobile. Fermeture explicite : un lien vers une ancre de la page courante ne change pas le chemin. */
function LienMobile({ lien, pathname, fermerMenu }: { lien: NavLink; pathname: string; fermerMenu: () => void }) {
  return (
    <Link
      href={lien.href}
      onClick={(event) => {
        fermerMenu();
        defilerVersAncre(event, pathname, lien.href);
      }}
      aria-current={estActif(pathname, lien.href) ? "page" : undefined}
      className="relative flex min-h-11 items-center rounded-full px-4 py-2 text-[1.0625rem] font-medium text-nav-texte aria-[current=page]:font-semibold transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol aria-[current=page]:bg-nav-actif aria-[current=page]:text-nav-actif-texte"
    >
      <span className="relative">
        {lien.label}
        <Chargement />
      </span>
    </Link>
  );
}

/** Rubrique à sous-menu du menu mobile : dépliée d'office si l'une de ses pages est ouverte. */
function GroupeMobile({ groupe, pathname, fermerMenu }: { groupe: NavGroup; pathname: string; fermerMenu: () => void }) {
  const actif = groupeActif(pathname, groupe);
  const [ouvert, setOuvert] = useState(actif);
  const id = useId();
  return (
    <li>
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls={id}
        onClick={() => setOuvert((o) => !o)}
        className={`flex min-h-11 w-full items-center justify-between rounded-full px-4 py-2 text-left text-[1.0625rem] text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol ${actif ? "font-semibold" : "font-medium"}`}
      >
        {groupe.label}
        <ChevronDown
          aria-hidden
          className={`size-5 transition-transform duration-150 motion-reduce:transition-none ${ouvert ? "rotate-180" : ""}`}
        />
      </button>
      {ouvert && (
        <ul id={id} className="mt-1 ml-4 flex flex-col gap-1 border-l border-hairline pl-3">
          {groupe.children.map((lien) => (
            <li key={lien.href}>
              <LienMobile lien={lien} pathname={pathname} fermerMenu={fermerMenu} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
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
              // Clé sur le chemin : le sous-menu se referme à chaque changement de page.
              if (estGroupe(item)) return <MenuDeroulant key={`${item.label}-${pathname}`} groupe={item} pathname={pathname} />;
              const active = estActif(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(event) => defilerVersAncre(event, pathname, item.href)}
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
              {items.map((item) =>
                estGroupe(item) ? (
                  <GroupeMobile key={item.label} groupe={item} pathname={pathname} fermerMenu={() => setMenuOpen(false)} />
                ) : (
                  <li key={item.href}>
                    <LienMobile lien={item} pathname={pathname} fermerMenu={() => setMenuOpen(false)} />
                  </li>
                ),
              )}
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
