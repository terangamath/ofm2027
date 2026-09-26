/**
 * Fuseaux horaires sur la base IANA embarquée dans ICU (`Intl`), sans aucun
 * décalage écrit en dur. Fonctions pures : elles reçoivent l'instant et ne
 * lisent jamais l'horloge de la machine, ce qui les rend testables et
 * garantit un HTML statique indépendant de l'heure de build.
 *
 * Piège couvert par les tests : le passage à l'heure d'été européen a lieu
 * dans la nuit du 27 au 28 mars 2027, entre l'épreuve et la correction.
 */

/** Décalage d'un fuseau par rapport à UTC, en minutes, à un instant donné. */
export function decalageMinutes(zone: string, instant: Date): number {
  const partie = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((p) => p.type === "timeZoneName")?.value;
  if (!partie || partie === "GMT" || partie === "UTC") return 0;
  const m = /^(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(partie);
  if (!m) throw new Error(`Décalage illisible pour ${zone} : ${partie}`);
  const signe = m[1] === "-" ? -1 : 1;
  return signe * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** Composantes d'horloge murale (année, mois, jour, heure, minute) dans un fuseau. */
export function horlogeMurale(zone: string, instant: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant);
  const lire = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { annee: lire("year"), mois: lire("month"), jour: lire("day"), heure: lire("hour"), minute: lire("minute") };
}

/** « 08:00 » : heure murale d'un instant dans un fuseau, sur 24 h. */
export function heureLocale(zone: string, instant: Date): string {
  const { heure, minute } = horlogeMurale(zone, instant);
  return `${String(heure).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Instant UTC correspondant à une heure murale (« 2027-03-27 », « 09:00 »)
 * dans un fuseau. Deux passes suffisent : la première estime le décalage, la
 * seconde le recalcule à l'instant obtenu (utile autour d'un changement d'heure).
 */
export function instantDepuisHeureMurale(zone: string, date: string, heure: string): Date {
  const [a, m, j] = date.split("-").map(Number);
  const [h, mn] = heure.split(":").map(Number);
  const muralCommeUtc = Date.UTC(a, m - 1, j, h, mn);
  let estimation = new Date(muralCommeUtc - decalageMinutes(zone, new Date(muralCommeUtc)) * 60_000);
  estimation = new Date(muralCommeUtc - decalageMinutes(zone, estimation) * 60_000);
  return estimation;
}

/** Date murale « 2027-03-27 » d'un instant dans un fuseau. */
export function dateLocale(zone: string, instant: Date): string {
  const { annee, mois, jour } = horlogeMurale(zone, instant);
  return `${annee}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}

/**
 * ISO 8601 avec décalage explicite, à l'heure murale du fuseau :
 * « 2027-03-27T08:00:00+00:00 » pour Dakar, « 2027-03-27T09:00:00+01:00 » pour Paris.
 */
export function isoAvecDecalage(zone: string, instant: Date): string {
  const { heure, minute } = horlogeMurale(zone, instant);
  const decalage = decalageMinutes(zone, instant);
  const abs = Math.abs(decalage);
  const deux = (n: number) => String(n).padStart(2, "0");
  const signe = decalage < 0 ? "-" : "+";
  return `${dateLocale(zone, instant)}T${deux(heure)}:${deux(minute)}:00${signe}${deux(Math.floor(abs / 60))}:${deux(abs % 60)}`;
}

/** Signe et heures d'un décalage : « +1 », « 0 », « +3 », « +5:30 ». */
export function libelleDecalage(minutes: number): string {
  if (minutes === 0) return "0";
  const signe = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const mn = abs % 60;
  return `${signe}${h}${mn ? `:${String(mn).padStart(2, "0")}` : ""}`;
}

export type EtatEpreuve = "avant" | "pendant" | "apres";

/** État de l'épreuve à un instant donné. */
export function etatEpreuve(maintenant: Date, debut: Date, fin: Date): EtatEpreuve {
  if (maintenant.getTime() < debut.getTime()) return "avant";
  if (maintenant.getTime() < fin.getTime()) return "pendant";
  return "apres";
}

/** Jours, heures, minutes, secondes restants (jamais négatifs). */
export function tempsRestant(maintenant: Date, cible: Date) {
  const total = Math.max(0, Math.floor((cible.getTime() - maintenant.getTime()) / 1000));
  return {
    jours: Math.floor(total / 86_400),
    heures: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    secondes: total % 60,
  };
}

/** Le fuseau du visiteur tel que le navigateur le résout, ou null. */
export function fuseauDuNavigateur(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}
