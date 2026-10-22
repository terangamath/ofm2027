import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EMBOITEMENT, bandeau, hauteurRang, maille } from "../lib/pavage.ts";
import { COMPAS, P } from "../lib/figure-geometrie.ts";

type Pt = [number, number];

/** Polygones d'un chemin SVG fait de M/L/Z (coordonnées absolues). */
function polygones(chemin: string): Pt[][] {
  return chemin
    .split("Z")
    .filter(Boolean)
    .map((p) =>
      p
        .replace(/^M/, "")
        .split("L")
        .map((xy) => xy.trim().split(/\s+/).map(Number) as Pt),
    );
}
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const proche = (a: number, b: number, tol = 0.02) => Math.abs(a - b) < tol;

describe("bandeau tissé, pavage triangulaire {3,6}", () => {
  const c = 16;
  const h = hauteurRang(c);
  const b = bandeau(c);
  const axe = b.largeur / 2;

  it("dimensions : colonne c et liserés, période de deux losanges (4h)", () => {
    assert.ok(proche(b.largeur, c * 1.375));
    assert.ok(proche(b.periode, 4 * h));
  });

  it("chaque grand losange a quatre côtés égaux au côté du pavage", () => {
    const losanges = polygones(b.vert).filter((p) => p.length === 4 && proche(p[0][0], axe));
    assert.equal(losanges.length, 2);
    for (const p of losanges) for (let i = 0; i < 4; i++) assert.ok(proche(dist(p[i], p[(i + 1) % 4]), c));
  });

  it("les losanges s'empilent pointe contre pointe sur l'axe", () => {
    const pointes = polygones(b.vert)
      .filter((p) => proche(p[0][0], axe))
      .flatMap((p) => [p[0][1], p[2][1]]);
    assert.deepEqual(
      pointes.map((v) => Math.round(v / h)),
      [0, 2, 2, 4],
    );
  });

  it("les losanges emboîtés sont des homothéties de même centre", () => {
    const [grand] = polygones(b.vert).filter((p) => proche(p[0][0], axe));
    const [jaune] = polygones(b.jaune).filter((p) => p.length === 4);
    const [rouge] = polygones(b.rouge).filter((p) => p.length === 4);
    for (const [petit, k] of [[jaune, EMBOITEMENT.jaune], [rouge, EMBOITEMENT.rouge]] as const) {
      assert.ok(proche(dist(petit[0], petit[2]), k * dist(grand[0], grand[2])));
      assert.ok(proche((petit[0][1] + petit[2][1]) / 2, (grand[0][1] + grand[2][1]) / 2));
    }
  });

  it("frise p2mm : chaque couleur est symétrique par rapport à l'axe", () => {
    for (const chemin of [b.vert, b.jaune, b.rouge]) {
      const sommets = polygones(chemin).flat();
      for (const [u, v] of sommets) {
        assert.ok(
          sommets.some(([u2, v2]) => proche(u2, b.largeur - u) && proche(v2, v)),
          `miroir manquant pour ${u} ${v}`,
        );
      }
    }
  });

  it("la bande couchée est la même géométrie, axes échangés", () => {
    const couche = bandeau(c, true);
    const debout = polygones(b.vert).flat();
    const echange = polygones(couche.vert).flat().map(([x, y]) => [y, x] as Pt);
    assert.deepEqual(echange, debout);
  });

  it("la maille du logo est le losange du bandeau", () => {
    const m = maille(c);
    const [p] = polygones(m.vert);
    for (let i = 0; i < 4; i++) assert.ok(proche(dist(p[i], p[(i + 1) % 4]), c));
    assert.ok(proche(m.hauteur, 2 * h));
  });
});

describe("construction au compas de O", () => {
  for (const [nom, [p, q]] of [["AB", [P.A, P.B]], ["AC", [P.A, P.C]]] as const) {
    const m = COMPAS[nom];
    it(`médiatrice de [${nom}] : X est à égale distance des extrémités, sur le rayon des arcs`, () => {
      const dp = Math.hypot(m.X.x - p.x, m.X.y - p.y);
      const dq = Math.hypot(m.X.x - q.x, m.X.y - q.y);
      assert.ok(Math.abs(dp - m.rayon) < 0.2 && Math.abs(dq - m.rayon) < 0.2);
    });
    it(`médiatrice de [${nom}] : la droite tracée passe par O`, () => {
      const [x1, y1, x2, y2] = m.mediatrice.replace(/[ML]/g, " ").trim().split(/\s+/).map(Number);
      const croix = (x2 - x1) * (P.O.y - y1) - (y2 - y1) * (P.O.x - x1);
      assert.ok(Math.abs(croix) / Math.hypot(x2 - x1, y2 - y1) < 0.5);
    });
    it(`médiatrice de [${nom}] : la pointe du compas est hors de ω`, () => {
      assert.ok(Math.hypot(m.X.x - P.O.x, m.X.y - P.O.y) > 250);
    });
  }
});
