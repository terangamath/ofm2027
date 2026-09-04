"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  groupLabel: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeRemaining(targetDate: string): Remaining {
  const diff = Math.max(0, new Date(`${targetDate}T00:00:00Z`).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Chiffres tabulaires, sobres. Fréquence de rafraîchissement réduite sous prefers-reduced-motion. */
export function CountdownTimer({ targetDate, labels, groupLabel }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => setRemaining(computeRemaining(targetDate));
    tick();
    const interval = setInterval(tick, reduceMotion ? 60_000 : 1_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: labels.days, value: remaining?.days },
    { label: labels.hours, value: remaining?.hours },
    { label: labels.minutes, value: remaining?.minutes },
    { label: labels.seconds, value: remaining?.seconds },
  ];

  return (
    <div className="flex gap-6 sm:gap-10" role="group" aria-label={groupLabel}>
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center gap-2">
          <span className="font-display text-display-l tabular-nums text-or-clair" aria-hidden>
            {unit.value === undefined ? "—" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="label-mono text-ivoire/60">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
