import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { composerMessages } from "@/lib/typographie";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    // Microtypographie française appliquée au chargement : les fichiers de
    // messages restent en saisie brute, l'anglais n'est pas touché.
    messages: locale === "fr" ? composerMessages(messages) : messages,
  };
});
