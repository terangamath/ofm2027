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
    <section className="bg-vert-nuit py-24 text-ivoire lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading title={t("title")} lead={t("lead")} tone="inverted" />

        <div className="flex flex-col gap-6 rounded-xl border border-ivoire/15 bg-vert/30 p-10">
          <div
            className="katex-preview flex justify-center text-ivoire [&_.katex]:text-ivoire"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
          <p className="label text-center text-ivoire/40">
            {t("comingSoon")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-14">
        <Link
          href="/problemes"
          className="link-text text-or-clair"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
