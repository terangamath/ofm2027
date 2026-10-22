import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

/** Toutes les chaînes d'un fichier de messages, avec leur clé pointée. */
function chaines(valeur: unknown, cle = ""): [string, string][] {
  if (typeof valeur === "string") return [[cle, valeur]];
  if (valeur && typeof valeur === "object") {
    return Object.entries(valeur).flatMap(([k, v]) => chaines(v, cle ? `${cle}.${k}` : k));
  }
  return [];
}

function cles(valeur: unknown): string[] {
  return chaines(valeur).map(([cle]) => cle).sort();
}

const fr: unknown = JSON.parse(fs.readFileSync("messages/fr.json", "utf-8"));
const en: unknown = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"));

describe("messages", () => {
  it("parité fr / en : mêmes clés des deux côtés", () => {
    assert.deepEqual(cles(fr), cles(en));
  });

  // En ICU, une apostrophe droite devant `<` ou `{` ouvre une séquence
  // d'échappement : « l'<ofm>…</ofm> » s'afficherait balises comprises.
  // Écrire l'apostrophe typographique (’) à cet endroit.
  for (const [nom, messages] of [["fr", fr], ["en", en]] as const) {
    it(`${nom} : aucune apostrophe droite devant une balise ou une variable`, () => {
      const fautifs = chaines(messages).filter(([, texte]) => /'[<{]/.test(texte)).map(([cle]) => cle);
      assert.deepEqual(fautifs, []);
    });
  }
});
