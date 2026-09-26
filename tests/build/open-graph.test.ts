// Open Graph de chaque page du build : image absolue, existante, réellement 1200 × 630.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const APP = path.join(process.cwd(), ".next", "server", "app");
assert.ok(fs.existsSync(APP), "Aucun build trouvé dans .next/ : lancer `npm run test:seo`.");

function fichiersHtml(dossier: string): string[] {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const chemin = path.join(dossier, e.name);
    if (e.isDirectory()) return fichiersHtml(chemin);
    return e.name.endsWith(".html") ? [chemin] : [];
  });
}

function meta(html: string, propriete: string): string[] {
  const motif = new RegExp(`<meta (?:property|name)="${propriete.replaceAll(":", "\\:")}" content="([^"]*)"`, "g");
  return [...html.matchAll(motif)].map((m) => m[1]);
}

/** Dimensions lues dans l'en-tête IHDR du PNG. */
function dimensionsPng(fichier: string): { largeur: number; hauteur: number } {
  const octets = fs.readFileSync(fichier);
  assert.equal(octets.subarray(1, 4).toString("ascii"), "PNG", `${fichier} n'est pas un PNG`);
  return { largeur: octets.readUInt32BE(16), hauteur: octets.readUInt32BE(20) };
}

const ATTENDU = {
  fr: { locale: "fr_FR", alternate: "en_GB" },
  en: { locale: "en_GB", alternate: "fr_FR" },
} as const;

for (const locale of ["fr", "en"] as const) {
  const pages = [path.join(APP, `${locale}.html`), ...fichiersHtml(path.join(APP, locale))];

  describe(`Open Graph (${locale}, ${pages.length} pages)`, () => {
    for (const fichier of pages) {
      const html = fs.readFileSync(fichier, "utf-8");
      const nom = path.relative(APP, fichier);

      it(nom, () => {
        const canonique = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(html)?.[1] ?? "";
        const origine = new URL(canonique).origin;

        assert.deepEqual(meta(html, "og:url"), [canonique], "og:url = canonique");
        assert.deepEqual(meta(html, "og:locale"), [ATTENDU[locale].locale]);
        assert.deepEqual(meta(html, "og:locale:alternate"), [ATTENDU[locale].alternate]);
        assert.equal(meta(html, "og:title").length, 1);
        assert.deepEqual(meta(html, "twitter:card"), ["summary_large_image"]);

        const [image] = meta(html, "og:image");
        assert.ok(image, "og:image absente");
        const url = new URL(image);
        assert.equal(url.origin, origine, "og:image doit être absolue, sur le domaine du site");
        assert.deepEqual(meta(html, "og:image:width"), ["1200"]);
        assert.deepEqual(meta(html, "og:image:height"), ["630"]);
        assert.equal(meta(html, "og:image:alt").length, 1);

        const source = path.join(process.cwd(), "public", url.pathname);
        assert.ok(fs.existsSync(source), `${url.pathname} absente de public/`);
        assert.deepEqual(dimensionsPng(source), { largeur: 1200, hauteur: 630 });
      });
    }
  });
}
