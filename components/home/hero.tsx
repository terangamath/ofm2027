import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroCompte } from "@/components/home/hero-compte";
import { FigureConstruction } from "@/components/motifs/figure-construction";
import { BandeauCouche, BandeauVertical } from "@/components/motifs/bandeau-tisse";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";
import { heureLocale } from "@/lib/fuseaux";
import { sansVeuve } from "@/lib/typographie";

const FIGURE_SOURCE = "/archives/2024/ofm-2024-senior-sujet.pdf";

/**
 * Hero de la variante D (maquette 5254) : titre, texte, bouton et rangée
 * d'informations tiennent sur un écran ; la figure sur son disque soleil à
 * droite ; le bandeau tissé sur le bord droit (couché sous le hero sur
 * téléphone). Sous le texte, les dates en grand et le compte à rebours ; sur
 * téléphone, ils passent avant la figure pour rester visibles sans défiler.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Hero" });
  const exam = eventInfo.exam;
  const debut = exam ? new Date(exam.startInstant) : null;
  const jourEpreuve =
    exam && debut
      ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: exam.referenceZone }).format(debut)
      : null;

  return (
    <section className="avec-bandeau relative isolate overflow-hidden bg-surface text-foreground">
      <BandeauVertical className="absolute inset-y-0 right-0 hidden w-(--bandeau) md:block" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-8 marge-bandeau pt-8 pb-10 pl-6 md:pt-12 lg:grid-cols-[minmax(0,13fr)_minmax(0,10fr)] lg:gap-y-10 lg:pt-14 lg:pb-12">
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-t border-border pt-6 lg:col-span-2 lg:row-start-2 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:pt-8">
          {eventInfo.dates && (
            <div className="flex flex-col gap-2">
              <p className="font-display text-h2 font-semibold tracking-[-0.02em] text-primary tabular-nums">
                <time dateTime={`${eventInfo.startDate}/${eventInfo.endDate}`}>{eventInfo.dates[locale]}</time>
              </p>
              {exam && debut && jourEpreuve && (
                <p className="text-small text-muted-foreground">
                  {t("examLine", { day: jourEpreuve, time: heureLocale(exam.referenceZone, debut) })}
                  {exam.provisional && <> · {t("provisional")}</>}
                </p>
              )}
            </div>
          )}

          {exam && debut && (
            <HeroCompte
              debutIso={exam.startInstant}
              finIso={new Date(debut.getTime() + exam.durationMinutes * 60_000).toISOString()}
              libelles={{
                label: t("countdownLabel"),
                before: t("countdownBefore"),
                during: t("countdownDuring"),
                after: t("countdownAfter"),
                days: t("days"),
                hours: t("hours"),
                minutes: t("minutes"),
                seconds: t("seconds"),
              }}
            />
          )}
        </div>

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
