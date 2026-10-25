import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { ViewTransition } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Flag } from "@/components/shared/flag";
import { Link } from "@/i18n/navigation";
import { getDelegations } from "@/lib/content";
import type { Locale } from "@/content/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  return metadonneesPage({ locale, chemin: "/equipes", titre: t("title"), description: t("lead") });
}

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Teams" });
  const delegations = getDelegations();

  return (
    <>
      <PageHero chemin="/equipes" title={t("title")} lead={t("lead")} />

      <section className="bg-surface pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
            {delegations.map((delegation) => {
              const hasFiche = Boolean(delegation.description);
              const pending = delegation.status !== "confirmed";
              return (
                <li
                  key={delegation.slug}
                  className="flex flex-col gap-2 border-b border-hairline py-6"
                >
                  <div className="flex items-center gap-4">
                    {hasFiche ? (
                      <ViewTransition name={`delegation-${delegation.slug}`} share="partage">
                        <span className="flex items-center gap-4">
                          <Flag countryCode={delegation.countryCode} size={32} />
                          <h2 className="text-h4 text-foreground">{delegation.name[typedLocale]}</h2>
                        </span>
                      </ViewTransition>
                    ) : (
                      <>
                        <Flag countryCode={delegation.countryCode} size={32} />
                        <h2 className="text-h4 text-foreground">{delegation.name[typedLocale]}</h2>
                      </>
                    )}
                    {delegation.isHost && (
                      <span className="label ml-auto text-primary">{t("hostBadge")}</span>
                    )}
                    {pending && (
                      <span className="label ml-auto text-muted-foreground">{t("statusPending")}</span>
                    )}
                  </div>
                  {hasFiche && delegation.description && (
                    <p className="pl-12 text-body text-muted-foreground">{delegation.description[typedLocale]}</p>
                  )}
                  {hasFiche && (
                    <Link
                      href={`/equipes/${delegation.slug}`}
                      className="link-text ml-12 self-start text-primary active:text-foreground"
                    >
                      {t("viewTeam")}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
