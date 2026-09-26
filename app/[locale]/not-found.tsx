import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { sansVeuve } from "@/lib/typographie";

const REPRISES = [
  { key: "home", href: "/" },
  { key: "olympiad", href: "/olympiade" },
  { key: "teams", href: "/equipes" },
  { key: "programme", href: "/programme" },
  { key: "problems", href: "/problemes" },
] as const;

/** 404 traduite : même ouverture sur sable que les pages internes, puis des points de reprise. */
export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");
  const nav = await getTranslations("Nav");

  return (
    <section className="flex-1 bg-sable pt-16 pb-20 text-anthracite lg:pt-24 lg:pb-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6">
        <p className="font-display text-display-l leading-none tabular-nums text-or-encre" aria-hidden>
          404
        </p>
        <h1 className="max-w-4xl font-display text-h2 text-vert">{sansVeuve(t("title"))}</h1>
        <p className="max-w-2xl text-body-l text-encre">{t("lead")}</p>
        <span aria-hidden className="mt-4 block h-px w-full bg-hairline" />

        <nav aria-label={t("suggestions")} className="flex flex-col gap-4 pt-4">
          <p className="label text-encre">{t("suggestions")}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {REPRISES.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="link-text text-body-l font-medium text-link">
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
