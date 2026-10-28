import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DelegationMember } from "../content/types.ts";
import { composerEquipe } from "../lib/equipes.ts";

const membre = (name: string, category: DelegationMember["category"], position: DelegationMember["position"]): DelegationMember => ({
  name,
  category,
  position,
});

describe("composition des équipes d'une délégation", () => {
  it("sans membre publié : 6 participants et 2 encadrants à confirmer", () => {
    const equipe = composerEquipe(null, "junior");
    assert.deepEqual(equipe.participants, Array(6).fill(null));
    assert.deepEqual(equipe.encadrants, Array(2).fill(null));
  });

  it("les membres publiés viennent d'abord, les places restantes restent à confirmer", () => {
    const equipe = composerEquipe([membre("A", "junior", "participant"), membre("B", "junior", "leader")], "junior");
    assert.equal(equipe.participants[0]?.name, "A");
    assert.deepEqual(equipe.participants.slice(1), Array(5).fill(null));
    assert.equal(equipe.encadrants[0]?.name, "B");
    assert.equal(equipe.encadrants[1], null);
  });

  it("chaque équipe ne reçoit que ses membres", () => {
    const membres = [membre("J", "junior", "participant"), membre("S", "senior", "participant")];
    assert.deepEqual(composerEquipe(membres, "senior").participants.filter(Boolean).map((m) => m?.name), ["S"]);
  });

  it("au-delà des places par défaut, tous les membres publiés sont conservés", () => {
    const sept = Array.from({ length: 7 }, (_, i) => membre(`P${i}`, "senior", "participant"));
    const trois = Array.from({ length: 3 }, (_, i) => membre(`E${i}`, "senior", "leader"));
    const equipe = composerEquipe([...sept, ...trois], "senior");
    assert.equal(equipe.participants.length, 7);
    assert.equal(equipe.encadrants.length, 3);
    assert.ok(equipe.participants.every(Boolean) && equipe.encadrants.every(Boolean));
  });
});
