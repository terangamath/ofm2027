"use client";

import { useEffect, useState } from "react";
import { etatEpreuve, tempsRestant, type EtatEpreuve } from "@/lib/fuseaux";

interface CompteProps {
  debutIso: string;
  finIso: string;
  libelles: {
    label: string;
    before: string;
    during: string;
    after: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

/**
 * Compte à rebours du hero, jusqu'au début de l'épreuve. Le serveur rend des
 * tirets à la place des chiffres (rien ne bouge à l'hydratation) ; le compte
 * s'arrête à zéro, puis laisse place à « épreuve en cours » et « terminée ».
 */
export function HeroCompte({ debutIso, finIso, libelles }: CompteProps) {
  const [maintenant, setMaintenant] = useState<Date | null>(null);

  useEffect(() => {
    const tic = () => setMaintenant(new Date());
    const premier = window.setTimeout(tic, 0);
    const intervalle = window.setInterval(tic, 1_000);
    return () => {
      window.clearTimeout(premier);
      window.clearInterval(intervalle);
    };
  }, []);

  const etat: EtatEpreuve = maintenant ? etatEpreuve(maintenant, new Date(debutIso), new Date(finIso)) : "avant";
  const restant = maintenant ? tempsRestant(maintenant, new Date(debutIso)) : null;

  const unites = [
    { valeur: restant?.jours, libelle: libelles.days },
    { valeur: restant?.heures, libelle: libelles.hours },
    { valeur: restant?.minutes, libelle: libelles.minutes },
    { valeur: restant?.secondes, libelle: libelles.seconds },
  ];

  if (etat !== "avant") {
    return <p className="text-h4 font-semibold">{etat === "pendant" ? libelles.during : libelles.after}</p>;
  }

  return (
    <div role="timer" aria-label={libelles.label} className="flex flex-col gap-2 xl:gap-1.5">
      <p className="text-small text-compte-libelle">{libelles.before}</p>
      <ol className="grid grid-cols-4 divide-x divide-compte-accent/60">
        {unites.map((u, i) => (
          <li key={u.libelle} className={`flex flex-col ${i === 0 ? "pr-4" : "px-4"} sm:px-6 sm:first:pl-0 lg:px-5 xl:px-6`}>
            <span className="text-[1.75rem] leading-none font-semibold tabular-nums lg:text-[2rem]">
              {u.valeur === undefined ? "--" : String(u.valeur).padStart(2, "0")}
            </span>
            <span className="mt-1 text-small text-compte-libelle">{u.libelle}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
