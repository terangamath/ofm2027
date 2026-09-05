"use client";

import { useEffect, useState } from "react";
import { Flag } from "@/components/shared/flag";
import {
  decalageMinutes,
  etatEpreuve,
  fuseauDuNavigateur,
  heureLocale,
  libelleDecalage,
  tempsRestant,
  type EtatEpreuve,
} from "@/lib/fuseaux";

export interface LignePays {
  slug: string;
  countryCode: string;
  name: string;
  zone: string;
  /** Décalage IANA (minutes) à l'instant de l'épreuve. */
  decalage: number;
  /** Heure locale de début, « 08:00 ». */
  heure: string;
  isHost: boolean;
}

interface Libelles {
  listLabel: string;
  localTime: string;
  exam: string;
  now: string;
  hostBadge: string;
  you: string;
  yourZone: string;
  sameAs: string;
  before: string;
  during: string;
  after: string;
  afterLine: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface PartitionProps {
  lignes: LignePays[];
  debutIso: string;
  finIso: string;
  libelles: Libelles;
}

/** La règle couvre la journée UTC de l'épreuve, de 00:00 à 24:00. */
const MINUTES_JOUR = 24 * 60;
/** Graduations, en heures UTC. */
const GRADUATIONS = [0, 3, 6, 9, 12, 15, 18, 21];

const pourcent = (minutesUtc: number) => `${((minutesUtc / MINUTES_JOUR) * 100).toFixed(3)}%`;

/** Heure murale d'une graduation UTC pour un décalage donné. */
function graduationLocale(heureUtc: number, decalage: number): string {
  const total = (((heureUtc * 60 + decalage) % MINUTES_JOUR) + MINUTES_JOUR) % MINUTES_JOUR;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? String(h) : `${h}:${String(m).padStart(2, "0")}`;
}

function minutesUtcDuJour(instant: Date): number {
  return instant.getUTCHours() * 60 + instant.getUTCMinutes() + instant.getUTCSeconds() / 60;
}

/** Une règle graduée, décalée de l'offset de sa ligne. */
function Regle({ decalage, enAvant }: { decalage: number; enAvant?: boolean }) {
  return (
    <div aria-hidden className="relative h-10">
      {GRADUATIONS.map((h) => (
        <span
          key={h}
          className={`absolute bottom-0 flex h-full flex-col justify-between ${h % 6 === 0 ? "" : "hidden sm:flex"}`}
          style={{ left: pourcent(h * 60) }}
        >
          <span className="data text-[0.6875rem] leading-none text-ivoire/60">{graduationLocale(h, decalage)}</span>
          <span className={`block h-2 w-px ${enAvant ? "bg-ivoire/40" : "bg-ivoire/25"}`} />
        </span>
      ))}
      <span className="absolute bottom-0 left-0 h-px w-full bg-ivoire/15" />
      {/* La bande de l'épreuve et le trait « maintenant » : mêmes positions sur toutes les lignes. */}
      <span className="partition-bande absolute top-0 bottom-0" />
      <span className="partition-maintenant absolute top-0 bottom-0 w-px" />
    </div>
  );
}

export function Partition({ lignes, debutIso, finIso, libelles }: PartitionProps) {
  const debut = new Date(debutIso);
  const fin = new Date(finIso);
  const debutMin = minutesUtcDuJour(debut);
  const finMin = minutesUtcDuJour(fin);

  const [maintenant, setMaintenant] = useState<Date | null>(null);
  const [visiteur, setVisiteur] = useState<{ zone: string; decalage: number; heure: string } | null>(null);

  useEffect(() => {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const debutLocal = new Date(debutIso);
    const tic = () => setMaintenant(new Date());
    // Première mise à jour différée d'un tour : l'HTML statique est d'abord
    // affiché tel quel (pas de rendu en cascade dans l'effet).
    const premier = window.setTimeout(() => {
      tic();
      const zone = fuseauDuNavigateur();
      if (zone) {
        try {
          setVisiteur({ zone, decalage: decalageMinutes(zone, debutLocal), heure: heureLocale(zone, debutLocal) });
        } catch {
          /* fuseau inconnu de la base : pas de ligne visiteur */
        }
      }
    }, 0);
    // Sous prefers-reduced-motion, une mise à jour par minute suffit.
    const intervalle = window.setInterval(tic, reduit ? 60_000 : 1_000);
    return () => {
      window.clearTimeout(premier);
      window.clearInterval(intervalle);
    };
  }, [debutIso]);

  const etat: EtatEpreuve = maintenant ? etatEpreuve(maintenant, debut, fin) : "avant";
  const restant = maintenant ? tempsRestant(maintenant, debut) : null;
  const ligneVisiteur = visiteur ? lignes.find((l) => l.zone === visiteur.zone) ?? null : null;

  const style = {
    ["--partition-debut" as string]: pourcent(debutMin),
    ["--partition-largeur" as string]: pourcent(finMin - debutMin),
    ["--partition-maintenant" as string]: maintenant ? pourcent(minutesUtcDuJour(maintenant)) : "0%",
  };

  const unites = [
    { valeur: restant?.jours, libelle: libelles.days, pad: 3 },
    { valeur: restant?.heures, libelle: libelles.hours, pad: 2 },
    { valeur: restant?.minutes, libelle: libelles.minutes, pad: 2 },
    { valeur: restant?.secondes, libelle: libelles.seconds, pad: 2 },
  ];

  return (
    <div className={`partition partition-${etat} flex flex-col gap-8`} style={style} data-maintenant={maintenant ? "oui" : "non"}>
      <ol aria-label={libelles.listLabel} className="flex flex-col">
        {lignes.map((ligne) => {
          const estVous = ligneVisiteur?.slug === ligne.slug;
          return (
            <li
              key={ligne.slug}
              className={`grid grid-cols-[minmax(0,1fr)_2rem_3.5rem] sm:grid-cols-[minmax(7rem,11rem)_2rem_1fr_3.5rem] items-end gap-x-3 border-b border-ivoire/10 py-2 sm:gap-x-6 ${estVous ? "bg-ivoire/[0.04]" : ""}`}
            >
              <span className={`flex min-w-0 items-center gap-2.5 pb-1 text-small font-medium ${ligne.isHost ? "text-or-clair" : "text-ivoire"}`}>
                <Flag countryCode={ligne.countryCode} size={18} />
                <span className="truncate">
                  {ligne.name}
                  {ligne.isHost && <span className="sr-only"> · {libelles.hostBadge}</span>}
                </span>
                {estVous && <span className="label shrink-0 text-terracotta-clair">{libelles.you}</span>}
              </span>
              <span className="data pb-1 text-[0.6875rem] text-ivoire/60">{libelleDecalage(ligne.decalage)}</span>
              <span className="data order-3 pb-1 text-right text-body text-or-clair sm:order-4">
                {ligne.heure}
                <span className="sr-only"> {libelles.localTime}</span>
              </span>
              <div className="order-4 col-span-3 sm:order-3 sm:col-span-1">
                <Regle decalage={ligne.decalage} enAvant={ligne.isHost} />
              </div>
            </li>
          );
        })}

        {/* Ligne du visiteur : espace réservé côté serveur, remplie après hydratation (zéro décalage de mise en page). */}
        <li
          className="grid min-h-14 grid-cols-[minmax(0,1fr)_2rem_3.5rem] sm:grid-cols-[minmax(7rem,11rem)_2rem_1fr_3.5rem] items-end gap-x-3 border-b border-dashed border-ivoire/20 py-2 sm:gap-x-6"
          aria-hidden={!visiteur}
        >
          {visiteur && !ligneVisiteur && (
            <>
              <span className="flex min-w-0 items-center pb-1 text-small font-medium text-terracotta-clair">
                <span className="truncate">{libelles.yourZone.replace("{zone}", visiteur.zone)}</span>
              </span>
              <span className="data pb-1 text-[0.6875rem] text-ivoire/60">{libelleDecalage(visiteur.decalage)}</span>
              <span className="data order-3 pb-1 text-right text-body text-terracotta-clair sm:order-4">{visiteur.heure}</span>
              <div className="order-4 col-span-3 sm:order-3 sm:col-span-1">
                <Regle decalage={visiteur.decalage} />
              </div>
            </>
          )}
          {visiteur && ligneVisiteur && (
            <span className="col-span-3 pb-1 text-small text-ivoire/60 sm:col-span-4">
              {libelles.sameAs.replace("{country}", ligneVisiteur.name)}
            </span>
          )}
        </li>
      </ol>

      {/* Légende, calée sur la colonne des règles : la bande, puis le trait « maintenant ». */}
      <div aria-hidden className="grid grid-cols-1 sm:grid-cols-[minmax(7rem,11rem)_2rem_1fr_3.5rem] gap-x-3 sm:gap-x-6">
        <span className="hidden sm:block" />
        <span className="hidden sm:block" />
        <div className="relative h-10">
          <span
            className="label absolute top-0 whitespace-nowrap text-or-clair"
            style={{ left: "var(--partition-debut)" }}
          >
            {libelles.exam}
          </span>
          <span className="partition-maintenant-legende label absolute top-5 whitespace-nowrap text-terracotta-clair">
            {libelles.now}
          </span>
        </div>
        <span className="hidden sm:block" />
      </div>

      {/* Compte à rebours : la distance entre les deux traits. */}
      <div className="flex flex-col gap-3" role="status" aria-live="polite">
        {etat === "avant" && (
          <>
            <p className="label text-ivoire/60">{libelles.before}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {unites.map((u) => (
                <span key={u.libelle} className="flex flex-col gap-1">
                  <span className="font-mono text-h2 leading-none tabular-nums text-or-clair">
                    {u.valeur === undefined ? "—".repeat(u.pad) : String(u.valeur).padStart(u.pad, "0")}
                  </span>
                  <span className="label text-ivoire/55">{u.libelle}</span>
                </span>
              ))}
            </div>
          </>
        )}
        {etat === "pendant" && <p className="text-h3 font-display text-or-clair">{libelles.during}</p>}
        {etat === "apres" && (
          <>
            <p className="label text-ivoire/60">{libelles.after}</p>
            <p className="data text-body text-or-clair">{libelles.afterLine}</p>
          </>
        )}
      </div>
    </div>
  );
}
