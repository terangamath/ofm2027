"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

// Noms des langues dans leur propre langue : identiques quelle que soit la locale affichée.
const LOCALE_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
};

interface LanguageSwitcherProps {
  locale: string;
  locales: string[];
  label: string;
}

/**
 * Sélecteur compact de l'en-tête : la langue courante et un chevron ouvrent la
 * liste des langues. Se ferme sur Échap (le focus revient au bouton), au clic
 * extérieur ou quand le focus quitte le sélecteur.
 */
export function LanguageSwitcher({ locale, locales, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        className="flex h-11 items-center gap-1 rounded-full px-3 text-[1.0625rem] font-semibold text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol"
      >
        <span className="sr-only">{label}, </span>
        {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
        <ChevronDown aria-hidden className={`size-4 ${open ? "rotate-180" : ""}`} />
      </button>

      <ul
        id={listId}
        hidden={!open}
        className="animer-apparition absolute right-0 top-full z-10 mt-2 min-w-36 rounded-md border border-nav-filet bg-popover p-1 shadow-soft"
      >
        {locales.map((loc) => (
          <li key={loc}>
            <LocaleLink loc={loc} active={loc === locale} pathname={pathname} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Variante en ligne, pour le menu mobile : chaque langue est un lien direct. */
export function LanguageList({ locale, locales, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex gap-2">
        {locales.map((loc) => (
          <li key={loc}>
            <LocaleLink loc={loc} active={loc === locale} pathname={pathname} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LocaleLink({ loc, active, pathname }: { loc: string; active: boolean; pathname: string }) {
  return (
    <Link
      href={pathname}
      locale={loc}
      lang={loc}
      hrefLang={loc}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-11 items-center rounded-full px-4 text-base font-semibold transition-[background-color] duration-100 ${
        active ? "bg-nav-actif text-nav-actif-texte" : "text-nav-texte hover:bg-nav-survol"
      }`}
    >
      {LOCALE_NAMES[loc] ?? loc.toUpperCase()}
    </Link>
  );
}
