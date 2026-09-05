import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  composerContenu,
  composerFrancais,
  composerMessages,
  sansVeuve,
} from "../lib/typographie.ts";

const FINE = " ";
const NBSP = " ";

describe("composerFrancais — règles", () => {
  it("apostrophe typographique entre deux lettres", () => {
    assert.equal(composerFrancais("L'Olympiade qu'en d'un"), "L’Olympiade qu’en d’un");
  });

  it("guillemets français avec fine insécable", () => {
    assert.equal(composerFrancais('la "Teranga" sénégalaise'), `la «${FINE}Teranga${FINE}» sénégalaise`);
    assert.equal(composerFrancais("« Teranga »"), `«${FINE}Teranga${FINE}»`);
  });

  it("fine insécable avant ; : ! ?", () => {
    assert.equal(composerFrancais("Qui peut participer ?"), `Qui peut participer${FINE}?`);
    assert.equal(composerFrancais("Contact!"), `Contact${FINE}!`);
    assert.equal(composerFrancais("Dates : 27 mars"), `Dates${FINE}: 27${NBSP}mars`);
    assert.equal(composerFrancais("oui ; non"), `oui${FINE}; non`);
  });

  it("le deux-points d'une heure reste collé", () => {
    const out = composerFrancais("à 09:00 heure de Dakar : début");
    assert.ok(out.startsWith("à 09:00"));
    assert.equal(out, `à 09:00${NBSP}heure de Dakar${FINE}: début`);
    assert.equal(composerFrancais("12:30"), "12:30");
  });

  it("insécables dans OFM 2027, les dates et les nombres suivis d'une unité", () => {
    assert.equal(composerFrancais("OFM 2027"), `OFM${NBSP}2027`);
    assert.equal(composerFrancais("27-28 mars 2027"), `27‑28${NBSP}mars${NBSP}2027`);
    assert.equal(composerFrancais("14 pays participants"), `14${NBSP}pays participants`);
    assert.equal(composerFrancais("Jusqu'à {count} élèves"), `Jusqu’à {count}${NBSP}élèves`);
    assert.equal(composerFrancais("en 2020"), `en${NBSP}2020`);
  });

  it("ne double pas la fine entre deux ponctuations", () => {
    assert.equal(composerFrancais("Vraiment ?!"), `Vraiment${FINE}?!`);
  });
});

describe("composerFrancais — exclusions", () => {
  it("laisse intact le contenu mathématique inline $…$", () => {
    const src = "Soit $f : \\mathbb{R} \\to \\mathbb{R}$ telle que $f(x) = x'$ ; montrer que";
    const out = composerFrancais(src);
    assert.ok(out.includes("$f : \\mathbb{R} \\to \\mathbb{R}$"));
    assert.ok(out.includes("$f(x) = x'$"));
    assert.ok(out.endsWith(`$${FINE}; montrer que`));
  });

  it("laisse intact un bloc $$…$$ multiligne", () => {
    const bloc = "$$\n\\sum_{k=1}^{n} k^2 : \"carré\" ; n!\n$$";
    assert.equal(composerFrancais(`Ainsi : ${bloc} donc`), `Ainsi${FINE}: ${bloc} donc`);
  });

  it("laisse intacts les délimiteurs \\( \\) et \\[ \\]", () => {
    const a = "\\(a'b : c\\)";
    const b = "\\[x^2 ; y!\\]";
    assert.equal(composerFrancais(`${a} et ${b}`), `${a} et ${b}`);
  });

  it("laisse intact le code entre accents graves", () => {
    assert.equal(composerFrancais("la clé `Home.Hero:title` !"), `la clé \`Home.Hero:title\`${FINE}!`);
  });

  it("laisse intactes les adresses", () => {
    assert.equal(composerFrancais("contact@terangamath.org"), "contact@terangamath.org");
    assert.equal(
      composerFrancais("voir https://www.terangamath.org/?q=1 !"),
      `voir https://www.terangamath.org/?q=1${FINE}!`
    );
  });

  it("chaîne vide et texte sans règle applicable", () => {
    assert.equal(composerFrancais(""), "");
    assert.equal(composerFrancais("Terangamath"), "Terangamath");
  });
});

describe("sansVeuve", () => {
  it("insécable avant le dernier mot dès trois mots", () => {
    assert.equal(sansVeuve("Deux catégories, une même exigence"), `Deux catégories, une même${NBSP}exigence`);
    assert.equal(sansVeuve("Foire aux questions"), `Foire aux${NBSP}questions`);
  });
  it("laisse un bloc final trop long, qui déborderait sur mobile", () => {
    assert.equal(sansVeuve("L'Olympiade Francophone de Mathématiques"), "L'Olympiade Francophone de Mathématiques");
  });
  it("laisse les titres courts", () => {
    assert.equal(sansVeuve("Galerie"), "Galerie");
    assert.equal(sansVeuve("Mentions légales"), "Mentions légales");
  });
});

describe("composerContenu / composerMessages", () => {
  it("ne compose que les valeurs sous une clé fr", () => {
    const src = {
      name: { fr: "Côte d'Ivoire", en: "Ivory Coast's" },
      path: "/archives/2024/ofm-2024-junior-sujet.pdf",
      dates: { fr: "27-28 mars 2027", en: "27-28 March 2027" },
      nested: [{ fr: "Qui ?", en: "Who?" }],
      count: 14,
    };
    const out = composerContenu(src);
    assert.equal(out.name.fr, "Côte d’Ivoire");
    assert.equal(out.name.en, "Ivory Coast's");
    assert.equal(out.path, src.path);
    assert.equal(out.dates.en, "27-28 March 2027");
    assert.equal(out.nested[0].fr, `Qui${FINE}?`);
    assert.equal(out.count, 14);
  });

  it("compose toutes les chaînes des messages, en préservant les variables ICU", () => {
    const out = composerMessages({ Footer: { rights: "© {year} Terangamath. Tous droits réservés." }, Contact: { emailValue: "contact@terangamath.org" } });
    assert.equal(out.Footer.rights, "© {year} Terangamath. Tous droits réservés.");
    assert.equal(out.Contact.emailValue, "contact@terangamath.org");
  });
});
