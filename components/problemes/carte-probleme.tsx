import { ArrowDown, FileText } from "lucide-react";
import { MdxContent } from "@/components/mdx/mdx-content";
import type { Locale, ProblemFrontmatter } from "@/content/types";

export interface LibellesCarte {
  /** « Junior · Problème 1 ». */
  repere: string;
  /** « Problème 1 », titre de la carte tant que l'énoncé n'a pas de titre. */
  numero: string;
  author: string | null;
  pending: string;
  solutionTitle: string;
  solutionFormat: string;
  solutionDownload: string;
  solutionDownloadLabel: string;
  /** « Disponible après publication », sous le bouton désactivé. */
  solutionPending: string;
}

const BOUTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-vert-profond px-3 text-center font-semibold text-blanc sm:px-4 dark:bg-primary dark:text-primary-foreground";

/**
 * Un problème dans sa carte : catégorie et numéro, titre, auteur s'il est
 * publié, énoncé MDX (formules KaTeX, figures), puis le bandeau du corrigé PDF.
 * Sans énoncé ni corrigé publiés, la carte l'annonce sans rien inventer.
 */
export function CarteProbleme({
  id,
  enonce,
  solution,
  locale,
  libelles,
}: {
  /** Préfixe d'identifiants unique par carte, ex. « solution-junior-2 ». */
  id: string;
  enonce:{ frontmatter: ProblemFrontmatter; content: string } | null;
  /** Corrigé PDF de ce problème exactement, ou null. */
  solution: string | null;
  locale: Locale;
  libelles: LibellesCarte;
}) {
  const titre = enonce?.frontmatter.title.trim();

  return (
    <article className="flex flex-col gap-6 rounded-md border border-hairline bg-card p-5 shadow-soft sm:p-8">
      <header className="flex flex-col gap-2 border-b border-hairline pb-5">
        <p className="text-small font-semibold text-or-encre dark:text-or-clair">{libelles.repere}</p>
        <h2 className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] leading-snug font-bold text-balance text-vert-profond dark:text-primary">
          {titre || libelles.numero}
        </h2>
        {libelles.author && <p className="text-small text-muted-foreground">{libelles.author}</p>}
      </header>

      {enonce ? (
        <MdxContent source={enonce.content} locale={locale} />
      ) : (
        <p className="text-body-l text-muted-foreground">{libelles.pending}</p>
      )}

      {/* Le corrigé n'existe qu'en PDF : aucune démonstration en ligne. */}
      <div className="flex flex-col gap-4 rounded-md border border-hairline border-l-2 border-l-or bg-entete-fond px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <FileText aria-hidden className="mt-0.5 size-5 shrink-0 text-or-encre dark:text-or" />
          <div className="flex flex-col">
            <p className="font-semibold text-vert-profond dark:text-primary">{libelles.solutionTitle}</p>
            <p className="text-small text-muted-foreground">{libelles.solutionFormat}</p>
          </div>
        </div>
        {/* Le bouton reste visible ; sans PDF déposé, il est désactivé et ne pointe nulle part. */}
        {solution ? (
          <a
            href={solution}
            download
            aria-label={libelles.solutionDownloadLabel}
            className={`${BOUTON} transition-colors hover:bg-vert-clair dark:hover:bg-primary/85`}
          >
            {libelles.solutionDownload}
            <ArrowDown aria-hidden className="size-4" />
          </a>
        ) : (
          <div className="flex flex-col gap-1.5 sm:items-end">
            <button
              type="button"
              disabled
              aria-label={libelles.solutionDownloadLabel}
              aria-describedby={`${id}-attente`}
              className={`${BOUTON} cursor-not-allowed opacity-70`}
            >
              {libelles.solutionDownload}
              <ArrowDown aria-hidden className="size-4" />
            </button>
            <p id={`${id}-attente`} className="text-small text-muted-foreground">
              {libelles.solutionPending}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
