import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
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
  return { title: t("title"), description: t("lead") };
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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {delegations.map((delegation) => {
              const hasFiche = Boolean(delegation.description);
              const cardContent = (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl" aria-hidden>
                      {delegation.flagEmoji}
                    </span>
                    <h2 className="font-display text-h4 text-foreground">
                      {delegation.name[typedLocale]}
                    </h2>
                    {delegation.isHost && (
                      <p className="label-mono text-muted-foreground">{t("hostBadge")}</p>
                    )}
                  </div>
                  {hasFiche && (
                    <span className="label-mono mt-auto text-link group-hover:text-foreground">
                      {t("viewTeam")} →
                    </span>
                  )}
                </>
              );

              if (hasFiche) {
                return (
                  <Link
                    key={delegation.slug}
                    href={`/equipes/${delegation.slug}`}
                    className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-hairline bg-card p-7 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={delegation.slug}
                  className="flex h-full flex-col justify-between gap-4 rounded-xl border border-hairline bg-card p-7"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
