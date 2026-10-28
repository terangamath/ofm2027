import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArchiveDocumentType, Delegation, FicheDelegation, Locale, ProblemCategory, ProblemFrontmatter } from "@/content/types";
import { archives } from "@/lib/contenu";
import { composerContenu, composerFrancais } from "@/lib/typographie";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Délégations affichées, pays hôte en tête puis ordre alphabétique.
 * Les pays seulement invités (`status: "invited"`) sont écartés ici, donc de
 * toutes les pages, de la partition et du sitemap.
 */
export function getDelegations(): Delegation[] {
  const dir = path.join(CONTENT_DIR, "delegations");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => composerContenu(JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as FicheDelegation))
    .filter((fiche): fiche is Delegation => fiche.status !== "invited")
    .sort((a, b) => {
      if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
      return a.name.fr.localeCompare(b.name.fr);
    });
}

function readFrontmatter<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => matter(fs.readFileSync(path.join(dir, file), "utf-8")).data as T);
}

/**
 * Problèmes d'une locale. Retombe sur le français si la traduction n'existe
 * pas encore — seul le contenu MDX est traduit, le statut reste identique.
 */
export function getProblems(locale: Locale): ProblemFrontmatter[] {
  const dir = path.join(CONTENT_DIR, "problemes", locale);
  const fallbackDir = path.join(CONTENT_DIR, "problemes", "fr");
  const items = readFrontmatter<ProblemFrontmatter>(
    fs.existsSync(dir) ? dir : fallbackDir
  ).map((item) => (locale === "fr" ? { ...item, title: composerFrancais(item.title) } : item));
  return items.sort((a, b) => a.number - b.number);
}

interface MdxDocument<T> {
  frontmatter: T;
  content: string;
}

function findMdxBySlug<T extends { slug: string }>(
  dir: string,
  slug: string
): MdxDocument<T> | null {
  if (!fs.existsSync(dir)) return null;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const parsed = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    const frontmatter = parsed.data as T;
    if (frontmatter.slug === slug) {
      return { frontmatter, content: parsed.content };
    }
  }
  return null;
}

/**
 * Énoncés publiés d'une édition, rangés par catégorie et numéro (1 à 4).
 * Une place vide (null) signifie : pas encore d'énoncé publié. La version
 * anglaise d'un énoncé retombe sur la française si elle manque.
 */
export function getEnonces(
  locale: Locale,
  edition: number
): Record<ProblemCategory, (MdxDocument<ProblemFrontmatter> | null)[]> {
  const enonces: Record<ProblemCategory, (MdxDocument<ProblemFrontmatter> | null)[]> = {
    junior: [null, null, null, null],
    senior: [null, null, null, null],
  };
  const dir = path.join(CONTENT_DIR, "problemes", "fr");
  if (!fs.existsSync(dir)) return enonces;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const parsed = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    const fr = { frontmatter: parsed.data as ProblemFrontmatter, content: parsed.content };
    const { edition: annee, category, number, status, slug } = fr.frontmatter;
    if (annee !== edition || status !== "published" || !(number >= 1 && number <= 4)) continue;
    const doc =
      locale === "fr"
        ? { ...fr, frontmatter: { ...fr.frontmatter, title: composerFrancais(fr.frontmatter.title) } }
        : (findMdxBySlug<ProblemFrontmatter>(path.join(CONTENT_DIR, "problemes", locale), slug) ?? fr);
    enonces[category][number - 1] = doc;
  }
  return enonces;
}

/**
 * PDF d'une édition déclaré dans content/archives.json, seulement si le
 * fichier est bien déposé dans public/. Sans `problem`, le document de toute
 * l'épreuve (sujet complet) ; avec, celui de ce problème exactement (corrigé).
 */
export function getPdfArchive(
  edition: number,
  category: ProblemCategory,
  type: ArchiveDocumentType,
  problem?: number
): string | null {
  const entree = archives.find(
    (archive) =>
      archive.year === edition && archive.category === category && archive.type === type && archive.problem === problem
  );
  return entree && fs.existsSync(path.join(process.cwd(), "public", entree.path)) ? entree.path : null;
}

export function getProblemBySlug(
  locale: Locale,
  slug: string
): MdxDocument<ProblemFrontmatter> | null {
  const dir = path.join(CONTENT_DIR, "problemes", locale);
  const fallbackDir = path.join(CONTENT_DIR, "problemes", "fr");
  return findMdxBySlug<ProblemFrontmatter>(fs.existsSync(dir) ? dir : fallbackDir, slug);
}
