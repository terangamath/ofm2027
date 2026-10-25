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
 * tirets à la place des chiffres (rien ne bouge à l'hydratation) ; chaque
 * chiffre qui change entre par le haut, sauf sous prefers-reduced-motion.
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

  const debut = new Date(debutIso);
  const etat: EtatEpreuve = maintenant ? etatEpreuve(maintenant, debut, new Date(finIso)) : "avant";
  const restant = maintenant ? tempsRestant(maintenant, debut) : null;

  const unites = [
    { valeur: restant?.jours, libelle: libelles.days },
    { valeur: restant?.heures, libelle: libelles.hours },
    { valeur: restant?.minutes, libelle: libelles.minutes },
    { valeur: restant?.secondes, libelle: libelles.seconds },
  ];

  return (
    <div
      role="timer"
      aria-label={libelles.label}
      className="flex flex-col gap-4 rounded-lg bg-compte-fond px-5 py-5 text-compte-texte sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:gap-8"
    >
      <p className="flex shrink-0 items-center gap-2.5 text-body font-semibold whitespace-nowrap">
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-compte-accent" />
        {etat === "avant" ? libelles.before : etat === "pendant" ? libelles.during : libelles.after}
      </p>

      {etat === "avant" && (
        <ol className="grid grid-cols-4 gap-2 sm:flex sm:items-start sm:gap-4">
          {unites.map((u, i) => (
            <li key={u.libelle} className="flex items-start justify-center gap-4">
              <span className="flex flex-col items-center gap-1.5">
                <span className="relative overflow-hidden font-mono text-[clamp(1.875rem,8vw,3rem)] leading-none font-semibold tabular-nums">
                  {u.valeur === undefined ? (
                    "--"
                  ) : (
                    <span key={u.valeur} className="compte-chiffre block">
                      {String(u.valeur).padStart(2, "0")}
                    </span>
                  )}
                </span>
                <span className="text-small text-compte-libelle">{u.libelle}</span>
              </span>
              {i < unites.length - 1 && (
                <span aria-hidden className="hidden font-mono text-[2.5rem] leading-none text-compte-accent sm:block">
                  :
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
