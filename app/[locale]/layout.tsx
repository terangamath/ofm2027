import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ViewTransition } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { robotsSite } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

// Axes variables réellement chargés : opsz (taille optique, automatique selon
// la taille du texte), SOFT et WONK (caractère du titrage, voir globals.css).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
        {/* Mesures de terrain (Core Web Vitals des vrais visiteurs), sans cookie ;
            actives une fois Speed Insights activé dans le tableau de bord Vercel. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
