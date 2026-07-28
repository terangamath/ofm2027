import { defineRouting } from "next-intl/routing";

// Les locales gérées correspondent à `Locale` dans content/types.ts.
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});
