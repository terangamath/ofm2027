import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/home/section-heading";
import { getNews } from "@/lib/content";
import type { Locale } from "@/content/types";

const DATE_FORMAT: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

export async function NewsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.News" });
  const news = getNews(locale).slice(0, 3);

  if (news.length === 0) return null;

  const formatter = new Intl.DateTimeFormat(DATE_FORMAT[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              key={item.slug}
              href={`/actualites/${item.slug}`}
              className="group flex flex-col gap-4 rounded-xl border border-hairline bg-card p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="label-mono flex items-center gap-3 text-muted-foreground">
                <time dateTime={item.date} className="tabular-nums">
                  {formatter.format(new Date(item.date))}
                </time>
                <span aria-hidden>·</span>
                <span>{item.type}</span>
              </div>
              <h3 className="font-display text-h4 text-foreground">{item.title}</h3>
              <p className="text-body text-muted-foreground">{item.excerpt}</p>
              <span className="label-mono mt-auto text-link group-hover:text-foreground">
                {t("readMore")} →
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/actualites"
          className="label-mono self-start text-link underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
