import katex from "katex";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/content/types";

/** Formule d'illustration, indépendante de tout énoncé — sert uniquement à
 * démontrer la qualité du rendu KaTeX tant que les problèmes 2027 ne sont
 * pas publiés. */
const SAMPLE_FORMULA = String.raw`e^{i\pi} + 1 = 0`;

export async function ProblemsTeaserSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Problems" });
  const formulaHtml = katex.renderToString(SAMPLE_FORMULA, {
    throwOnError: false,
    displayMode: true,
  });

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading title={t("title")} lead={t("lead")} />
          <Link href="/problemes" className="link-text self-start text-link">
            {t("cta")}
          </Link>
        </div>

        <figure className="flex flex-col gap-4 border-y border-hairline py-8">
          <div
            className="flex justify-center text-2xl text-foreground [&_.katex]:text-foreground"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
          <figcaption className="text-center text-small text-muted-foreground">{t("comingSoon")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
