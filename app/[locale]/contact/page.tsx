import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import event from "@/content/event.json";
import partnersData from "@/content/partenaires.json";
import type { EventInfo, Locale, Partner } from "@/content/types";

const eventInfo = event as EventInfo;
const partners = partnersData as Partner[];
const terangamath = partners.find((partner) => partner.id === "terangamath");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Contact" });
  return { title: t("title"), description: t("lead") };
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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <dl className="flex flex-col">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 border-b border-hairline py-5 first:pt-0"
              >
                <dt className="label-mono text-muted-foreground">{row.label}</dt>
                <dd className="text-body-l font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 border-b border-hairline py-5">
              <dt className="label-mono text-muted-foreground">{t("emailLabel")}</dt>
              <dd>
                <a
                  href={`mailto:${t("emailValue")}`}
                  className="text-body-l font-medium text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
                >
                  {t("emailValue")}
                </a>
              </dd>
            </div>
            {terangamath?.url && (
              <div className="grid grid-cols-[minmax(8rem,auto)_1fr] items-baseline gap-6 py-5">
                <dt className="label-mono text-muted-foreground">{t("websiteLabel")}</dt>
                <dd>
                  <a
                    href={terangamath.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-l font-medium text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
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
