/**
 * Frontière unique entre les fichiers `content/*.json` et les composants.
 * Le contenu est typé ici et sa partie française est composée
 * (microtypographie, voir lib/typographie.ts). Les fichiers JSON eux-mêmes
 * ne sont jamais modifiés.
 */
import archivesData from "@/content/archives.json";
import documentsData from "@/content/documents.json";
import editionsData from "@/content/editions.json";
import eventData from "@/content/event.json";
import faqData from "@/content/faq.json";
import formatData from "@/content/format.json";
import nationsData from "@/content/nations.json";
import organisationData from "@/content/organisation.json";
import partenairesData from "@/content/partenaires.json";
import programmeData from "@/content/programme.json";
import resultatsData from "@/content/resultats.json";
import resultatsFictifsData from "@/content/apercu/resultats-fictifs.json";
import statsData from "@/content/stats.json";
import { composerContenu } from "@/lib/typographie";
import type {
  ArchiveEntry,
  Classements,
  Committee,
  CompetitionFormat,
  Edition,
  EventInfo,
  FaqItem,
  HistoricalNation,
  Partner,
  ReferenceDocument,
  ResultatsOfficiels,
  Schedule,
  Stat,
} from "@/content/types";

export const evenement = composerContenu(eventData as EventInfo);
export const statistiques = composerContenu(statsData as Stat[]);
export const editions = composerContenu(editionsData as Edition[]);
export const archives = composerContenu(archivesData as ArchiveEntry[]);
export const nations = composerContenu(nationsData as HistoricalNation[]);
export const faq = composerContenu(faqData as FaqItem[]);
export const partenaires = composerContenu(partenairesData as Partner[]);
/** Partenaires affichables : confirmés et pourvus d'un logo. */
export const partenairesAffiches = partenaires.filter(
  (partner): partner is Partner & { logo: NonNullable<Partner["logo"]> } =>
    partner.status === "confirmed" && partner.logo !== null
);
export const comites = composerContenu(organisationData as Committee[]);
export const format = composerContenu(formatData as CompetitionFormat);
export const documents = composerContenu(documentsData as ReferenceDocument[]);
export const programme = composerContenu(programmeData as Schedule);
/** Classements officiels : affichés seulement si `published`. */
export const resultats = composerContenu(resultatsData as ResultatsOfficiels);
/** Classement d'exemple, fictif : jamais rendu en production (lib/site.ts, APERCUS_FICTIFS). */
export const resultatsFictifs = composerContenu(resultatsFictifsData as Classements);
