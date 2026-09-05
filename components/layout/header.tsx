import { getLocale, getTranslations } from "next-intl/server";
import { HeaderNav, type NavItem } from "@/components/layout/header-nav";
import { routing } from "@/i18n/routing";

const PRIMARY_NAV = [
  { key: "olympiad", href: "/olympiade" },
  { key: "teams", href: "/equipes" },
  { key: "programme", href: "/programme" },
  { key: "problems", href: "/problemes" },
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
        navLabel: t("home"),
        languageSwitcher: tHeader("languageSwitcherLabel"),
      }}
    />
  );
}
