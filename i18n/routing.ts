import { defineRouting } from "next-intl/routing";

// Les locales gérées correspondent à `Locale` dans content/types.ts.
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Le français reste le défaut quel que soit l'Accept-Language du navigateur ;
  // l'anglais n'est servi que via /en ou le sélecteur de langue.
  localeDetection: false,
});
