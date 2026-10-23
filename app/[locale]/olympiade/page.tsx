import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/home/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ReferenceCategories } from "@/components/shared/reference-categories";
import { evenement as eventInfo, format, documents } from "@/lib/contenu";
import type { Locale } from "@/content/types";

const reglement = documents.find((doc) => doc.id === "reglement-2025");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Olympiad" });
  return metadonneesPage({ locale, chemin: "/olympiade", titre: t("title"), description: t("lead") });
}

export default async function OlympiadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.Olympiad" });

  const facts = [
    { label: t("Format.facts.durationLabel"), value: format.duration[typedLocale] },
    { label: t("Format.facts.domainsLabel"), value: format.domains.map((domain) => domain[typedLocale]).join(" · ") },
    { label: t("Format.facts.teamSize", { count: format.teamSize }), value: t("Format.facts.problems", { count: format.problemsCount }) },
    { label: t("Format.facts.correctionLabel"), value: format.correction[typedLocale] },
    { label: t("Format.facts.distinctionsLabel"), value: format.distinctions[typedLocale] },
  ];

  return (
    <>
      <PageHero chemin="/olympiade" title={t("title")} lead={t("lead")} />

      <section className="bg-surface pb-20 text-foreground lg:pb-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 className="text-h2 font-display text-foreground">{t("Presentation.title")}</h2>
          <div className="flex max-w-[62ch] flex-col gap-5">
            <p className="text-body-l text-foreground">{t("Presentation.body1")}</p>
            <p className="text-body-l text-foreground">{t("Presentation.body2")}</p>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt py-20 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
          <SectionHeading title={t("Format.title")} lead={t("Format.lead")} />

          {/* Les deux catégories en diptyque, puis les faits du format en liste. */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0">
            {eventInfo.categories.map((category, index) => (
              <div
                key={category.id}
                className={`flex flex-col gap-2 ${index === 1 ? "md:border-l md:border-hairline md:pl-12" : "md:pr-12"}`}
              >
                <h3 className="font-display text-h2 text-foreground">{category.name[typedLocale]}</h3>
                <p className="text-body-l text-muted-foreground">{category.scope[typedLocale]}</p>
              </div>
            ))}
          </div>

          <ReferenceCategories locale={typedLocale} className="-mt-6 max-w-2xl" />

          <dl className="flex flex-col border-t border-hairline">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-1 gap-2 border-b border-hairline py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
              >
                <dt className="label text-muted-foreground">{fact.label}</dt>
                <dd className="max-w-[62ch] text-body text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {reglement && (
            <a href={reglement.path} target="_blank" rel="noopener noreferrer" className="link-text self-start text-link">
              {t("Format.facts.reglementLink")}
            </a>
          )}
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
          <SectionHeading title={t("Faq.title")} lead={t("Faq.lead")} align="center" />
          <FaqAccordion locale={typedLocale} />
        </div>
      </section>
    </>
  );
}
