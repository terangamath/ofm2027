// Types centraux pour tous les contenus OFM 2027

export type PublicationStatus = "published" | "coming_soon" | "draft";

export type MedalType = "or" | "argent" | "bronze" | "mention";

export type EventType = "competition" | "ceremonie" | "culturel" | "logistique";

export type PartnerType = "institutionnel" | "financier" | "technique" | "media";

export type CommitteeType = "organisation" | "scientifique" | "jury" | "benevole";

export type ArticleCategory = "annonce" | "resultat" | "document" | "information";

export type MathCategory = "junior" | "senior";

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin";
  url: string;
}

export interface SiteSettings {
  eventName: string;
  edition: number;
  host: string;
  organizer: string;
  eventDates: string;
  registrationOpen: boolean;
  resultsPublished: boolean;
  contactEmail: string;
  socialLinks: SocialLink[];
  countdownTarget?: string; // ISO 8601
}

// ─── News / Actualités ────────────────────────────────────────────────────────

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO 8601
  category: ArticleCategory;
  status: PublicationStatus;
  content: string; // Markdown/MDX
  coverImage?: string;
  tags?: string[];
}

// ─── Countries / Équipes ──────────────────────────────────────────────────────

export interface Student {
  name: string;
  category: MathCategory;
}

export interface Delegation {
  chefDelegation?: string;
  encadrants?: string[];
  elevesSenior?: Student[];
  elevesJunior?: Student[];
}

export interface Country {
  id: string;
  name: string;
  flag: string; // path: /flags/xx.svg
  status: PublicationStatus;
  delegation?: Delegation;
  confirmed?: boolean;
}

// ─── Math Content (Problèmes / Solutions) ─────────────────────────────────────

export interface MathContent {
  id: string;
  category: MathCategory;
  year: number;
  title: string;
  number: number;
  status: PublicationStatus;
  contentMDX?: string;
  pdfUrl?: string;
}

// ─── Results ──────────────────────────────────────────────────────────────────

export interface StudentResult {
  name: string;
  country: string;
  score?: number;
  medal?: MedalType;
}

export interface CountryResult {
  country: string;
  category: MathCategory;
  rank?: number;
  totalScore?: number;
  medal?: MedalType;
  students?: StudentResult[];
  status: PublicationStatus;
}

// ─── Organisation ─────────────────────────────────────────────────────────────

export interface OrgMember {
  name: string;
  role: string;
  committee: CommitteeType;
  country?: string;
  photo?: string;
  bio?: string;
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
  type: PartnerType;
  description?: string;
}

// ─── Programme ────────────────────────────────────────────────────────────────

export interface ProgramEvent {
  id: string;
  date: string; // ISO 8601
  time?: string;
  endTime?: string;
  title: string;
  description?: string;
  type: EventType;
  location?: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// ─── Historique ───────────────────────────────────────────────────────────────

export interface EditionHistory {
  year: number;
  host: string;
  hostCountry: string;
  dates?: string;
  participatingCountries?: number;
  totalStudents?: number;
  winnersSenior?: string;
  winnersJunior?: string;
  externalUrl?: string;
  notes?: string;
  image?: string;
}

// ─── Galerie ──────────────────────────────────────────────────────────────────

export interface MediaItem {
  url: string;
  caption?: string;
  type: "photo" | "video";
  thumbnail?: string;
}

export interface MediaAlbum {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  images: MediaItem[];
  status: PublicationStatus;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  title: string;
  description?: string;
  url: string; // /documents/...
  category: "reglement" | "formulaire" | "programme" | "resultats" | "autre";
  date: string;
  status: PublicationStatus;
  fileSize?: string;
}
