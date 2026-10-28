import { getLocale, getTranslations } from "next-intl/server";
import { HeaderNav, type NavItem } from "@/components/layout/header-nav";
import { routing } from "@/i18n/routing";
import { evenement } from "@/lib/contenu";

// L'accueil n'a pas d'entrée : le logo y ramène. « À propos » est un sous-menu :
// l'édition en cours (section du même nom de l'accueil) et l'historique.
const PRIMARY_NAV = [
  {
    key: "about",
    children: [
      { key: "edition", href: "/#a-propos" },
      { key: "history", href: "/historique" },
    ],
  },
  { key: "organisation", href: "/organisation" },
  { key: "teams", href: "/equipes" },
  { key: "problems", href: "/problemes" },
  { key: "results", href: "/resultats" },
] as const;

/**
 * En-tête : composant serveur. Les libellés sont traduits ici et passés à
 * l'îlot client (menu mobile, sous-menu, lien actif, filet au scroll), qui
 * n'embarque ainsi aucun moteur de traduction.
 */
export async function Header() {
  const t = await getTranslations("Nav");
  const tHeader = await getTranslations("Header");
  const locale = await getLocale();

  const items: NavItem[] = PRIMARY_NAV.map((item) =>
    "children" in item
      ? {
          label: t(item.key),
          children: item.children.map((lien) => ({
            href: lien.href,
            label: lien.key === "edition" ? t("edition", { year: evenement.edition }) : t(lien.key),
          })),
        }
      : { href: item.href, label: t(item.key) },
  );

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
