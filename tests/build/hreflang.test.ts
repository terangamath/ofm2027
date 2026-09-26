// Réciprocité hreflang et canoniques, vérifiées sur le HTML réellement produit
// par `next build` (.next/server/app), route par route, dans les deux langues.
// Lancer via `npm run test:seo`, qui construit le site avant chaque passage.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const APP = path.join(process.cwd(), ".next", "server", "app");
const LOCALES = ["fr", "en"] as const;
type Locale = (typeof LOCALES)[number];

interface Page {
  fichier: string;
  locale: Locale;
  /** URL publique attendue, déduite de l'emplacement du fichier. */
  url: string;
  canoniques: string[];
  alternates: Map<string, string[]>;
}

function attributs(balise: string): Record<string, string> {
  const resultat: Record<string, string> = {};
  for (const [, nom, valeur] of balise.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    resultat[nom.toLowerCase()] = valeur.replaceAll("&amp;", "&");
  }
  return resultat;
}

function fichiersHtml(dossier: string): string[] {
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((entree) => {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) return fichiersHtml(chemin);
    return entree.name.endsWith(".html") ? [chemin] : [];
  });
}

assert.ok(
  fs.existsSync(APP),
  "Aucun build trouvé dans .next/ : lancer `npm run test:seo` (il construit le site avant le test)."
);

const accueilFr = fs.readFileSync(path.join(APP, "fr.html"), "utf-8");
const canoniqueAccueil = [...accueilFr.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)].map((m) => attributs(m[0]).href);
const ORIGINE = new URL(canoniqueAccueil[0] ?? "invalide:").origin;

/** `.next/server/app/en/equipes/senegal.html` → `/equipes/senegal` ; `en.html` → `` (accueil). */
function routeDuFichier(fichier: string, locale: Locale): string {
  if (fichier === path.join(APP, `${locale}.html`)) return "";
  const relatif = path.relative(path.join(APP, locale), fichier).replace(/\.html$/, "");
  return `/${relatif.split(path.sep).join("/")}`;
}

function lirePage(fichier: string, locale: Locale): Page {
  const route = routeDuFichier(fichier, locale);
  const url = `${ORIGINE}${locale === "fr" ? "" : "/en"}${route}`;
  const html = fs.readFileSync(fichier, "utf-8");
  const canoniques: string[] = [];
  const alternates = new Map<string, string[]>();
  for (const [balise] of html.matchAll(/<link\b[^>]*>/g)) {
    const a = attributs(balise);
    if (a.rel === "canonical") canoniques.push(a.href);
    if (a.rel === "alternate" && a.hreflang) {
      alternates.set(a.hreflang, [...(alternates.get(a.hreflang) ?? []), a.href]);
    }
  }
  return { fichier: path.relative(process.cwd(), fichier), locale, url, canoniques, alternates };
}

const pages: Page[] = LOCALES.flatMap((locale) => [
  lirePage(path.join(APP, `${locale}.html`), locale),
  ...fichiersHtml(path.join(APP, locale)).map((fichier) => lirePage(fichier, locale)),
]);
const parUrl = new Map(pages.map((page) => [page.url, page]));

/** Seule valeur d'un hreflang ; échoue s'il est absent ou déclaré plusieurs fois. */
function alternate(page: Page, langue: string): string {
  const valeurs = page.alternates.get(langue) ?? [];
  assert.equal(valeurs.length, 1, `${page.url} : hreflang="${langue}" déclaré ${valeurs.length} fois`);
  return valeurs[0];
}

describe(`hreflang et canoniques (${pages.length} pages, origine ${ORIGINE})`, () => {
  it("le build contient les pages des deux langues, en nombre égal", () => {
    const fr = pages.filter((page) => page.locale === "fr").length;
    const en = pages.filter((page) => page.locale === "en").length;
    assert.ok(fr > 10, `seulement ${fr} pages françaises trouvées`);
    assert.equal(fr, en, `${fr} pages fr pour ${en} pages en`);
  });

  for (const page of pages) {
    describe(page.url, () => {
      it("déclare une seule canonique absolue, vers sa propre version linguistique", () => {
        assert.deepEqual(page.canoniques, [page.url], `${page.fichier}`);
      });

      it("déclare fr, en et x-default, x-default vers le français", () => {
        for (const langue of ["fr", "en", "x-default"]) {
          const href = alternate(page, langue);
          assert.equal(new URL(href).origin, ORIGINE, `${langue} : ${href} hors de ${ORIGINE}`);
          assert.ok(!new URL(href).pathname.startsWith("/fr"), `${langue} : ${href} porte le préfixe /fr`);
        }
        assert.equal(alternate(page, "x-default"), alternate(page, "fr"));
        assert.equal(alternate(page, page.locale), page.url, "l'alternate de sa propre langue doit être elle-même");
      });

      it("est réciproque : chaque alternate existe et la désigne en retour", () => {
        for (const langue of LOCALES) {
          const cible = parUrl.get(alternate(page, langue));
          assert.ok(cible, `${page.url} annonce ${langue} → ${alternate(page, langue)}, page absente du build`);
          assert.equal(
            alternate(cible, page.locale),
            page.url,
            `${page.url} annonce ${langue} → ${cible.url}, mais ${cible.url} annonce ${page.locale} → ${alternate(cible, page.locale)}`
          );
        }
      });
    });
  }

  it("le sitemap liste exactement ces pages, avec les mêmes hreflang", () => {
    const xml = fs.readFileSync(path.join(APP, "sitemap.xml.body"), "utf-8");
    const entrees = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, bloc]) => {
      const loc = /<loc>([^<]+)<\/loc>/.exec(bloc)?.[1] ?? "";
      const liens = [...bloc.matchAll(/<xhtml:link\b[^>]*>/g)].map(([b]) => attributs(b));
      return { loc, langues: Object.fromEntries(liens.map((a) => [a.hreflang, a.href])) };
    });

    assert.deepEqual(
      entrees.map((e) => e.loc).sort(),
      pages.map((p) => p.url).sort(),
      "sitemap et pages construites divergent"
    );
    for (const { loc, langues } of entrees) {
      const page = parUrl.get(loc);
      assert.ok(page);
      for (const langue of ["fr", "en", "x-default"]) {
        assert.equal(langues[langue], alternate(page, langue), `sitemap, ${loc}, hreflang ${langue}`);
      }
    }
    assert.ok(!xml.includes("<lastmod>"), "lastmod présent : aucune source de date fiable");
  });
});
