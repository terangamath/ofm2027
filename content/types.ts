// content/types.ts
// Types stricts pour tout le contenu du site OFM 2027.
// Règle CLAUDE.md : jamais de `any`, tout contenu non confirmé est explicitement marqué.

/** Langues gérées (fr par défaut). */
export type Locale = "fr" | "en";

/** Texte traduit fr/en. */
export interface LocalizedText {
  fr: string;
  en: string;
}

/** État d'une donnée dont le contenu n'est pas encore disponible. */
export type ContentStatus = "published" | "coming_soon";

/** Statut d'engagement (délégations, partenaires). */
export type EngagementStatus = "confirmed" | "pending";

// ─────────────────────────────────────────────────────────────
// Événement (global)
// ─────────────────────────────────────────────────────────────

export interface EventInfo {
  edition: number;            // 2027
  city: LocalizedText;
  country: LocalizedText;
  organizer: string;          // "Terangamath"
  officialLanguage: LocalizedText;
  /** false tant que les dates ne sont pas arrêtées. */
  datesConfirmed: boolean;
  /** null si non confirmées ; sinon libellé affichable. */
  dates: LocalizedText | null;
  categories: EventCategory[];
}

export interface EventCategory {
  id: "junior" | "senior";
  name: LocalizedText;
  scope: LocalizedText;       // ex. "Jusqu'en 3ème incluse"
}

// ─────────────────────────────────────────────────────────────
// Statistiques (accueil)
// ─────────────────────────────────────────────────────────────

export interface Stat {
  value: string;              // "15+", "200+"
  label: LocalizedText;
  /** true = chiffre encore provisoire. */
  provisional: boolean;
}

// ─────────────────────────────────────────────────────────────
// Délégations (/equipes, /equipes/[pays])
// ─────────────────────────────────────────────────────────────

export interface DelegationMember {
  name: string;               // "[À confirmer]" tant que non nommé
  role: LocalizedText;        // "Compétiteur", "Chef de délégation"...
  category?: "junior" | "senior";
}

export interface Delegation {
  slug: string;               // "senegal"
  countryCode: string;        // ISO 3166-1 alpha-2, ex. "SN"
  name: LocalizedText;        // "Sénégal" / "Senegal"
  flagEmoji: string;          // "🇸🇳"
  status: EngagementStatus;   // confirmed | pending
  isHost: boolean;
  description: LocalizedText | null;
  /** null = roster pas encore publié (coming_soon). */
  members: DelegationMember[] | null;
}

// ─────────────────────────────────────────────────────────────
// Problèmes & Solutions (/problemes)
// Corps = MDX avec KaTeX : content/problemes/{locale}/{slug}.mdx
// ─────────────────────────────────────────────────────────────

export type ProblemCategory = "junior" | "senior";

export interface ProblemFrontmatter {
  slug: string;               // "2027-senior-01"
  edition: number;            // 2027
  category: ProblemCategory;
  number: number;             // 1..n
  title: string;
  topics: string[];           // ["géométrie", "combinatoire"]
  hasSolution: boolean;
  status: ContentStatus;      // coming_soon tant que non publié
}

// ─────────────────────────────────────────────────────────────
// Programme (/programme)
// ─────────────────────────────────────────────────────────────

/** Compétition 100 % à distance : pas de kind logistique/cérémonie/excursion physique. */
export type ScheduleEventKind = "epreuve" | "correction";

export interface ScheduleEvent {
  time: string | null;        // "09:00" ou null si non fixé
  title: LocalizedText;
  location: LocalizedText | null;
  kind: ScheduleEventKind;
}

export interface ScheduleDay {
  /** null tant que les dates ne sont pas arrêtées. */
  date: string | null;
  label: LocalizedText;       // "Jour 1", "Jour 2"
  events: ScheduleEvent[];
}

export interface Schedule {
  status: ContentStatus;
  /** true : la structure du déroulé suit la règle générale de l'OFM, non confirmée telle quelle pour 2027. */
  provisional: boolean;
  days: ScheduleDay[];
}

// ─────────────────────────────────────────────────────────────
// Partenaires (/ accueil, /organisation)
// ─────────────────────────────────────────────────────────────

export type PartnerCategory = "institutionnel" | "financier" | "technique";

export interface Partner {
  id: string;
  name: LocalizedText;
  category: PartnerCategory;
  status: EngagementStatus;
  logo: string | null;        // chemin vers le logo, null si à venir
  url: string | null;
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

// ─────────────────────────────────────────────────────────────
// Historique des éditions (/historique)
// ─────────────────────────────────────────────────────────────

export interface Edition {
  year: number;
  host: LocalizedText;        // "[À confirmer]" si donnée manquante
  city: LocalizedText | null;
  countriesCount: number | null;
  note: LocalizedText | null;
  status: ContentStatus;
}

// ─────────────────────────────────────────────────────────────
// Organisation (/organisation)
// ─────────────────────────────────────────────────────────────

export interface Person {
  name: string;               // "[À confirmer]" si non nommé
  role: LocalizedText;
  org: string | null;
  country: string | null;     // code ISO
}

export interface Committee {
  id: string;
  name: LocalizedText;        // "Comité d'organisation", "Comité scientifique"
  description: LocalizedText | null;
  members: Person[];
}
