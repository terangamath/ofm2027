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
            {delegations.map((delegation) => (
              <Link
                key={delegation.slug}
                href={`/equipes/${delegation.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-hairline bg-card p-7 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden>
                    {delegation.flagEmoji}
                  </span>
                  <span
                    className={`size-2 rounded-full ${
                      delegation.status === "confirmed"
                        ? "bg-vert-clair"
                        : "bg-muted-foreground/40"
                    }`}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-h4 text-foreground">
                    {delegation.name[typedLocale]}
                  </h2>
                  <p className="label-mono text-muted-foreground">
                    {delegation.isHost
                      ? t("hostBadge")
                      : delegation.status === "confirmed"
                        ? t("statusConfirmed")
                        : t("statusPending")}
                  </p>
                </div>
                <span className="label-mono mt-auto text-link group-hover:text-foreground">
                  {t("viewTeam")} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
