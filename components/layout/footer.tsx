import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import event from "@/content/event.json";
import type { EventInfo, Locale } from "@/content/types";

const eventInfo = event as EventInfo;

const SECTIONS_A = [
  { key: "olympiad", href: "/olympiade" },
  { key: "organisation", href: "/organisation" },
  { key: "teams", href: "/equipes" },
  { key: "programme", href: "/programme" },
  { key: "practicalInfo", href: "/informations" },
] as const;

const SECTIONS_B = [
  { key: "problems", href: "/problemes" },
  { key: "news", href: "/actualites" },
  { key: "history", href: "/historique" },
  { key: "gallery", href: "/galerie" },
  { key: "results", href: "/resultats" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const locale = (await getLocale()) as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>
                Σ
              </span>
              <span className="label-mono text-foreground">OFM 2027</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          <nav aria-label={t("sections")} className="flex flex-col gap-3">
            <h2 className="label-mono text-muted-foreground">{t("sections")}</h2>
            {SECTIONS_A.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>

          <nav aria-label={t("resources")} className="flex flex-col gap-3">
            <h2 className="label-mono text-muted-foreground">{t("resources")}</h2>
            {SECTIONS_B.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="label-mono text-muted-foreground">{t("contact")}</h2>
            <Link
              href="/contact"
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {tNav("contact")}
            </Link>
            <Link
              href="/mentions-legales"
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {t("legalMentions")}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">{t("rights", { year })}</p>
          <p>
            {t("organizedBy")}{" "}
            <span className="font-medium text-foreground">{eventInfo.organizer}</span>
            {" — "}
            {eventInfo.city[locale]}, {eventInfo.country[locale]}
          </p>
        </div>
      </div>
    </footer>
  );
}
