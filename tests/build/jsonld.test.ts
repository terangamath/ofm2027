// JSON-LD de l'accueil, lu dans le HTML du build : Event en ligne et Organization.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const APP = path.join(process.cwd(), ".next", "server", "app");
assert.ok(fs.existsSync(APP), "Aucun build trouvé dans .next/ : lancer `npm run test:seo`.");

interface Noeud {
  "@type": string;
  "@id"?: string;
  [cle: string]: unknown;
}

function graphe(locale: "fr" | "en"): { noeuds: Noeud[]; origine: string } {
  const html = fs.readFileSync(path.join(APP, `${locale}.html`), "utf-8");
  const blocs = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)];
  assert.equal(blocs.length, 1, `${locale} : ${blocs.length} blocs JSON-LD`);
  const data = JSON.parse(blocs[0][1]) as { "@context": string; "@graph": Noeud[] };
  assert.equal(data["@context"], "https://schema.org");
  const canonique = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(html)?.[1] ?? "";
  return { noeuds: data["@graph"], origine: new URL(canonique).origin };
}

for (const locale of ["fr", "en"] as const) {
  describe(`JSON-LD de l'accueil (${locale})`, () => {
    const { noeuds, origine } = graphe(locale);
    const evenement = noeuds.find((n) => n["@type"] === "Event");
    const organisation = noeuds.find((n) => n["@type"] === "Organization");

    it("Event : dates ISO 8601 à l'heure de Dakar, décalage explicite", () => {
      assert.ok(evenement);
      assert.equal(evenement.startDate, "2027-03-27T08:00:00+00:00");
      assert.match(String(evenement.endDate), /^2027-03-28T\d{2}:\d{2}:\d{2}\+00:00$/);
    });

    it("Event : entièrement en ligne, avec une VirtualLocation vers le site", () => {
      assert.ok(evenement);
      assert.equal(evenement.eventAttendanceMode, "https://schema.org/OnlineEventAttendanceMode");
      assert.equal(evenement.eventStatus, "https://schema.org/EventScheduled");
      const lieu = evenement.location as { "@type": string; url: string };
      assert.equal(lieu["@type"], "VirtualLocation");
      assert.equal(new URL(lieu.url).origin, origine);
      for (const image of evenement.image as string[]) {
        assert.equal(new URL(image).origin, origine);
        assert.ok(fs.existsSync(path.join(process.cwd(), "public", new URL(image).pathname)), `${image} absente`);
      }
    });

    it("Organization Terangamath, désignée comme organisatrice", () => {
      assert.ok(evenement && organisation);
      assert.equal(organisation.name, "Terangamath");
      assert.equal(organisation.url, "https://www.terangamath.org/");
      assert.deepEqual(evenement.organizer, { "@id": organisation["@id"] });
    });
  });
}
