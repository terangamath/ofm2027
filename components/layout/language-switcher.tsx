"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <nav
      aria-label={t("languageSwitcherLabel")}
      className="label flex items-center gap-1"
    >
      {routing.locales.map((loc, index) => {
        const active = loc === locale;
        return (
          <span key={loc} className="flex items-center gap-1">
            {index > 0 && (
              <span aria-hidden className="text-border">
                /
              </span>
            )}
            <Link
              href={pathname}
              locale={loc}
              aria-current={active ? "true" : undefined}
              className={
                active
                  ? "text-link"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {LOCALE_LABELS[loc]}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
