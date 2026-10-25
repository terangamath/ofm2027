import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { getTranslations } from "next-intl/server";
import { CarteSurvol } from "@/components/home/carte-survol";
import { Flag } from "@/components/shared/flag";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale, PaysCarte } from "@/content/types";
import mondeData from "@/content/geo/monde.json";
import { getDelegations } from "@/lib/content";

const LARGEUR = 960;
const HAUTEUR = 480;
/** En dessous de cette aire (px² dans le repère de la carte), un pays participant reçoit aussi un point. */
const AIRE_MINIMALE = 40;

const monde = mondeData as { source: string; pays: PaysCarte[] };

/**
 * Les pays participants sur une carte du monde (Natural Earth, projection
 * Natural Earth I), calculée côté serveur : seuls les tracés SVG partent vers
 * le navigateur. Le statut vient d'une seule source, `status` dans
 * content/delegations/*.json : seuls les pays « confirmed » sont colorés, le
 * pays hôte d'une couleur à part. Les pays participants sont des liens vers
 * leur fiche ; une liste de liens les reprend sous la carte.
 */
export async function PaysParticipantsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Countries" });
  const participants = getDelegations().filter((delegation) => delegation.status === "confirmed");
  const parIso3 = new Map(participants.map((delegation) => [delegation.iso3, delegation]));

  const features: Feature<Polygon | MultiPolygon, PaysCarte>[] = monde.pays.map((pays) => ({
    type: "Feature",
    properties: pays,
    geometry: pays.geometry,
  }));
  const collection: FeatureCollection<Polygon | MultiPolygon, PaysCarte> = { type: "FeatureCollection", features };
  const projection = geoNaturalEarth1().fitSize([LARGEUR, HAUTEUR], collection);
  const trace = geoPath(projection).digits(1);

  const neutres = features.filter((feature) => !parIso3.has(feature.properties.iso3));
  const colores = features.filter((feature) => parIso3.has(feature.properties.iso3));

  return (
    <section aria-labelledby="pays-participants" className="bg-carte-fond py-14 text-ivoire lg:py-20">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col gap-3">
              <h2 id="pays-participants" className="text-[clamp(1.625rem,1.3rem+1vw,2rem)] font-bold text-ivoire">
                {t("title")}
              </h2>
              <span aria-hidden className="h-0.5 w-12 bg-accent" />
            </div>
            <Link
              href="/equipes"
              className="inline-flex min-h-12 items-center rounded-full border-2 border-ivoire px-6 text-base font-semibold text-ivoire transition-[background-color,color] duration-100 hover:bg-ivoire hover:text-vert-profond focus-visible:outline-ivoire active:bg-ivoire active:text-vert-profond"
            >
              {t("cta")}
            </Link>
          </div>

          <figure className="flex flex-col gap-3">
            <CarteSurvol>
              <svg viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`} role="group" aria-label={t("mapLabel")} className="carte h-auto w-full">
                <g aria-hidden>
                  {neutres.map((feature) => (
                    <path
                      key={feature.properties.iso3 + feature.properties.name.en}
                      d={trace(feature) ?? undefined}
                      data-nom={feature.properties.name[locale]}
                      className="carte-pays"
                    />
                  ))}
                </g>
                {colores.map((feature) => {
                  const delegation = parIso3.get(feature.properties.iso3);
                  if (!delegation) return null;
                  const [cx, cy] = trace.centroid(feature);
                  // Petits pays, et le pays hôte : un point en plus du tracé, pour rester visibles.
                  const petit = delegation.isHost || trace.area(feature) < AIRE_MINIMALE;
                  return (
                    <a
                      key={delegation.slug}
                      href={getPathname({ href: `/equipes/${delegation.slug}`, locale })}
                      aria-label={delegation.name[locale]}
                      data-nom={delegation.name[locale]}
                      className={delegation.isHost ? "carte-hote" : "carte-participant"}
                    >
                      <path d={trace(feature) ?? undefined} />
                      {petit && <circle cx={cx} cy={cy} r={delegation.isHost ? 6 : 4.5} />}
                    </a>
                  );
                })}
              </svg>
            </CarteSurvol>

            <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-small">
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-3 rounded-full bg-carte-hote" />
                  {t("legendHost")}
                </span>
                {participants.some((delegation) => !delegation.isHost) && (
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-3 rounded-full bg-carte-participant" />
                    {t("legendParticipant")}
                  </span>
                )}
              </span>
              <span className="text-ivoire/80">
                {t.rich("credit", {
                  link: (chunks) => (
                    <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      {chunks}
                    </a>
                  ),
                })}
              </span>
            </figcaption>
          </figure>
        </div>

        <nav aria-label={t("listLabel")} className="border-t border-ivoire/20 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {participants.map((delegation) => (
              <li key={delegation.slug}>
                <Link
                  href={`/equipes/${delegation.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 text-body underline decoration-ivoire/40 underline-offset-4 hover:decoration-ivoire"
                >
                  <Flag countryCode={delegation.countryCode} size={20} />
                  {delegation.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
