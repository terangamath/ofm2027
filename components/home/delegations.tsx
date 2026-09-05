import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import { Flag } from "@/components/shared/flag";
import { getDelegations } from "@/lib/content";
import type { Locale } from "@/content/types";

/** Registre des délégations : lignes filetées, pas de pastilles ni de cartes. */
export async function DelegationsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Delegations" });
  const delegations = getDelegations();

  return (
    <section className="bg-sable py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
        <SectionHeading title={t("title")} lead={t("lead")} tone="warm" />

        <ul className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {delegations.map((delegation) => {
            const pending = delegation.status !== "confirmed";
            return (
              <li key={delegation.slug} className="border-b border-hairline">
                <Link
                  href={`/equipes/${delegation.slug}`}
                  className="flex min-h-14 items-center gap-3 py-3 text-anthracite hover:text-vert"
                >
                  <Flag countryCode={delegation.countryCode} size={24} />
                  <span className={`font-medium ${pending ? "text-encre" : ""}`}>
                    {delegation.name[locale]}
                  </span>
                  {delegation.isHost && (
                    <span className="label ml-auto text-vert">{t("hostBadge")}</span>
                  )}
                  {pending && (
                    <span className="label ml-auto text-encre">{t("statusPending")}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/equipes" className="link-text self-start text-vert">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
