import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne les classes Tailwind sans conflits */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate une date ISO en format lisible français */
export function formatDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", options).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/** Formate une date courte (ex: "15 mars 2027") */
export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, { day: "numeric", month: "short", year: "numeric" });
}

/** Retourne vrai si la date est dans le futur */
export function isFuture(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

/** Retourne vrai si la date est dans le passé */
export function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/** Tronque un texte à une longueur donnée */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/** Slug-ify une chaîne (kebab-case sans accents) */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Labels lisibles pour les types d'événements du programme */
export const eventTypeLabels: Record<string, string> = {
  competition: "Compétition",
  ceremonie: "Cérémonie",
  culturel: "Programme culturel",
  logistique: "Logistique",
};

/** Labels lisibles pour les catégories */
export const categoryLabels: Record<string, string> = {
  junior: "Junior",
  senior: "Senior",
};

/** Couleurs pour les types d'événements */
export const eventTypeColors: Record<string, string> = {
  competition: "bg-vert-pale text-vert border-vert-pale",
  ceremonie: "bg-or-pale text-or border-or-clair",
  culturel: "bg-blue-50 text-blue-700 border-blue-100",
  logistique: "bg-gray-100 text-gris border-gray-200",
};

/** Couleurs pour les médailles */
export const medalColors: Record<string, string> = {
  or: "text-yellow-600 bg-yellow-50",
  argent: "text-gray-500 bg-gray-100",
  bronze: "text-orange-600 bg-orange-50",
  mention: "text-blue-600 bg-blue-50",
};
