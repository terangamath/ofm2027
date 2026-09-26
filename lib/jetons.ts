// Palette lue dans app/globals.css (premier bloc :root), pour les rares sorties
// qui ne passent pas par le CSS : manifeste web et images générées
// (scripts/images-marque.mjs). Évite de recopier une valeur hex hors de globals.css.
import fs from "node:fs";
import path from "node:path";

export type Jeton = "vert-nuit" | "vert" | "or" | "or-clair" | "ivoire" | "sable";

export function lireJetons(racine: string = process.cwd()): Record<Jeton, string> {
  const css = fs.readFileSync(path.join(racine, "app", "globals.css"), "utf-8");
  const debut = css.indexOf(":root");
  const bloc = css.slice(debut, css.indexOf("}", debut));
  const valeurs = new Map([...bloc.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].map((m) => [m[1], m[2]]));
  const lire = (nom: Jeton) => {
    const valeur = valeurs.get(nom);
    if (!valeur) throw new Error(`Jeton --${nom} introuvable dans app/globals.css`);
    return valeur;
  };
  return {
    "vert-nuit": lire("vert-nuit"),
    vert: lire("vert"),
    or: lire("or"),
    "or-clair": lire("or-clair"),
    ivoire: lire("ivoire"),
    sable: lire("sable"),
  };
}
