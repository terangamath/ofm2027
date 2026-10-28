import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CarteMembre } from "@/components/delegation/equipe";
import { IntroCompacte } from "@/components/layout/intro-compacte";
import { MotifAngle, MotifIntroduction, type FigureAngle } from "@/components/organisation/motifs";
import { comites as committees } from "@/lib/contenu";
import type { Committee, Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Organisation" });
  return metadonneesPage({ locale, chemin: "/organisation", titre: t("title"), description: t("lead") });
}

/**
 * Une figure par section, dans un angle qui alterne : la page garde son rythme
 * sans répéter le même dessin.
 */
const ANGLES: { figure: FigureAngle; position: string }[] = [
  { figure: "cercle", position: "-top-10 -right-10 lg:top-6 lg:right-6" },
  { figure: "angle", position: "-bottom-8 -left-8 lg:bottom-6 lg:left-6" },
  { figure: "courbe", position: "-top-10 -left-10 lg:top-6 lg:left-6" },
  { figure: "polygone", position: "-right-10 -bottom-10 lg:right-6 lg:bottom-6" },
];

/** Rangs (ordre de content/organisation.json) des comités sur fond vert. */
const FONDS_VERTS = new Set([1, 2]);

/** Petit accent or sous un titre : un filet entre deux losanges. */
function Accent() {
  return (
    <span aria-hidden className="flex items-center gap-2">
      <span className="size-1.5 rotate-45 bg-or" />
      <span className="h-0.5 w-12 bg-or" />
      <span className="size-1.5 rotate-45 bg-or" />
    </span>
  );
}

function SectionComite({
  committee,
  rang,
  locale,
  libelles,
}: {
  committee: Committee;
  rang: number;
  locale: Locale;
  libelles: { compositionPending: string; memberToConfirm: string; coordinatorToConfirm: string };
}) {
  // Fonds : clair, vert, vert, clair. Deux bandes vertes qui se suivent sont
  // séparées par un filet or.
  const vert = FONDS_VERTS.has(rang);
  const suitUnVert = vert && FONDS_VERTS.has(rang - 1);
  const angle = ANGLES[rang % ANGLES.length];
  const titreId = `comite-${committee.id}`;
  const aConfirmer = committee.kind === "coordinators" ? libelles.coordinatorToConfirm : libelles.memberToConfirm;

  return (
    <section
      aria-labelledby={titreId}
      className={`relative isolate overflow-hidden py-12 lg:py-16 ${
        vert ? "bg-vert-profond text-blanc" : "bg-entete-fond text-foreground"
      } ${suitUnVert ? "border-t border-or/40" : ""}`}
    >
      <MotifAngle
        figure={angle.figure}
        className={`size-28 sm:size-36 lg:size-44 ${angle.position} ${
          vert ? "text-or opacity-35" : "text-or-trait opacity-40 dark:text-or dark:opacity-30"
        }`}
      />

      <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-8 px-4 sm:px-6">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2
            id={titreId}
            className={`text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] font-bold text-balance ${
              vert ? "text-blanc" : "text-vert-profond dark:text-primary"
            }`}
          >
            {committee.name[locale]}
          </h2>
          <Accent />
          {committee.description && (
            <p className={`text-body-l ${vert ? "text-blanc" : "text-muted-foreground"}`}>
              {committee.description[locale]}
            </p>
          )}
        </div>

        {committee.members.length > 0 ? (
          // Nombre de membres libre : les cartes se centrent, trois par ligne au plus.
          <ul className="flex w-full max-w-5xl flex-wrap justify-center gap-4 lg:gap-6">
            {committee.members.map((member, index) => (
              <CarteMembre
                key={`${committee.id}-${index}`}
                nom={member.name}
                photo={member.photo}
                detail={[member.role?.[locale], member.org].filter(Boolean).join(" — ") || null}
                aConfirmer={aConfirmer}
                className="w-full md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              />
            ))}
          </ul>
        ) : (
          <p
            className={`rounded-lg border px-6 py-4 text-center text-body font-medium ${
              vert ? "border-or/50 text-blanc" : "border-hairline bg-card text-muted-foreground"
            }`}
          >
            {libelles.compositionPending}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Organisation : une introduction resserrée (le premier comité apparaît vite),
 * puis les comités dans l'ordre de content/organisation.json, en bandes
 * pleine largeur claires et vertes (FONDS_VERTS), puis le pied de page vert
 */
export default async function OrganisationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Organisation" });
  const libelles = {
    compositionPending: t("compositionPending"),
    memberToConfirm: t("memberToConfirm"),
    coordinatorToConfirm: t("coordinatorToConfirm"),
  };

  return (
    <>
      <IntroCompacte
        title={t("title")}
        lead={t("lead")}
        decor={
          <MotifIntroduction className="pointer-events-none absolute top-1/2 right-2 -z-10 h-[130%] -translate-y-1/2 text-or-trait opacity-25 max-sm:-right-36 sm:right-8 sm:opacity-45 lg:right-[max(2rem,calc((100vw-75rem)/2+2rem))] dark:text-or dark:opacity-35" />
        }
      />

      {committees.map((committee, rang) => (
        <SectionComite key={committee.id} committee={committee} rang={rang} locale={typedLocale} libelles={libelles} />
      ))}
    </>
  );
}
