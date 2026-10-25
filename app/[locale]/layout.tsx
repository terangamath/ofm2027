import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ViewTransition } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { robotsSite } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

// Police unique du site : Montserrat, quatre graisses (voir globals.css pour la hiérarchie).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s — OFM 2027",
    },
    description: t("description"),
    // Canonique, hreflang et Open Graph sont portés par chaque page (lib/seo.ts) :
    // un hreflang posé ici serait hérité tel quel par toutes les routes.
    robots: robotsSite,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Clair par défaut, quel que soit le réglage du système ; le choix du
            visiteur (sélecteur de l'en-tête) est retenu par next-themes. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* Aucun composant client ne traduit : on n'envoie pas les messages au navigateur. */}
          <NextIntlClientProvider messages={{}}>
            <Header />
            <main id="contenu" className="flex flex-1 flex-col">
              {/* Seul le contenu principal transitionne ; l'en-tête reste le repère fixe. */}
              <ViewTransition default="page">{children}</ViewTransition>
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
