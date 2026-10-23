import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";

interface Partenaire {
  id: string;
  name: { fr: string; en: string };
  status: string;
  logo: { src: string; width: number; height: number } | null;
}

const partenaires: Partenaire[] = JSON.parse(fs.readFileSync("content/partenaires.json", "utf-8"));

describe("partenaires", () => {
  it("identifiants uniques, nom en fr et en en (texte alternatif du logo)", () => {
    assert.equal(new Set(partenaires.map((p) => p.id)).size, partenaires.length);
    for (const p of partenaires) assert.ok(p.name.fr.trim() && p.name.en.trim(), p.id);
  });

  for (const p of partenaires.filter((x) => x.logo)) {
    it(`${p.id} : le logo existe, ses dimensions sont les vraies, il pèse au plus 50 Kio`, async () => {
      const chemin = `public${p.logo!.src}`;
      assert.ok(fs.existsSync(chemin), chemin);
      const meta = await sharp(chemin).metadata();
      assert.equal(meta.width, p.logo!.width);
      assert.equal(meta.height, p.logo!.height);
      assert.ok(fs.statSync(chemin).size <= 50 * 1024, `${chemin} : ${fs.statSync(chemin).size} o`);
    });
  }
});
