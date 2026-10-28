import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import type { Classements, LigneResultat, ResultatsOfficiels } from "../content/types.ts";
import { filtrerResultats, normaliser, paginer, paysPresents } from "../lib/resultats.ts";

const ligne = (name: string, countryCode: string, rank = 1): LigneResultat => ({
  rank,
  award: null,
  name,
  countryCode,
  scores: [0, 0, 0, 0],
  total: 0,
});

const lignes = [ligne("Élodie Diop", "SN"), ligne("Marc Dubois", "FR", 2), ligne("Awa Ndiaye", "SN", 2), ligne("Léa Martin", "BE", 4)];

describe("filtres du classement", () => {
  it("recherche sans casse ni accents", () => {
    assert.equal(normaliser("  ÉLODIE "), "elodie");
    assert.deepEqual(filtrerResultats(lignes, { recherche: "elo", pays: "" }).map((l) => l.name), ["Élodie Diop"]);
    assert.deepEqual(filtrerResultats(lignes, { recherche: "LÉA", pays: "" }).map((l) => l.name), ["Léa Martin"]);
  });

  it("filtre par pays, combiné à la recherche", () => {
    assert.equal(filtrerResultats(lignes, { recherche: "", pays: "SN" }).length, 2);
    assert.deepEqual(filtrerResultats(lignes, { recherche: "awa", pays: "SN" }).map((l) => l.name), ["Awa Ndiaye"]);
    assert.deepEqual(filtrerResultats(lignes, { recherche: "awa", pays: "FR" }), []);
  });

  it("garde l'ordre et les rangs des données", () => {
    assert.deepEqual(filtrerResultats(lignes, { recherche: "", pays: "" }).map((l) => l.rank), [1, 2, 2, 4]);
  });

  it("pagination : page ramenée dans les bornes, une page vide si rien ne correspond", () => {
    const vingt = Array.from({ length: 23 }, (_, i) => ligne(`P${i}`, "SN", i + 1));
    assert.deepEqual([paginer(vingt, 1).lignes.length, paginer(vingt, 3).lignes.length, paginer(vingt, 3).pages], [10, 3, 3]);
    assert.equal(paginer(vingt, 9).page, 3);
    assert.deepEqual(paginer([], 2), { lignes: [], page: 1, pages: 1 });
  });

  it("liste des pays sans doublon", () => {
    assert.deepEqual(paysPresents(lignes, [ligne("X", "CA")]), ["SN", "FR", "BE", "CA"]);
  });
});

describe("fichiers de résultats", () => {
  const officiels: ResultatsOfficiels = JSON.parse(fs.readFileSync("content/resultats.json", "utf-8"));
  const fictifs: Classements = JSON.parse(fs.readFileSync("content/apercu/resultats-fictifs.json", "utf-8"));
  const drapeaux = new Set(fs.readdirSync("public/flags").map((f) => f.replace(".svg", "").toUpperCase()));

  for (const [nom, classements] of [["officiels", officiels], ["fictifs", fictifs]] as const) {
    for (const categorie of ["junior", "senior"] as const) {
      it(`${nom} ${categorie} : total = somme des points, rangs cohérents avec les ex æquo, drapeau présent`, () => {
        const liste = classements[categorie];
        liste.forEach((l, i) => {
          assert.equal(l.total, l.scores.reduce((a, b) => a + b, 0), l.name);
          assert.ok(drapeaux.has(l.countryCode), `${l.name} : pas de drapeau ${l.countryCode}`);
          if (i > 0) {
            const precedent = liste[i - 1];
            assert.ok(l.total <= precedent.total, `${l.name} : classement non trié`);
            assert.equal(l.rank, l.total === precedent.total ? precedent.rank : i + 1, `${l.name} : rang`);
          }
        });
      });
    }
  }

  it("les données fictives sont signalées comme telles", () => {
    for (const l of [...fictifs.junior, ...fictifs.senior]) assert.match(l.name, /fictif/);
  });
});
