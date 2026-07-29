import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/home/section-heading";
import organisationData from "@/content/organisation.json";
import partnersData from "@/content/partenaires.json";
import type { Committee, Locale, Partner } from "@/content/types";

const committees = organisationData as Committee[];
const partners = partnersData as Partner[];
const terangamath = partners.find((partner) => partner.id === "terangamath");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Organisation" });
  return { title: t("title"), description: t("lead") };
}

export default async function OrganisationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Organisation" });

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6">
          <SectionHeading eyebrow={t("About.eyebrow")} title={t("About.title")} />
          <p className="text-body-l text-foreground/85">{t("About.body")}</p>
          {terangamath?.url && (
            <a
              href={terangamath.url}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono self-start text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
            >
              terangamath.org →
            </a>
          )}
        </div>
      </section>

      <section className="bg-sable py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
          <SectionHeading
            eyebrow={t("Committees.eyebrow")}
            title={t("Committees.title")}
            lead={t("Committees.lead")}
            tone="warm"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {committees.map((committee) => (
              <div
                key={committee.id}
                className="flex flex-col gap-5 rounded-xl border border-hairline bg-card p-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-h3 text-foreground">
                    {committee.name[typedLocale]}
                  </h3>
                  {committee.description && (
                    <p className="text-muted-foreground">{committee.description[typedLocale]}</p>
                  )}
                </div>

                <ul className="flex flex-col gap-3 border-t border-hairline pt-5">
                  {committee.members.length === 0 ? (
                    <li className="text-small text-muted-foreground italic">
                      {t("Committees.membersPending")}
                    </li>
                  ) : (
                    committee.members.map((member, index) => (
                      <li key={`${committee.id}-${index}`} className="flex flex-col">
                        <span className="font-medium text-foreground">{member.name}</span>
                        <span className="text-small text-muted-foreground">
                          {member.role[typedLocale]}
                          {member.org && ` — ${member.org}`}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
