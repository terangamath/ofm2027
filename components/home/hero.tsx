import { getTranslations } from "next-intl/server";
import { CalendarDays, Laptop, Sigma, Users, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FigureConstruction } from "@/components/motifs/figure-construction";
import { BandeauCouche, BandeauVertical } from "@/components/motifs/bandeau-tisse";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";
import { sansVeuve } from "@/lib/typographie";

const FIGURE_SOURCE = "/archives/2024/ofm-2024-senior-sujet.pdf";

type Pastille = "pastille-vert" | "pastille-jaune" | "pastille-rouge";

/**
 * Hero de la variante D (maquette 5254) : titre, texte, bouton et rangée
 * d'informations tiennent sur un écran ; la figure sur son disque soleil à
 * droite ; le bandeau tissé sur le bord droit (couché sous le hero sur
 * téléphone). Sur téléphone, la rangée d'informations passe avant la figure
 * pour rester visible sans défiler.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Hero" });
  const categories = eventInfo.categories.map((category) => category.name[locale]).join(" · ");

  const infos: { label: string; value: string; icone: LucideIcon; pastille: Pastille; data?: boolean }[] = [
    ...(eventInfo.dates
      ? [{ label: t("metaDates"), value: eventInfo.dates[locale], icone: CalendarDays, pastille: "pastille-vert" as const, data: true }]
      : []),
    { label: t("metaMode"), value: t("metaModeValue"), icone: Laptop, pastille: "pastille-jaune" },
    { label: t("metaCategories"), value: categories, icone: Users, pastille: "pastille-rouge" },
    { label: t("metaOrganizer"), value: eventInfo.organizer, icone: Sigma, pastille: "pastille-vert" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-surface text-foreground [--bandeau:0px] md:[--bandeau:1.75rem] lg:[--bandeau:3.25rem]">
      <BandeauVertical className="absolute inset-y-0 right-0 hidden w-(--bandeau) md:block" />

      {/* À droite, la marge s'élargit juste assez pour que le contenu ne passe jamais sous le bandeau. */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-8 pt-8 pb-10 pl-6 pr-[max(1.5rem,calc(var(--bandeau)_+_1.5rem_-_max(0px,(100vw_-_80rem)_/_2)))] md:pt-12 lg:grid-cols-[minmax(0,13fr)_minmax(0,10fr)] lg:gap-y-10 lg:pt-14 lg:pb-12">
        <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:justify-center lg:gap-7">
          <h1 className="titre-hero font-display text-primary">{sansVeuve(t("title"))}</h1>

          <p className="max-w-xl text-body-l text-muted-foreground">{t("lead")}</p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-1">
            <Link
              href="/olympiade"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:translate-y-px"
            >
              {t("ctaPrimary")}
            </Link>
            <Link href="/equipes" className="link-text inline-flex min-h-11 items-center text-base font-medium text-foreground">
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-border pt-5 sm:grid-cols-2 sm:gap-y-5 sm:pt-6 lg:col-span-2 lg:row-start-2 lg:grid-cols-4 lg:gap-0 lg:pt-7">
          {infos.map(({ label, value, icone: Icone, pastille, data }, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 lg:gap-4 lg:px-6 ${i === 0 ? "lg:pl-0" : "lg:border-l lg:border-border"}`}
            >
              {/* La pastille porte l'intitulé, lu par les lecteurs d'écran seulement. */}
              <dt className={`pastille ${pastille}`}>
                <Icone aria-hidden className="size-5" strokeWidth={1.75} />
                <span className="sr-only">{label}</span>
              </dt>
              <dd className={`min-w-0 text-body leading-snug font-medium ${data ? "font-mono tabular-nums" : ""}`}>{value}</dd>
            </div>
          ))}
        </dl>

        {/* La figure se construit à côté du texte, sans jamais le bloquer. */}
        <figure className="mx-auto flex w-full max-w-sm flex-col gap-2 sm:max-w-md lg:col-start-2 lg:row-start-1 lg:max-w-none">
          <FigureConstruction className="h-auto w-full" />
          <figcaption className="text-small text-muted-foreground lg:text-center">
            <a href={FIGURE_SOURCE} target="_blank" rel="noopener noreferrer" className="link-text">
              {t("figureCaption")}
            </a>
          </figcaption>
        </figure>
      </div>

      <BandeauCouche className="h-5 md:hidden" />
    </section>
  );
}
