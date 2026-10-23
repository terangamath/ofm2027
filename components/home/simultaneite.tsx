import { getTranslations } from "next-intl/server";
import { Partition, type LignePays } from "@/components/home/simultaneite-partition";
import { decalageMinutes, heureLocale } from "@/lib/fuseaux";
import { evenement } from "@/lib/contenu";
import { getDelegations } from "@/lib/content";
import type { Locale } from "@/content/types";

/**
 * Geste signature : la partition de la simultanéité.
 * Le serveur calcule, pour l'instant de l'épreuve, le décalage et l'heure
 * locale de chaque délégation (base IANA) ; le client anime le trait
 * « maintenant », le compte à rebours et la ligne du visiteur.
 */
export async function SimultaneiteSection({ locale }: { locale: Locale }) {
  const exam = evenement.exam;
  if (!exam) return null;

  const t = await getTranslations({ locale, namespace: "Home.Simultaneite" });
  const debut = new Date(exam.startInstant);
  const fin = new Date(debut.getTime() + exam.durationMinutes * 60_000);

  const lignes: LignePays[] = getDelegations().map((delegation) => ({
    slug: delegation.slug,
    countryCode: delegation.countryCode,
    name: delegation.name[locale],
    zone: delegation.timeZone,
    decalage: decalageMinutes(delegation.timeZone, debut),
    heure: heureLocale(delegation.timeZone, debut),
    isHost: delegation.isHost,
  }));

  const libelles = {
    listLabel: t("listLabel"),
    localTime: t("localTime"),
    exam: t("exam"),
    now: t("now"),
    hostBadge: t("hostBadge"),
    you: t("you"),
    yourZone: t("yourZone"),
    sameAs: t("sameAs"),
    before: t("before"),
    during: t("during"),
    after: t("after"),
    afterLine: t("afterLine", { count: lignes.length }),
    days: t("days"),
    hours: t("hours"),
    minutes: t("minutes"),
    seconds: t("seconds"),
  };

  return (
    <section
      id="simultaneite"
      className="border-t border-foreground/10 bg-surface-alt py-20 text-foreground lg:py-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 font-display text-foreground">{t("title")}</h2>
          <p className="max-w-2xl text-body-l text-muted-foreground">{t("lead", { count: lignes.length })}</p>
        </div>

        <Partition
          lignes={lignes}
          debutIso={debut.toISOString()}
          finIso={fin.toISOString()}
          libelles={libelles}
        />

        <p className="max-w-3xl text-small text-muted-foreground">
          {t("referenceLine", { time: heureLocale(exam.referenceZone, debut), zone: exam.referenceZone })}
          {exam.provisional && <> — {t("note")}</>}
        </p>
      </div>
    </section>
  );
}
