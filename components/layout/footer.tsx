import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";
import logoBlanc from "@/public/icons/logoblanc.png";

const LIEN =
  "inline-flex min-h-11 items-center gap-1.5 text-ivoire/80 decoration-or underline-offset-4 hover:text-ivoire hover:underline focus-visible:outline-or-clair";

/**
 * Pied de page, vert profond dans les deux thèmes : identité, liens utiles,
 * contact, puis une ligne de mentions. Le symbole blanc (public/icons/logoblanc.png)
 * est affiché tel quel ; il porte son propre fond vert, d'où ses coins arrondis.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const locale = (await getLocale()) as Locale;
  const year = new Date().getFullYear();

  const externe = (href: string, libelle: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LIEN}>
      {libelle}
      <ArrowUpRight aria-hidden className="size-4 shrink-0" />
      <span className="sr-only"> {t("newTab")}</span>
    </a>
  );

  return (
    <footer className="bg-vert-pied text-ivoire">
      <div className="mx-auto max-w-[75rem] px-4 pt-12 pb-6 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 self-start rounded-sm focus-visible:outline-or-clair">
              <Image src={logoBlanc} alt={t("logoAlt")} sizes="48px" className="size-12 rounded-md object-contain" />
              <span className="text-[1.375rem] leading-none font-bold tracking-[-0.02em] text-ivoire">OFM 2027</span>
            </Link>
            <p className="flex flex-col text-small text-ivoire/80">
              <span>{t("organizedBy", { organizer: eventInfo.organizer })}</span>
              <span>{t("location", { city: eventInfo.city[locale], country: eventInfo.country[locale] })}</span>
            </p>
          </div>

          <nav aria-labelledby="pied-liens" className="flex flex-col gap-3">
            <h2 id="pied-liens" className="flex flex-col gap-2 text-base font-semibold text-ivoire">
              {t("usefulLinks")}
              <span aria-hidden className="h-0.5 w-8 bg-or" />
            </h2>
            <ul className="flex flex-col">
              <li>{externe("https://ofm-officiel.org/", t("officialSite"))}</li>
              <li>{externe("https://ofm-officiel.org/reglement/", t("rules"))}</li>
              <li>
                <Link href="/historique" className={LIEN}>
                  {t("history")}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="pied-contact" className="flex flex-col gap-3">
            <h2 id="pied-contact" className="flex flex-col gap-2 text-base font-semibold text-ivoire">
              {t("contact")}
              <span aria-hidden className="h-0.5 w-8 bg-or" />
            </h2>
            <ul className="flex flex-col">
              <li>
                <Link href="/contact" className={LIEN}>
                  {t("contactOrganisation")}
                  <ArrowRight aria-hidden className="size-4 shrink-0" />
                </Link>
              </li>
              <li>{externe("https://www.terangamath.org/", t("terangamath"))}</li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 border-t border-ivoire/15 pt-4 text-small">
          <p className="text-ivoire/80 tabular-nums">{t("rights", { year })}</p>
          <Link href="/mentions-legales" className={LIEN}>
            {t("legalMentions")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
