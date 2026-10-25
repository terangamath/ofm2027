import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/content/types";
import logo from "@/public/icons/logo1.png";

const LIENS = [
  { key: "rules", href: "https://ofm-officiel.org/reglement/" },
  { key: "terangamath", href: "https://www.terangamath.org/" },
] as const;

/**
 * « À propos de l'OFM », sous le premier écran : le logo complet à gauche
 * (40 %), la présentation à droite (60 %) ; sur téléphone, le logo réduit
 * passe au-dessus du texte. Le logo reste entier (object-contain) ; en thème
 * sombre, un fond sable garde lisibles ses lettres brunes.
 */
export async function AboutSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.About" });

  return (
    <section aria-labelledby="a-propos" className="bg-background py-14 text-foreground lg:py-20">
      <div className="mx-auto grid max-w-[75rem] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <Image
          src={logo}
          alt={t("logoAlt")}
          sizes="(min-width: 1024px) 400px, 224px"
          className="mx-auto h-auto w-48 object-contain sm:w-56 lg:w-full lg:max-w-[25rem] dark:rounded-lg dark:bg-sable"
        />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 id="a-propos" className="text-[clamp(1.625rem,1.3rem+1vw,2rem)] font-bold text-vert-profond dark:text-primary">
              {t("title")}
            </h2>
            <span aria-hidden className="h-0.5 w-12 bg-accent" />
          </div>

          <div className="flex flex-col gap-4 text-body leading-[1.65]">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>
              {t.rich("p3", {
                sup: (chunks) => <sup>{chunks}</sup>,
                b: (chunks) => <strong className="font-semibold whitespace-nowrap">{chunks}</strong>,
              })}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {LIENS.map((lien) => (
              <li key={lien.key}>
                <a
                  href={lien.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium text-vert-profond underline decoration-1 underline-offset-4 hover:decoration-2 dark:text-primary"
                >
                  {t(lien.key)}
                  <ExternalLink aria-hidden className="size-4 shrink-0" />
                  <span className="sr-only"> {t("newTab")}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
