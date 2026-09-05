import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Flag } from "@/components/shared/flag";
import { getDelegations } from "@/lib/content";
import type { Locale } from "@/content/types";

export function generateStaticParams() {
  return getDelegations().map((delegation) => ({ pays: delegation.slug }));
}

async function findDelegation(pays: string) {
  return getDelegations().find((delegation) => delegation.slug === pays) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pays: string }>;
}): Promise<Metadata> {
  const { locale, pays } = await params;
  const delegation = await findDelegation(pays);
  if (!delegation) return {};
  const typedLocale = locale as Locale;
  return { title: delegation.name[typedLocale] };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pays: string }>;
}) {
  const { locale, pays } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.TeamDetail" });
  const delegation = await findDelegation(pays);

  if (!delegation) notFound();

  return (
    <section className="bg-sable py-16 text-anthracite lg:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <Link href="/equipes" className="link-text self-start text-vert">
          {t("back")}
        </Link>

        <div className="flex flex-col gap-3">
          {/* Cible de l'élément partagé venu du registre (uniquement si la fiche existe). */}
          {delegation.description ? (
            <ViewTransition name={`delegation-${delegation.slug}`} share="partage">
              <span className="flex items-center gap-5">
                <Flag countryCode={delegation.countryCode} size={64} />
                <h1 className="font-display text-display-l text-vert">{delegation.name[typedLocale]}</h1>
              </span>
            </ViewTransition>
          ) : (
            <span className="flex items-center gap-5">
              <Flag countryCode={delegation.countryCode} size={64} />
              <h1 className="font-display text-display-l text-vert">{delegation.name[typedLocale]}</h1>
            </span>
          )}
          <p className="label text-encre">
            {delegation.isHost && `${t("hostBadge")} · `}
            {delegation.status === "confirmed" ? t("statusConfirmed") : t("statusPending")}
          </p>
        </div>

        {delegation.description && (
          <p className="text-body-l text-anthracite/85">{delegation.description[typedLocale]}</p>
        )}

        {delegation.members && delegation.members.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-hairline pt-8">
            <h2 className="label text-encre">{t("membersTitle")}</h2>
            <ul className="flex flex-col gap-3">
              {delegation.members.map((member, index) => (
                <li key={index} className="flex items-baseline justify-between gap-4">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-small text-encre">{member.role[typedLocale]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
