import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroCompte } from "@/components/home/hero-compte";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";
import { heureLocale } from "@/lib/fuseaux";
import photo from "@/public/icons/senegal.png";

/** « 27-28 mars 2027 » → « 27–28 mars 2027 » : une plage de jours prend le tiret demi-cadratin. */
function plage(dates: string): string {
  return dates.replace(/(\d)[-‑](\d)/, "$1–$2");
}

/** « 08:00 » → « 08 h » en français, inchangé en anglais. */
function heureAffichee(heure: string, locale: Locale): string {
  if (locale !== "fr") return heure;
  const [h, m] = heure.split(":");
  return m === "00" ? `${h} h` : `${h} h ${m}`;
}

/**
 * Premier écran de l'accueil : la photographie des pirogues occupe tout
 * l'espace sous l'en-tête. Le texte se place en haut à gauche, dans le ciel ;
 * le bandeau des dates et du compte à rebours se pose sur le bas de la photo
 * à partir de 1280 px, et la suit en dessous, pour laisser l'inscription
 * « OFM 2027 Sénégal » visible.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Hero" });
  const exam = eventInfo.exam;
  const debut = exam ? new Date(exam.startInstant) : null;
  const dates = eventInfo.dates ? plage(eventInfo.dates[locale]) : null;
  const meta = [eventInfo.country[locale], dates, t("remote")].filter(Boolean).join(" · ");

  return (
    <section className="grid min-h-[calc(100svh-4rem-1px)] grid-rows-[minmax(28rem,1fr)_auto] lg:min-h-[calc(100svh-5rem-1px)] xl:grid-rows-[1fr_auto]">
      <div className="relative col-start-1 row-start-1 overflow-hidden xl:row-[1/3]">
        <Image
          src={photo}
          alt={t("photoAlt")}
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[46%_50%] xl:object-bottom"
        />
        <div aria-hidden className="hero-voile absolute inset-0" />
      </div>

      <div className="relative col-start-1 row-start-1 mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 pt-10 pb-8 sm:px-6 lg:gap-5 lg:pt-14">
        <h1 className="hero-texte max-w-[22ch] font-sans text-[clamp(1.75rem,1.1rem+2.2vw,3rem)] leading-[1.1] font-semibold tracking-[-0.015em] text-balance text-blanc">
          {t("title")}
        </h1>
        <p className="hero-texte text-body-l font-medium text-blanc">{meta}</p>
        <Link
          href="/olympiade"
          className="hero-bouton mt-2 inline-flex min-h-12 items-center rounded-full border-2 border-blanc px-6 text-base font-semibold text-blanc transition-[background-color,color] duration-100 hover:bg-blanc hover:text-vert-profond focus-visible:outline-blanc active:bg-blanc active:text-vert-profond"
        >
          {t("ctaPrimary")}
        </Link>
      </div>

      <div className="relative col-start-1 row-start-2 bg-compte-fond text-compte-texte xl:mx-auto xl:mb-4 xl:w-4/5 xl:max-w-6xl xl:rounded-lg xl:bg-bande-fond xl:backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:px-8 xl:py-3">
          {dates && (
            <div className="flex flex-col gap-1">
              <p className="text-h4 font-semibold">
                <time dateTime={`${eventInfo.startDate}/${eventInfo.endDate}`}>{dates}</time>
              </p>
              {exam && debut && (
                <p className="text-small text-compte-libelle">
                  {t("examTime", { time: heureAffichee(heureLocale(exam.referenceZone, debut), locale) })}
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
      </div>
    </section>
  );
}
