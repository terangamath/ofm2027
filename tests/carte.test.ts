import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

interface Fiche {
  slug: string;
  countryCode: string;
  iso3: string;
}

const dossier = "content/delegations";
const fiches: Fiche[] = fs
  .readdirSync(dossier)
  .map((fichier) => JSON.parse(fs.readFileSync(path.join(dossier, fichier), "utf-8")) as Fiche);
const monde = JSON.parse(fs.readFileSync("content/geo/monde.json", "utf-8")) as {
  pays: { iso3: string; iso2: string }[];
};

describe("carte des pays participants", () => {
  for (const fiche of fiches) {
    it(`${fiche.slug} : ${fiche.iso3} a une géométrie, de code alpha-2 ${fiche.countryCode}`, () => {
      const pays = monde.pays.find((p) => p.iso3 === fiche.iso3);
      assert.ok(pays, `${fiche.iso3} absent de content/geo/monde.json`);
      assert.equal(pays.iso2, fiche.countryCode);
    });
  }

  it("les deux Congo restent distincts", () => {
    assert.equal(fiches.find((f) => f.slug === "congo")?.iso3, "COG");
    assert.ok(monde.pays.some((p) => p.iso3 === "COD"));
  });
});
