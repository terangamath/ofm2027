import { describe, it } from "node:test";
import assert from "node:assert/strict";

// lib/site.ts valide la variable dès son chargement : on la fixe avant l'import.
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
const { resoudreUrlSite, estIndexable, URL_PRODUCTION } = await import("../lib/site.ts");
const { reglesRobots, enTetesHttp } = await import("../lib/indexation.ts");

const HORS_PRODUCTION = [
  "https://ofm2027.org", // apex : redirige vers www, ne doit pas être indexé
  "https://ofm2027-git-chore-pre-deploiement-eds-fb.vercel.app",
  "https://preprod.ofm2027.org",
  "http://localhost:3000",
];

describe("resoudreUrlSite", () => {
  it("normalise : barre oblique finale retirée, casse de l'hôte abaissée", () => {
    assert.equal(resoudreUrlSite({ NEXT_PUBLIC_SITE_URL: "https://www.ofm2027.org/" }), URL_PRODUCTION);
    assert.equal(resoudreUrlSite({ NEXT_PUBLIC_SITE_URL: " https://WWW.ofm2027.org " }), URL_PRODUCTION);
  });

  it("utilise VERCEL_URL sur une prévisualisation Vercel sans variable déclarée", () => {
    assert.equal(
      resoudreUrlSite({ VERCEL_ENV: "preview", VERCEL_URL: "ofm2027-abc123.vercel.app" }),
      "https://ofm2027-abc123.vercel.app"
    );
  });

  it("la variable déclarée l'emporte sur VERCEL_URL", () => {
    assert.equal(
      resoudreUrlSite({ NEXT_PUBLIC_SITE_URL: URL_PRODUCTION, VERCEL_ENV: "preview", VERCEL_URL: "x.vercel.app" }),
      URL_PRODUCTION
    );
  });

  it("accepte http pour le développement local uniquement", () => {
    assert.equal(resoudreUrlSite({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" }), "http://localhost:3000");
    assert.equal(resoudreUrlSite({ NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000" }), "http://127.0.0.1:3000");
  });

  const invalides: [string, Record<string, string>, RegExp][] = [
    ["absente", {}, /variable absente/],
    ["vide", { NEXT_PUBLIC_SITE_URL: "  " }, /variable absente/],
    ["absente en production Vercel", { VERCEL_ENV: "production", VERCEL_URL: "x.vercel.app" }, /variable absente/],
    ["relative", { NEXT_PUBLIC_SITE_URL: "www.ofm2027.org" }, /pas une URL absolue/],
    ["http hors local", { NEXT_PUBLIC_SITE_URL: "http://www.ofm2027.org" }, /https obligatoire/],
    ["autre schéma", { NEXT_PUBLIC_SITE_URL: "ftp://www.ofm2027.org" }, /schéma ftp: non pris en charge/],
    ["avec un chemin", { NEXT_PUBLIC_SITE_URL: "https://www.ofm2027.org/fr" }, /origine seule/],
    ["avec un paramètre", { NEXT_PUBLIC_SITE_URL: "https://www.ofm2027.org/?a=1" }, /origine seule/],
  ];
  for (const [cas, env, message] of invalides) {
    it(`échoue avec un message explicite : ${cas}`, () => {
      assert.throws(() => resoudreUrlSite(env), message);
    });
  }
});

describe("indexation : production indexable", () => {
  it("seule l'URL de production est indexable", () => {
    assert.equal(estIndexable(URL_PRODUCTION), true);
  });

  it("robots.txt autorise tout et annonce le sitemap absolu", () => {
    assert.deepEqual(reglesRobots(URL_PRODUCTION), {
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://www.ofm2027.org/sitemap.xml",
    });
  });

  it("aucun en-tête X-Robots-Tag", () => {
    assert.ok(!enTetesHttp(URL_PRODUCTION).some((e) => e.key === "X-Robots-Tag"));
  });
});

describe("indexation : l'URL de production hors de l'environnement Production de Vercel", () => {
  for (const environnement of ["preview", "development"]) {
    it(`VERCEL_ENV=${environnement} : non indexable`, () => {
      assert.equal(estIndexable(URL_PRODUCTION, environnement), false);
      assert.deepEqual(reglesRobots(URL_PRODUCTION, environnement), { rules: { userAgent: "*", disallow: "/" } });
      assert.ok(enTetesHttp(URL_PRODUCTION, environnement).some((e) => e.key === "X-Robots-Tag"));
    });
  }

  it("VERCEL_ENV=production : indexable", () => {
    assert.equal(estIndexable(URL_PRODUCTION, "production"), true);
  });
});

describe("indexation : tout le reste non indexable", () => {
  for (const url of HORS_PRODUCTION) {
    it(url, () => {
      assert.equal(estIndexable(url), false);
      assert.equal(estIndexable(url, "production"), false);
      assert.deepEqual(reglesRobots(url), { rules: { userAgent: "*", disallow: "/" } });
      assert.deepEqual(
        enTetesHttp(url).find((e) => e.key === "X-Robots-Tag"),
        { key: "X-Robots-Tag", value: "noindex, nofollow" }
      );
    });
  }
});

describe("en-têtes de sécurité, dans tous les environnements", () => {
  for (const url of [URL_PRODUCTION, ...HORS_PRODUCTION]) {
    it(url, () => {
      const cles = enTetesHttp(url).map((e) => e.key);
      for (const cle of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options"]) {
        assert.ok(cles.includes(cle), `${cle} manquant`);
      }
    });
  }
});
