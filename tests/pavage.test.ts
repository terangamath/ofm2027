import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COTE_FIGURE, ORIGINE_FIGURE, bandeTissee, hauteurRang, tuile } from "../lib/pavage.ts";
import { OMEGA_R } from "../lib/figure-geometrie.ts";

/** Points d'un chemin SVG fait de M/L/H (coordonnées absolues). */
function sommets(chemin: string): [number, number][] {
  const pts: [number, number][] = [];
  let y = 0;
  for (const [, cmd, args] of chemin.matchAll(/([MLH])([^MLHZ]*)/g)) {
    const v = args.trim().split(/[ ,]+/).map(Number);
    if (cmd === "H") pts.push([v[0], y]);
    else { pts.push([v[0], v[1]]); y = v[1]; }
  }
  return pts;
}
const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

describe("pavage triangulaire {3,6}", () => {
  it("la trame de la figure part de O, au côté R/10", () => {
    assert.equal(COTE_FIGURE, OMEGA_R / 10);
    assert.deepEqual(ORIGINE_FIGURE, { x: 300, y: 300 });
  });

  it("les triangles sont équilatéraux : la diagonale de la tuile mesure deux côtés", () => {
    const c = 20;
    const h = hauteurRang(c);
    // La diagonale de la tuile (c × 2h) traverse deux triangles : longueur 2c.
    assert.ok(Math.abs(Math.hypot(c, 2 * h) - 2 * c) < 1e-9);
    const t = tuile(c);
    assert.equal(t.largeur, c);
    assert.ok(Math.abs(t.hauteur - 2 * h) < 1e-3);
  });

  it("chaque losange de la bande a quatre côtés égaux au côté du pavage", () => {
    const c = 16;
    const b = bandeTissee(c);
    for (const chemin of [b.losangeA, b.losangeB]) {
      const p = sommets(chemin);
      assert.equal(p.length, 4);
      for (let i = 0; i < 4; i++) assert.ok(Math.abs(dist(p[i], p[(i + 1) % 4]) - c) < 1e-2);
    }
  });

  it("les losanges sont posés sur des nœuds du pavage", () => {
    const c = 16;
    const h = hauteurRang(c);
    // Pavage de la bande, décalé de c/2 : rangs pairs en x = c/2 + k·c,
    // rangs impairs en x = k·c.
    const estNoeud = ([x, y]: [number, number]) => {
      const rang = Math.round(y / h);
      if (Math.abs(rang * h - y) > 1e-2) return false;
      const reste = (x - (rang % 2 ? 0 : c / 2)) / c;
      return Math.abs(reste - Math.round(reste)) < 1e-3;
    };
    const b = bandeTissee(c);
    for (const p of [...sommets(b.losangeA), ...sommets(b.losangeB)]) assert.ok(estNoeud(p), `nœud attendu : ${p}`);
  });
});
