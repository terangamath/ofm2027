import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Delegation,
  Locale,
  NewsFrontmatter,
  ProblemFrontmatter,
} from "@/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Délégations, pays hôte en tête puis ordre alphabétique. */
export function getDelegations(): Delegation[] {
  const dir = path.join(CONTENT_DIR, "delegations");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as Delegation)
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

/** Actualités publiées, triées de la plus récente à la plus ancienne. */
export function getNews(locale: Locale): NewsFrontmatter[] {
  const dir = path.join(CONTENT_DIR, "actualites", locale);
  return readFrontmatter<NewsFrontmatter>(dir)
    .filter((item) => item.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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
  );
  return items.sort((a, b) => a.number - b.number);
}
