// Indexation vérifiée sur le build réel : robots.txt, balise meta robots de chaque
// page et en-têtes déclarés. `npm run test:seo` construit deux fois (préproduction
// puis production) : les deux sens sont donc couverts à chaque passage.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const NEXT = path.join(process.cwd(), ".next");
const APP = path.join(NEXT, "server", "app");
const PRODUCTION = "https://www.ofm2027.org";

assert.ok(fs.existsSync(APP), "Aucun build trouvé dans .next/ : lancer `npm run test:seo`.");

const canonique = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(
  fs.readFileSync(path.join(APP, "fr.html"), "utf-8")
)?.[1];
const ORIGINE = new URL(canonique ?? "invalide:").origin;
const PROD = ORIGINE === PRODUCTION;

function fichiersHtml(dossier: string): string[] {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const chemin = path.join(dossier, e.name);
    if (e.isDirectory()) return fichiersHtml(chemin);
    return e.name.endsWith(".html") ? [chemin] : [];
  });
}

/** Toutes les pages des deux langues : `fr.html`, `fr/**.html`, `en.html`, `en/**.html`. */
function pages(): string[] {
  return ["fr", "en"].flatMap((locale) => [path.join(APP, `${locale}.html`), ...fichiersHtml(path.join(APP, locale))]);
}

const robots = fs.readFileSync(path.join(APP, "robots.txt.body"), "utf-8");
const manifeste = JSON.parse(fs.readFileSync(path.join(NEXT, "routes-manifest.json"), "utf-8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const enTetes = manifeste.headers.flatMap((regle) => regle.headers);
const xRobots = enTetes.find((e) => e.key.toLowerCase() === "x-robots-tag");

describe(`indexation du build ${ORIGINE} (${PROD ? "production : indexable" : "hors production : non indexable"})`, () => {
  const html = pages();

  it("le build contient des pages", () => {
    assert.ok(html.length > 20, `${html.length} pages`);
  });

  if (PROD) {
    it("robots.txt autorise l'indexation et annonce le sitemap absolu", () => {
      assert.match(robots, /^Allow: \/$/m);
      assert.doesNotMatch(robots, /^Disallow/m);
      assert.match(robots, new RegExp(`^Sitemap: ${PRODUCTION}/sitemap\\.xml$`, "m"));
    });

    it("aucune page ne porte de balise meta robots noindex", () => {
      for (const fichier of html) {
        assert.doesNotMatch(fs.readFileSync(fichier, "utf-8"), /<meta name="robots"[^>]*noindex/, fichier);
      }
    });

    it("aucun en-tête X-Robots-Tag", () => {
      assert.equal(xRobots, undefined);
    });
  } else {
    it("robots.txt interdit tout et n'annonce pas de sitemap", () => {
      assert.match(robots, /^Disallow: \/$/m);
      assert.doesNotMatch(robots, /^Allow/m);
      assert.doesNotMatch(robots, /^Sitemap/m);
    });

    it("chaque page porte <meta name=\"robots\" content=\"noindex, nofollow\">", () => {
      for (const fichier of html) {
        assert.match(
          fs.readFileSync(fichier, "utf-8"),
          /<meta name="robots" content="noindex, nofollow"\/>/,
          path.relative(process.cwd(), fichier)
        );
      }
    });

    it("l'en-tête X-Robots-Tag: noindex, nofollow s'applique à toutes les routes", () => {
      assert.equal(xRobots?.value, "noindex, nofollow");
      const regle = manifeste.headers.find((r) => r.headers.some((e) => e.key === "X-Robots-Tag"));
      assert.equal(regle?.source, "/:path*");
    });
  }

  it("en-têtes de sécurité déclarés", () => {
    const cles = enTetes.map((e) => e.key);
    for (const cle of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options"]) {
      assert.ok(cles.includes(cle), `${cle} manquant`);
    }
  });
});
