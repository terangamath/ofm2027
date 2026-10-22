import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FigureConstruction } from "@/components/motifs/figure-construction";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";
import { sansVeuve } from "@/lib/typographie";

const FIGURE_SOURCE = "/archives/2024/ofm-2024-senior-sujet.pdf";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Hero" });
  const categories = eventInfo.categories.map((category) => category.name[locale]).join(" · ");

  const meta: { label: string; value: string; data?: boolean }[] = [
    ...(eventInfo.dates ? [{ label: t("metaDates"), value: eventInfo.dates[locale], data: true }] : []),
    { label: t("metaLocation"), value: `${eventInfo.city[locale]}, ${eventInfo.country[locale]}` },
    { label: t("metaLanguage"), value: eventInfo.officialLanguage[locale] },
    { label: t("metaFormat"), value: categories },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-surface text-foreground">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-14 px-6 pt-20 pb-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:pt-28 lg:pb-20">
        <div className="flex flex-col gap-10">
          <h1 className="max-w-4xl text-display-xl font-display text-primary">{sansVeuve(t("title"))}</h1>

          <p className="max-w-2xl text-body-l text-muted-foreground">{t("lead")}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/olympiade"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:translate-y-px"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/equipes"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-foreground/25 px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/60"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        {/* La figure se construit à côté du texte, sans jamais le bloquer. */}
        <figure className="mx-auto flex w-full max-w-md flex-col gap-3 lg:max-w-none">
          <FigureConstruction className="h-auto w-full" />
          <figcaption className="text-small text-muted-foreground">
            <a href={FIGURE_SOURCE} target="_blank" rel="noopener noreferrer" className="link-text">
              {t("figureCaption")}
            </a>
          </figcaption>
        </figure>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <dt className="label text-muted-foreground">{item.label}</dt>
              <dd className={item.data ? "data text-body text-chiffre" : "text-body font-medium"}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
