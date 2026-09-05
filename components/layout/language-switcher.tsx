"use client";

import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher({
  locale,
  locales,
  label,
}: {
  locale: string;
  locales: string[];
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="label flex items-center gap-1">
      {locales.map((loc, index) => {
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
              className={active ? "text-link" : "text-muted-foreground hover:text-foreground"}
            >
              {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
