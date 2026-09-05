"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const PRIMARY_NAV = [
  { key: "olympiad", href: "/olympiade" },
  { key: "teams", href: "/equipes" },
  { key: "programme", href: "/programme" },
  { key: "problems", href: "/problemes" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        scrolled ? "border-hairline" : "border-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        {tHeader("skipToContent")}
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="font-display text-2xl leading-none text-primary" aria-hidden>
            Σ
          </span>
          <span className="label text-foreground">OFM 2027</span>
        </Link>

        <nav aria-label={t("home")} className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="size-5" />
            ) : (
              <Menu aria-hidden className="size-5" />
            )}
            <span className="sr-only">
              {menuOpen ? tHeader("menuClose") : tHeader("menuOpen")}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="menu-mobile"
          className="animer-apparition border-t border-hairline bg-background md:hidden"
        >
          <nav className="flex flex-col gap-1 px-6 py-4" aria-label={t("home")}>
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="border-t border-hairline px-6 py-4 sm:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
