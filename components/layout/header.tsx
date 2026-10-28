import { getLocale, getTranslations } from "next-intl/server";
import { HeaderNav, type NavItem } from "@/components/layout/header-nav";
import { routing } from "@/i18n/routing";

// L'accueil n'a pas d'entrée : le logo y ramène. « À propos » mène à la section du même nom de l'accueil.
const PRIMARY_NAV = [
  { key: "about", href: "/#a-propos" },
  { key: "organisation", href: "/organisation" },
  { key: "teams", href: "/equipes" },
  { key: "problems", href: "/problemes" },
  { key: "results", href: "/resultats" },
] as const;

/**
 * En-tête : composant serveur. Les libellés sont traduits ici et passés à
 * l'îlot client (menu mobile, lien actif, filet au scroll), qui n'embarque
 * ainsi aucun moteur de traduction.
 */
export async function Header() {
  const t = await getTranslations("Nav");
  const tHeader = await getTranslations("Header");
  const locale = await getLocale();

  const items: NavItem[] = PRIMARY_NAV.map((item) => ({ href: item.href, label: t(item.key) }));

  return (
    <HeaderNav
      items={items}
      locale={locale}
      locales={[...routing.locales]}
      labels={{
        skipToContent: tHeader("skipToContent"),
        menuOpen: tHeader("menuOpen"),
        menuClose: tHeader("menuClose"),
        navLabel: tHeader("navLabel"),
        languageSwitcher: tHeader("languageSwitcherLabel"),
        themeToLight: tHeader("themeToLight"),
        themeToDark: tHeader("themeToDark"),
      }}
    />
  );
}
