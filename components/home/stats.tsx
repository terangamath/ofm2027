import { getTranslations } from "next-intl/server";
import { IsometricGrid } from "@/components/motifs/isometric-grid";
import { SectionHeading } from "@/components/home/section-heading";
import statsData from "@/content/stats.json";
import type { Locale, Stat } from "@/content/types";

const stats = statsData as Stat[];

export async function StatsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Stats" });
  const hasProvisional = stats.some((stat) => stat.provisional);

  return (
    <section className="relative overflow-hidden bg-vert py-24 text-ivoire lg:py-32">
      <IsometricGrid className="pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} tone="inverted" />

        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label.fr} className="flex flex-col gap-2">
              <dt className="order-2 text-body text-ivoire/70">
                {stat.label[locale]}
                {stat.provisional && <span aria-hidden> *</span>}
              </dt>
              <dd className="order-1 font-display text-display-l tabular-nums text-or-clair">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {hasProvisional && <p className="text-small text-ivoire/50">* {t("provisionalNote")}</p>}
      </div>
    </section>
  );
}
