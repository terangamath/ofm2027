import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Link } from "@/i18n/navigation";
import { getNews } from "@/lib/content";
import type { Locale } from "@/content/types";

const DATE_FORMAT: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.News" });
  return { title: t("title"), description: t("lead") };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Pages.News" });
  const news = getNews(typedLocale);
  const formatter = new Intl.DateTimeFormat(DATE_FORMAT[typedLocale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6">
          {news.length === 0 ? (
            <p className="text-body text-muted-foreground">{t("empty")}</p>
          ) : (
            news.map((item) => (
              <Link
                key={item.slug}
                href={`/actualites/${item.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-hairline bg-card p-7 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="label-mono flex items-center gap-3 text-muted-foreground">
                  <time dateTime={item.date} className="tabular-nums">
                    {formatter.format(new Date(item.date))}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{item.type}</span>
                </div>
                <h2 className="font-display text-h4 text-foreground">{item.title}</h2>
                <p className="text-body text-muted-foreground">{item.excerpt}</p>
                <span className="label-mono mt-1 text-link group-hover:text-foreground">
                  {t("readMore")} →
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
