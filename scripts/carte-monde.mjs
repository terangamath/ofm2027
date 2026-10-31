/**
 * Fond de carte du monde (section « Les pays participants » de l'accueil).
 *
 * Source : Natural Earth, Admin 0 – Countries, v5.1.2 (domaine public,
 * https://www.naturalearthdata.com/about/terms-of-use/). Échelle 1:110m, et
 * 1:50m pour les pays de content/delegations/ absents du 1:110m (Comores).
 *
 * Usage (les deux GeoJSON téléchargés depuis
 * https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson) :
 *   node scripts/carte-monde.mjs <ne_110m_admin_0_countries.geojson> <ne_50m_admin_0_countries.geojson>
 *
 * Écrit content/geo/monde.json : code ISO 3166-1 alpha-3 (champ ISO_A3_EH,
 * qui corrige les -99 de la France et de la Norvège), alpha-2, noms fr/en et
 * géométrie arrondie au centième de degré et simplifiée (0,2°), anneaux
 * réorientés pour d3-geo (extérieur dans le sens horaire). L'Antarctique est retiré.
 */
import fs from "node:fs";
import path from "node:path";

const [source110, source50] = process.argv.slice(2);
if (!source110 || !source50) {
  console.error("Usage : node scripts/carte-monde.mjs <ne_110m.geojson> <ne_50m.geojson>");
  process.exit(1);
}

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const lire = (fichier) => JSON.parse(fs.readFileSync(fichier, "utf-8"));

const arrondi = (n) => Math.round(n * 100) / 100;

/** Aire signée (lon/lat planaires) : positive si l'anneau tourne dans le sens trigonométrique. */
function aireSignee(anneau) {
  let somme = 0;
  for (let i = 0, j = anneau.length - 1; i < anneau.length; j = i++) {
    somme += (anneau[j][0] - anneau[i][0]) * (anneau[j][1] + anneau[i][1]);
  }
  return somme / 2;
}

/** Après arrondi, un îlot peut s'aplatir (aire nulle) : d3-geo le lirait comme le globe entier. */
const degenere = (anneau) => Math.abs(aireSignee(anneau)) < 1e-6;

/** Distance minimale entre deux points gardés : 0,2° ≈ un demi-pixel sur la carte de l'accueil. */
const TOLERANCE = 0.2;

/** Simplification par distance radiale ; un anneau garde au moins quatre points. */
function simplifier(anneau) {
  if (anneau.length <= 5) return anneau;
  const garde = [anneau[0]];
  for (const point of anneau.slice(1, -1)) {
    const [x, y] = garde[garde.length - 1];
    if (Math.hypot(point[0] - x, point[1] - y) >= TOLERANCE) garde.push(point);
  }
  garde.push(anneau[anneau.length - 1]);
  return garde.length >= 4 ? garde : anneau;
}

/** d3-geo attend l'extérieur dans le sens horaire et les trous dans le sens trigonométrique. */
function polygone(anneaux) {
  return anneaux
    .map((anneau) => simplifier(anneau.map(([x, y]) => [arrondi(x), arrondi(y)])))
    .filter((anneau, i) => i === 0 || !degenere(anneau))
    .map((points, i) => {
      const horaire = aireSignee(points) < 0;
      return (i === 0) === horaire ? points : points.reverse();
    });
}

function geometrie(g) {
  const polygones = (g.type === "Polygon" ? [g.coordinates] : g.coordinates)
    .map(polygone)
    .filter((anneaux) => !degenere(anneaux[0]));
  return polygones.length === 1
    ? { type: "Polygon", coordinates: polygones[0] }
    : { type: "MultiPolygon", coordinates: polygones };
}

const pays = (feature) => ({
  iso3: feature.properties.ISO_A3_EH,
  iso2: feature.properties.ISO_A2_EH,
  name: { fr: feature.properties.NAME_FR, en: feature.properties.NAME },
  geometry: geometrie(feature.geometry),
});

const ne110 = lire(source110).features.filter((f) => f.properties.ISO_A3_EH !== "ATA");
const ne50 = lire(source50).features;

const delegations = fs
  .readdirSync(path.join(racine, "content/delegations"))
  .map((fichier) => lire(path.join(racine, "content/delegations", fichier)));

const sortie = ne110.map(pays);
const absents = [];
for (const delegation of delegations) {
  if (sortie.some((p) => p.iso3 === delegation.iso3)) continue;
  const complement = ne50.find((f) => f.properties.ISO_A3_EH === delegation.iso3);
  if (complement) sortie.push(pays(complement));
  else absents.push(delegation.slug);
}

fs.mkdirSync(path.join(racine, "content/geo"), { recursive: true });
fs.writeFileSync(
  path.join(racine, "content/geo/monde.json"),
  JSON.stringify({ source: "Natural Earth v5.1.2, Admin 0 – Countries (1:110m, Comores 1:50m)", pays: sortie }),
);

console.log(`${sortie.length} pays écrits dans content/geo/monde.json`);
if (absents.length) console.warn(`Sans géométrie : ${absents.join(", ")}`);
