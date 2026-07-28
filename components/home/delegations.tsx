import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IsometricGrid } from "@/components/motifs/isometric-grid";
import { SectionHeading } from "@/components/home/section-heading";
import { getDelegations } from "@/lib/content";
import type { Locale } from "@/content/types";

export async function DelegationsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Delegations" });
  const delegations = getDelegations();

  return (
    <section className="relative overflow-hidden bg-sable py-24 lg:py-32">
      <IsometricGrid className="pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} tone="warm" />

        <ul className="flex flex-wrap gap-4">
          {delegations.map((delegation) => (
            <li key={delegation.slug}>
              <Link
                href={`/equipes/${delegation.slug}`}
                className="group flex items-center gap-3 rounded-full border border-hairline bg-card px-5 py-3 shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-elevated"
              >
                <span className="text-xl" aria-hidden>
                  {delegation.flagEmoji}
                </span>
                <span className="font-medium text-foreground">{delegation.name[locale]}</span>
                {delegation.isHost && (
                  <span className="label-mono rounded-full bg-accent/15 px-2 py-0.5 text-link">
                    {t("hostBadge")}
                  </span>
                )}
                <span
                  className={`size-2 rounded-full ${
                    delegation.status === "confirmed" ? "bg-vert-clair" : "bg-muted-foreground/40"
                  }`}
                  aria-label={
                    delegation.status === "confirmed" ? t("statusConfirmed") : t("statusPending")
                  }
                  title={delegation.status === "confirmed" ? t("statusConfirmed") : t("statusPending")}
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/equipes"
          className="label-mono self-start text-vert underline decoration-hairline underline-offset-4 transition-colors hover:text-anthracite"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
