import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    <section className="bg-vert-nuit py-20 text-ivoire lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        <Link
          href="/equipes"
          className="label-mono self-start text-or-clair underline decoration-hairline underline-offset-4 transition-colors hover:text-ivoire"
        >
          ← {t("back")}
        </Link>

        <div className="flex items-center gap-5">
          <span className="text-5xl" aria-hidden>
            {delegation.flagEmoji}
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-display-l">{delegation.name[typedLocale]}</h1>
            <p className="label-mono text-or-clair">
              {delegation.isHost && `${t("hostBadge")} · `}
              {delegation.status === "confirmed" ? t("statusConfirmed") : t("statusPending")}
            </p>
          </div>
        </div>

        <p className="text-body-l text-ivoire/80">
          {delegation.description ? delegation.description[typedLocale] : t("descriptionPending")}
        </p>

        <div className="flex flex-col gap-4 border-t border-ivoire/15 pt-8">
          <h2 className="label-mono text-ivoire/50">{t("membersTitle")}</h2>
          {delegation.members && delegation.members.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {delegation.members.map((member, index) => (
                <li key={index} className="flex items-baseline justify-between gap-4">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-small text-ivoire/60">{member.role[typedLocale]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-ivoire/60 italic">{t("membersPending")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
