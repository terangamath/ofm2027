import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import type { Locale } from "@/content/types";
import { evenement as eventInfo } from "@/lib/contenu";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Contact" });
  return metadonneesPage({ locale, chemin: "/contact", titre: t("title"), description: t("lead") });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Contact" });

  const rows = [
    { label: t("organizerLabel"), value: eventInfo.organizer },
    {
      label: t("locationLabel"),
      value: `${eventInfo.city[typedLocale]}, ${eventInfo.country[typedLocale]}`,
    },
  ];

  return (
    <>
      <PageHero chemin="/contact" title={t("title")} lead={t("lead")} />

      <section className="bg-surface pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <dl className="flex flex-col">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 border-b border-hairline py-5 first:pt-0"
              >
                <dt className="label text-muted-foreground">{row.label}</dt>
                <dd className="text-body-l font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 border-b border-hairline py-5">
              <dt className="label text-muted-foreground">{t("emailLabel")}</dt>
              <dd>
                <a
                  href={`mailto:${t("emailValue")}`}
                  className="link-text text-body-l font-medium text-link"
                >
                  {t("emailValue")}
                </a>
              </dd>
            </div>
            {eventInfo.organizerUrl && (
              <div className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 py-5">
                <dt className="label text-muted-foreground">{t("websiteLabel")}</dt>
                <dd>
                  <a
                    href={eventInfo.organizerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-text text-body-l font-medium text-link"
                  >
                    www.terangamath.org
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>
    </>
  );
}
