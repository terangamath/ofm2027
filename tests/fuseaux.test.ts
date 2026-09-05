import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  dateLocale,
  decalageMinutes,
  etatEpreuve,
  heureLocale,
  instantDepuisHeureMurale,
  libelleDecalage,
  tempsRestant,
} from "../lib/fuseaux.ts";

/** Les quatorze délégations de l'OFM 2027 et leur fuseau IANA. */
const ZONES: Record<string, string> = {
  senegal: "Africa/Dakar",
  "burkina-faso": "Africa/Ouagadougou",
  "cote-divoire": "Africa/Abidjan",
  algerie: "Africa/Algiers",
  cameroun: "Africa/Douala",
  congo: "Africa/Brazzaville",
  maroc: "Africa/Casablanca",
  niger: "Africa/Niamey",
  tunisie: "Africa/Tunis",
  belgique: "Europe/Brussels",
  france: "Europe/Paris",
  suisse: "Europe/Zurich",
  comores: "Indian/Comoro",
  djibouti: "Africa/Djibouti",
};

/** Instant de référence : 09:00 heure de Paris le 27 mars 2027 (règlement, art. 5.8) = 08:00 UTC = 08:00 à Dakar. */
const DEBUT = new Date("2027-03-27T08:00:00Z");
const FIN = new Date("2027-03-27T12:30:00Z");
const LENDEMAIN = new Date("2027-03-28T08:00:00Z");

describe("changement d'heure du 28 mars 2027 (entre l'épreuve et la correction)", () => {
  for (const zone of ["Europe/Paris", "Europe/Brussels", "Europe/Zurich"]) {
    it(`${zone} : +60 min le 27 mars, +120 min le 28 mars`, () => {
      assert.equal(decalageMinutes(zone, DEBUT), 60);
      assert.equal(decalageMinutes(zone, LENDEMAIN), 120);
    });
    it(`${zone} : 09:00 mural vaut 08:00 UTC le 27 et 07:00 UTC le 28`, () => {
      assert.equal(instantDepuisHeureMurale(zone, "2027-03-27", "09:00").toISOString(), "2027-03-27T08:00:00.000Z");
      assert.equal(instantDepuisHeureMurale(zone, "2027-03-28", "09:00").toISOString(), "2027-03-28T07:00:00.000Z");
    });
    it(`${zone} : le même instant UTC se lit 09:00 le 27 et 10:00 le 28`, () => {
      assert.equal(heureLocale(zone, DEBUT), "09:00");
      assert.equal(heureLocale(zone, LENDEMAIN), "10:00");
    });
  }

  it("l'heure inexistante de la nuit du changement est résolue sans erreur", () => {
    // 02:30 n'existe pas à Paris le 28 mars 2027 : on obtient un instant valide.
    const instant = instantDepuisHeureMurale("Europe/Paris", "2027-03-28", "02:30");
    assert.ok(!Number.isNaN(instant.getTime()));
  });
});

describe("Maroc : heure du ramadan puis retour à UTC+1", () => {
  it("Casablanca est à +0 début mars 2027 et à +60 le 27 mars", () => {
    assert.equal(decalageMinutes("Africa/Casablanca", new Date("2027-03-01T08:00:00Z")), 0);
    assert.equal(decalageMinutes("Africa/Casablanca", DEBUT), 60);
  });
});

describe("les onze autres fuseaux ne bougent pas entre les deux jours", () => {
  const stables = Object.entries(ZONES).filter(([, z]) => !z.startsWith("Europe/"));
  for (const [pays, zone] of stables) {
    it(`${pays} (${zone})`, () => {
      assert.equal(decalageMinutes(zone, DEBUT), decalageMinutes(zone, LENDEMAIN));
    });
  }
});

describe("heures locales de début d'épreuve, 08:00 à Dakar", () => {
  const attendu: Record<string, string> = {
    senegal: "08:00",
    "burkina-faso": "08:00",
    "cote-divoire": "08:00",
    algerie: "09:00",
    cameroun: "09:00",
    congo: "09:00",
    maroc: "09:00",
    niger: "09:00",
    tunisie: "09:00",
    belgique: "09:00",
    france: "09:00",
    suisse: "09:00",
    comores: "11:00",
    djibouti: "11:00",
  };
  for (const [pays, zone] of Object.entries(ZONES)) {
    it(`${pays} : ${attendu[pays]}`, () => {
      assert.equal(heureLocale(zone, DEBUT), attendu[pays]);
      assert.equal(dateLocale(zone, DEBUT), "2027-03-27");
    });
  }
  it("la référence est bien Dakar : 09:00 Paris = 08:00 Dakar", () => {
    assert.equal(instantDepuisHeureMurale("Africa/Dakar", "2027-03-27", "08:00").toISOString(), DEBUT.toISOString());
  });
});

describe("décalages, états et compte à rebours", () => {
  it("libellés de décalage", () => {
    assert.equal(libelleDecalage(0), "0");
    assert.equal(libelleDecalage(60), "+1");
    assert.equal(libelleDecalage(180), "+3");
    assert.equal(libelleDecalage(330), "+5:30");
    assert.equal(libelleDecalage(-240), "−4");
  });
  it("état de l'épreuve", () => {
    assert.equal(etatEpreuve(new Date("2026-09-05T12:00:00Z"), DEBUT, FIN), "avant");
    assert.equal(etatEpreuve(new Date("2027-03-27T07:59:59Z"), DEBUT, FIN), "avant");
    assert.equal(etatEpreuve(DEBUT, DEBUT, FIN), "pendant");
    assert.equal(etatEpreuve(new Date("2027-03-27T12:29:59Z"), DEBUT, FIN), "pendant");
    assert.equal(etatEpreuve(FIN, DEBUT, FIN), "apres");
  });
  it("temps restant, jamais négatif", () => {
    assert.deepEqual(tempsRestant(new Date("2027-03-26T07:58:30Z"), DEBUT), { jours: 1, heures: 0, minutes: 1, secondes: 30 });
    assert.deepEqual(tempsRestant(FIN, DEBUT), { jours: 0, heures: 0, minutes: 0, secondes: 0 });
  });
});
