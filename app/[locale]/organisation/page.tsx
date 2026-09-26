import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/home/section-heading";
import { partenaires as partners, comites as committees } from "@/lib/contenu";
import type { Locale } from "@/content/types";

const terangamath = partners.find((partner) => partner.id === "terangamath");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Organisation" });
  return metadonneesPage({ locale, chemin: "/organisation", titre: t("title"), description: t("lead") });
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
      <PageHero title={t("title")} lead={t("lead")} />

      <section className="bg-sable pb-20 text-anthracite lg:pb-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 className="text-h2 font-display text-anthracite">{t("About.title")}</h2>
          <div className="flex max-w-[62ch] flex-col gap-6">
            <p className="text-body-l text-anthracite/85">{t("About.body")}</p>
            {terangamath?.url && (
              <a href={terangamath.url} target="_blank" rel="noopener noreferrer" className="link-text self-start text-vert">
                www.terangamath.org
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
          <SectionHeading title={t("Committees.title")} lead={t("Committees.lead")} />

          {/* Comités en lignes filetées : la hiérarchie vient du titre, pas d'une boîte. */}
          <dl className="flex flex-col border-t border-hairline">
            {committees.map((committee) => (
              <div
                key={committee.id}
                className="grid grid-cols-1 gap-3 border-b border-hairline py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
              >
                <dt className="font-display text-h3 text-foreground">{committee.name[typedLocale]}</dt>
                <dd className="flex max-w-[62ch] flex-col gap-4">
                  {committee.description && (
                    <p className="text-body text-muted-foreground">{committee.description[typedLocale]}</p>
                  )}
                  {committee.members.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {committee.members.map((member, index) => (
                        <li key={`${committee.id}-${index}`} className="flex flex-col">
                          <span className="font-medium text-foreground">{member.name}</span>
                          <span className="text-small text-muted-foreground">
                            {member.role[typedLocale]}
                            {member.org && ` — ${member.org}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
