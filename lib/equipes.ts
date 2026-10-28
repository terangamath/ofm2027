// Composition des équipes d'une délégation, pour sa fiche (/equipes/[pays]).
import type { DelegationMember } from "@/content/types";

/** Places affichées par défaut dans chaque équipe ; une délégation qui publie plus de membres les voit tous. */
export const PLACES = { participant: 6, leader: 2 } as const;

/** Une place : un membre publié, ou `null` tant qu'il n'est pas connu (« À confirmer »). */
export type Place = DelegationMember | null;

export interface Equipe {
  participants: Place[];
  encadrants: Place[];
}

/** Les membres publiés d'une position, complétés par des places vides jusqu'au nombre par défaut. */
function places(membres: DelegationMember[], position: DelegationMember["position"]): Place[] {
  const publies = membres.filter((membre) => membre.position === position);
  const vides = Math.max(0, PLACES[position] - publies.length);
  return [...publies, ...Array.from({ length: vides }, () => null)];
}

/** Équipe Junior ou Senior d'une délégation, dans l'ordre de saisie des membres. */
export function composerEquipe(membres: DelegationMember[] | null, categorie: DelegationMember["category"]): Equipe {
  const equipe = (membres ?? []).filter((membre) => membre.category === categorie);
  return { participants: places(equipe, "participant"), encadrants: places(equipe, "leader") };
}
