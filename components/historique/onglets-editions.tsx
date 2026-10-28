"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cibleClavier } from "@/lib/onglets";

/**
 * Frise des éditions : une année par bouton, reliés par un filet or ; une seule
 * fiche affichée, à la même place : changer d'année remplace la fiche sans
 * changer de page. Les fiches sont rendues côté serveur ; cet îlot ne fait que
 * choisir laquelle montrer. Sémantique d'onglets (motif ARIA).
 */
export function OngletsEditions({
  annees,
  fiches,
  initiale,
  libelle,
}: {
  annees: number[];
  fiches: ReactNode[];
  /** Index sélectionné au chargement. */
  initiale: number;
  /** Nom accessible de la frise. */
  libelle: string;
}) {
  const id = useId();
  const [choix, setChoix] = useState(initiale);

  // Le focus suit la sélection : l'onglet visé est retrouvé parmi ses frères.
  const naviguer = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const onglets = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    const cible = onglets ? cibleClavier(event.key, index, onglets.length) : null;
    if (cible === null) return;
    event.preventDefault();
    setChoix(cible);
    onglets?.[cible]?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        {/* Le filet passe derrière les boutons : il n'apparaît qu'entre eux. */}
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-or" />
        <div role="tablist" aria-label={libelle} className="relative flex justify-between gap-1 min-[360px]:gap-1.5 sm:gap-4">
          {annees.map((annee, i) => (
            <button
              key={annee}
              type="button"
              role="tab"
              id={`${id}-annee-${i}`}
              aria-selected={i === choix}
              aria-controls={`${id}-fiche`}
              tabIndex={i === choix ? 0 : -1}
              onClick={() => setChoix(i)}
              onKeyDown={naviguer(i)}
              className="min-h-11 min-w-0 flex-1 rounded-[2px] border border-or bg-card px-0.5 text-[0.75rem] min-[360px]:text-[0.8125rem] font-semibold tabular-nums text-vert-profond transition-colors hover:bg-entete-fond aria-selected:border-vert-profond aria-selected:bg-vert-profond aria-selected:text-blanc min-[400px]:text-[0.875rem] sm:max-w-28 sm:px-4 sm:text-body dark:text-primary dark:aria-selected:border-primary dark:aria-selected:bg-primary dark:aria-selected:text-primary-foreground"
            >
              {annee}
            </button>
          ))}
        </div>
      </div>

      <div id={`${id}-fiche`} role="tabpanel" aria-labelledby={`${id}-annee-${choix}`} tabIndex={0}>
        {fiches[choix]}
      </div>
    </div>
  );
}
