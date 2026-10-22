import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";

const LIEN = "inline-flex min-h-11 items-center text-sm text-foreground/80 hover:text-foreground";

/**
 * Pied de page resserré : identité, contact, liens institutionnels, mentions
 * légales. Pas de plan de site : les rubriques du menu principal n'y sont pas
 * répétées. Le nom de l'association mène à /organisation, qui n'a pas d'autre
 * entrée.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const locale = (await getLocale()) as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex min-h-11 items-center self-start">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("organizedBy")}{" "}
              <Link href="/organisation" className="link-text font-medium text-foreground">
                {eventInfo.organizer}
              </Link>
              {" — "}
              {t("committee", { city: eventInfo.city[locale], country: eventInfo.country[locale] })}
            </p>
          </div>

          <nav aria-label={t("navLabel")}>
            <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li>
                <Link href="/contact" className={LIEN}>
                  {tNav("contact")}
                </Link>
              </li>
              <li>
                <Link href="/historique" className={LIEN}>
                  {t("history")}
                </Link>
              </li>
              <li>
                <a href="https://ofm-officiel.org/" target="_blank" rel="noopener noreferrer" className={LIEN}>
                  {t("officialSite")}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-hairline pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">{t("rights", { year })}</p>
          <Link href="/mentions-legales" className={LIEN}>
            {t("legalMentions")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
