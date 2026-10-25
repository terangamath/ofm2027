import type { Metadata } from "next";
import Image from "next/image";
import { metadonneesPage } from "@/lib/seo";
import { ViewTransition } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDelegations } from "@/lib/content";
import { calageDrapeau, srcDrapeau } from "@/lib/drapeaux";
import type { Locale } from "@/content/types";

/** Carte de déplacement de l'ondulation : une période de sinusoïde sur 60 % de la largeur. */
const CARTE_ONDULATION =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27300%27%20height%3D%27200%27%20preserveAspectRatio%3D%27none%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27o%27%20x2%3D%270.6%27%20spreadMethod%3D%27repeat%27%3E%3Cstop%20offset%3D%270.000%27%20stop-color%3D%27rgb%28128%2C128%2C128%29%27/%3E%3Cstop%20offset%3D%270.125%27%20stop-color%3D%27rgb%28128%2C192%2C128%29%27/%3E%3Cstop%20offset%3D%270.250%27%20stop-color%3D%27rgb%28128%2C218%2C128%29%27/%3E%3Cstop%20offset%3D%270.375%27%20stop-color%3D%27rgb%28128%2C192%2C128%29%27/%3E%3Cstop%20offset%3D%270.500%27%20stop-color%3D%27rgb%28128%2C128%2C128%29%27/%3E%3Cstop%20offset%3D%270.625%27%20stop-color%3D%27rgb%28128%2C64%2C128%29%27/%3E%3Cstop%20offset%3D%270.750%27%20stop-color%3D%27rgb%28128%2C38%2C128%29%27/%3E%3Cstop%20offset%3D%270.875%27%20stop-color%3D%27rgb%28128%2C64%2C128%29%27/%3E%3Cstop%20offset%3D%271.000%27%20stop-color%3D%27rgb%28128%2C128%2C128%29%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27300%27%20height%3D%27200%27%20fill%3D%27url%28%23o%29%27/%3E%3C/svg%3E";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  return metadonneesPage({ locale, chemin: "/equipes", titre: t("title"), description: t("lead") });
}

/**
 * Les délégations : une galerie de drapeaux sur fond blanc. Pays hôte en
 * premier, puis ordre alphabétique (getDelegations). Chaque élément est un
 * seul lien vers la fiche du pays. Tous les drapeaux occupent le même
 * rectangle 3:2 (remplissage centré) et ondulent comme un tissu, de façon fixe
 * (filtre SVG, sans animation) ; ils montent au survol et au focus (voir
 * .drapeau dans globals.css).
 */
export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  const delegations = getDelegations();

  return (
    <section className="flex-grow bg-entete-fond pb-16 text-vert-profond lg:pb-24 dark:text-foreground">
      <div className="relative mx-auto max-w-[75rem] overflow-hidden px-4 pt-10 pb-10 sm:px-6 lg:pt-14 lg:pb-14">
        <span
          aria-hidden
          className="annee-contour pointer-events-none absolute -top-2 right-2 text-[clamp(5rem,16vw,12rem)] leading-none font-bold select-none sm:right-6"
        >
          2027
        </span>
        <div className="relative flex flex-col gap-3">
          <span aria-hidden className="flex h-1.5 w-[4.5rem] overflow-hidden rounded-full">
            <span className="flex-1 bg-pastille-vert" />
            <span className="flex-1 bg-soleil" />
            <span className="flex-1 bg-rouge" />
          </span>
          <p className="text-xl font-bold text-or-trait dark:text-or-clair">{t("kicker")}</p>
          <h1 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-bold text-vert-profond dark:text-foreground">
            {t("heading")}
          </h1>
          <span aria-hidden className="h-0.5 w-16 bg-accent" />
        </div>
      </div>

      {/* Ondulation fixe des drapeaux : une sinusoïde (canal vert) déplace verticalement
          chaque drapeau, bords compris, comme un tissu qui flotte. Rendu une fois, sans animation. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="ondulation-drapeau" x="-0.1" y="-0.2" width="1.2" height="1.5" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
          <feImage href={CARTE_ONDULATION} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="carte" />
          <feDisplacementMap in="SourceGraphic" in2="carte" scale="0.07" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <ul className="mx-auto grid max-w-[75rem] grid-cols-1 gap-x-4 gap-y-6 px-4 min-[22rem]:grid-cols-2 sm:px-6 md:grid-cols-3 md:gap-x-8 md:gap-y-8 lg:grid-cols-4 lg:gap-x-10">
        {delegations.map((delegation) => {
          const nom = delegation.name[typedLocale];
          return (
            <li key={delegation.slug}>
              <Link
                href={`/equipes/${delegation.slug}`}
                className="lien-drapeau group flex flex-col items-center gap-3 rounded-lg p-2 focus-visible:outline-or-trait dark:focus-visible:outline-or-clair"
              >
                <span className="drapeau-tissu block w-full">
                  <span className={`drapeau ${delegation.isHost ? "drapeau-hote" : ""}`}>
                    <Image
                      src={srcDrapeau(delegation.countryCode)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 270px, 45vw"
                      className={`object-cover ${calageDrapeau(delegation.countryCode)}`}
                    />
                  </span>
                </span>
                <span className="flex flex-col items-center gap-0.5 text-center">
                  {/* La flèche suit le dernier mot, même quand le nom passe sur deux lignes. */}
                  <span className="text-base font-bold sm:text-lg">
                    <ViewTransition name={`delegation-${delegation.slug}`} share="partage">
                      <span className="decoration-or decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
                        {nom}
                      </span>
                    </ViewTransition>
                    <ArrowRight aria-hidden className="fleche-drapeau ml-1.5 inline-block size-5 align-[-0.2em] text-or" />
                  </span>
                  {delegation.isHost && (
                    <span className="text-small font-semibold text-or-profond dark:text-or-clair">{t("hostLabel")}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
