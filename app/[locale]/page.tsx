import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <p className="label-mono text-accent">01 — L&apos;Olympiade</p>
      <h1 className="mt-4 font-display text-display-xl">OFM 2027</h1>
    </div>
  );
}
