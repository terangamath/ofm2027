import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type {
  SiteSettings,
  NewsArticle,
  Country,
  MathContent,
  FAQItem,
  EditionHistory,
  MediaAlbum,
  Partner,
  ProgramEvent,
} from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Lit et parse un fichier JSON depuis /content */
function readJson<T>(relativePath: string): T {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

/** Lit et parse un fichier YAML depuis /content */
function readYaml<T>(relativePath: string): T {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return yaml.load(raw) as T;
}

/** Lit les paramètres globaux du site */
export function getSiteSettings(): SiteSettings {
  return readYaml<SiteSettings>("settings.yaml");
}

/** Retourne toutes les actualités publiées, triées par date décroissante */
export function getActualites(): NewsArticle[] {
  const dir = path.join(CONTENT_DIR, "actualites");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const articles: NewsArticle[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    return {
      ...(data as Omit<NewsArticle, "content">),
      content,
    } as NewsArticle;
  });

  return articles
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Retourne une actualité par son slug */
export function getActualiteBySlug(slug: string): NewsArticle | null {
  const all = getAllActualites();
  return all.find((a) => a.slug === slug) ?? null;
}

/** Retourne toutes les actualités (y compris draft) */
export function getAllActualites(): NewsArticle[] {
  const dir = path.join(CONTENT_DIR, "actualites");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    return { ...(data as Omit<NewsArticle, "content">), content } as NewsArticle;
  });
}

/** Retourne la liste des pays/équipes */
export function getEquipes(): Country[] {
  return readJson<Country[]>("equipes/index.json");
}

/** Retourne un pays par son id */
export function getEquipeById(id: string): Country | null {
  const all = getEquipes();
  return all.find((c) => c.id === id) ?? null;
}

/** Retourne les problèmes (filtrés par catégorie si fournie) */
export function getProblemes(category?: "junior" | "senior"): MathContent[] {
  const all = readJson<MathContent[]>("problemes/index.json");
  if (category) return all.filter((p) => p.category === category);
  return all;
}

/** Retourne les partenaires */
export function getPartenaires(): Partner[] {
  return readJson<Partner[]>("partenaires/index.json");
}

/** Retourne la FAQ */
export function getFAQ(): FAQItem[] {
  return readJson<FAQItem[]>("faq/index.json");
}

/** Retourne l'historique des éditions, trié par année décroissante */
export function getHistorique(): EditionHistory[] {
  const all = readJson<EditionHistory[]>("historique/index.json");
  return all.sort((a, b) => b.year - a.year);
}

/** Retourne les albums de galerie publiés */
export function getGalerie(): MediaAlbum[] {
  const all = readJson<MediaAlbum[]>("galerie/albums.json");
  return all.filter((a) => a.status === "published");
}

/** Retourne tous les événements du programme triés par date */
export function getProgramme(): ProgramEvent[] {
  const all = readJson<ProgramEvent[]>("programme/agenda-2027.json");
  return all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Retourne les membres de l'organisation */
export function getOrganisation(): { comites: unknown[]; terangamath: unknown } {
  return readJson("organisation/index.json");
}

// ─── Utilitaire frontmatter simple ───────────────────────────────────────────

interface FrontmatterResult {
  data: Record<string, unknown>;
  content: string;
}

function parseFrontmatter(raw: string): FrontmatterResult {
  const delimiter = "---";
  const start = raw.indexOf(delimiter);
  if (start === -1) return { data: {}, content: raw };

  const end = raw.indexOf(delimiter, start + 3);
  if (end === -1) return { data: {}, content: raw };

  const frontmatterStr = raw.slice(start + 3, end).trim();
  const content = raw.slice(end + 3).trim();

  const data = yaml.load(frontmatterStr) as Record<string, unknown>;
  return { data, content };
}
