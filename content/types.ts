import type { MultiPolygon, Polygon } from "geojson";

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

/**
 * Session d'épreuve : l'instant unique auquel toutes les délégations
 * ouvrent le sujet. `startInstant` est en UTC ; `referenceZone` est le fuseau
 * dans lequel l'heure de référence est affichée (celui du pays hôte).
 * `provisional` : horaire repris de la règle générale du règlement OFM
 * (art. 5.8, « traditionnellement à 09:00 heure de Paris »), non confirmé
 * nommément pour 2027.
 */
export interface ExamSession {
  startInstant: string;       // "2027-03-27T08:00:00Z"
  referenceZone: string;      // "Africa/Dakar"
  durationMinutes: number;    // 270
  provisional: boolean;
}

export interface EventInfo {
  edition: number;            // 2027
  city: LocalizedText;
  country: LocalizedText;
  organizer: string;          // "Terangamath"
  organizerUrl: string;       // site de l'association
  officialLanguage: LocalizedText;
  /** false tant que les dates ne sont pas arrêtées. */
  datesConfirmed: boolean;
  /** null si non confirmées ; sinon libellé affichable. */
  dates: LocalizedText | null;
  /** Dates ISO ("YYYY-MM-DD") pour les métadonnées structurées (JSON-LD) ; null si non confirmées. */
  startDate: string | null;
  endDate: string | null;
  categories: EventCategory[];
  /** null tant qu'aucun horaire, même provisoire, n'est arrêté. */
  exam: ExamSession | null;
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

/**
 * Membre publié d'une délégation. Un membre non encore connu n'est pas saisi :
 * la fiche affiche « À confirmer » dans les places restantes (lib/equipes.ts).
 */
export interface DelegationMember {
  name: string;
  category: "junior" | "senior"; // équipe
  position: "participant" | "leader"; // élève ou encadrant
  /** Chemin sous public/, ex. "/delegations/senegal/prenom-nom.jpg" ; absent = avatar neutre. */
  photo?: string | null;
  /** Information complémentaire affichée sous le nom : âge, « Chef de délégation »… */
  detail?: LocalizedText | null;
}

export interface Delegation {
  slug: string;               // "senegal"
  countryCode: string;        // ISO 3166-1 alpha-2, ex. "SN"
  iso3: string;               // ISO 3166-1 alpha-3, ex. "SEN" : relie la fiche au fond de carte (content/geo/monde.json)
  name: LocalizedText;        // "Sénégal" / "Senegal"
  /** Nom précédé de sa préposition, pour « Délégation du Sénégal » / « Delegation of Senegal ». */
  ofName: LocalizedText;      // "du Sénégal" / "Senegal"
  flagEmoji: string;         // "🇸🇳" (historique ; l'affichage utilise des SVG)
  /** Fuseau IANA de la délégation, ex. "Africa/Dakar". Jamais de décalage en dur. */
  timeZone: string;
  status: EngagementStatus;   // confirmed | pending
  isHost: boolean;
  description: LocalizedText | null;
  /** null = aucun membre publié : toutes les places sont « À confirmer ». */
  members: DelegationMember[] | null;
}

/**
 * Pays invité qui n'a pas encore répondu : présent dans `content/delegations/`
 * pour être prêt le jour où il confirme, mais jamais rendu (ni liste, ni fiche,
 * ni sitemap). Le fuseau peut rester inconnu tant que la délégation n'a pas
 * dit d'où elle compose (pays à plusieurs fuseaux).
 * Pour l'afficher : passer `status` à "confirmed" et renseigner `timeZone`.
 */
export interface DelegationInvitee extends Omit<Delegation, "status" | "timeZone"> {
  status: "invited";
  timeZone: string | null;
}

/** Contenu brut d'un fichier `content/delegations/*.json`. */
export type FicheDelegation = Delegation | DelegationInvitee;

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

/**
 * Logo fourni par le partenaire, déposé dans `public/partenaires/`.
 * `width` et `height` : dimensions intrinsèques du fichier (viewBox pour un SVG),
 * qui donnent le rapport d'aspect ; l'affichage normalise la hauteur.
 */
export interface PartnerLogo {
  src: string;                // "/partenaires/nom.svg"
  width: number;
  height: number;
  /** Ajustement optique de la taille affichée (1 par défaut) : > 1 pour un logo à grandes marges blanches. */
  scale?: number;
}

/**
 * Un partenaire n'est affiché que s'il est `confirmed` ET a un `logo` :
 * sans aucune entrée affichable, la section disparaît.
 */
export interface Partner {
  id: string;
  name: LocalizedText;        // texte alternatif du logo
  category: PartnerCategory | null;
  status: EngagementStatus;
  logo: PartnerLogo | null;
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
  dates: LocalizedText | null;
  countriesCount: number | null;
  note: LocalizedText | null;
  status: ContentStatus;
}

/** Nation ayant déjà pris part à au moins une édition de l'OFM. */
export interface HistoricalNation {
  countryCode: string;        // ISO 3166-1 alpha-2
  name: LocalizedText;
}

// ─────────────────────────────────────────────────────────────
// Archives PDF (sujets, solutions, résultats des éditions passées)
// Hébergées dans public/archives/{year}/, référencées depuis /historique.
// ─────────────────────────────────────────────────────────────

export type ArchiveDocumentType = "sujet" | "solutions" | "resultats";

export interface ArchiveEntry {
  year: number;
  category: "junior" | "senior";
  type: ArchiveDocumentType;
  path: string;                // chemin public, ex. "/archives/2024/ofm-2024-junior-sujet.pdf"
}

// ─────────────────────────────────────────────────────────────
// Format de la compétition (/olympiade) — règle générale de l'OFM,
// non confirmée telle quelle pour 2027 (catégorie B, cf. CLAUDE.md provenance).
// ─────────────────────────────────────────────────────────────

export interface CompetitionFormat {
  provisional: boolean;
  teamSize: number;
  problemsCount: number;
  domains: LocalizedText[];
  duration: LocalizedText;
  correction: LocalizedText;
  distinctions: LocalizedText;
}

// ─────────────────────────────────────────────────────────────
// Documents de référence (règlement, etc.)
// ─────────────────────────────────────────────────────────────

export interface ReferenceDocument {
  id: string;
  title: LocalizedText;
  note: LocalizedText;
  path: string;
  provisional: boolean;
}

// ─────────────────────────────────────────────────────────────
// Organisation (/organisation)
// ─────────────────────────────────────────────────────────────

export interface Person {
  name: string;               // "[À confirmer — Terangamath]" si non nommé
  role: LocalizedText;
  org: string | null;
  country: string | null;     // code ISO
}

export interface Committee {
  id: string;
  name: LocalizedText;        // "Comité de sélection des problèmes", "Équipe de coordination"...
  description: LocalizedText | null;
  /** true : structure reprise de la règle générale de l'OFM, non confirmée telle quelle pour 2027. */
  provisional: boolean;
  members: Person[];
}

/** Un pays du fond de carte Natural Earth (content/geo/monde.json, généré par scripts/carte-monde.mjs). */
export interface PaysCarte {
  iso3: string;
  iso2: string;
  name: LocalizedText;
  geometry: Polygon | MultiPolygon;
}
