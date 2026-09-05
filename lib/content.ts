import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Delegation, Locale, ProblemFrontmatter } from "@/content/types";
import { composerContenu, composerFrancais } from "@/lib/typographie";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Délégations, pays hôte en tête puis ordre alphabétique. */
export function getDelegations(): Delegation[] {
  const dir = path.join(CONTENT_DIR, "delegations");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => composerContenu(JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as Delegation))
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

export function getProblemBySlug(
  locale: Locale,
  slug: string
): MdxDocument<ProblemFrontmatter> | null {
  const dir = path.join(CONTENT_DIR, "problemes", locale);
  const fallbackDir = path.join(CONTENT_DIR, "problemes", "fr");
  return findMdxBySlug<ProblemFrontmatter>(fs.existsSync(dir) ? dir : fallbackDir, slug);
}
