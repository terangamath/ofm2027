"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { FileText } from "lucide-react";
import type { ProblemCategory } from "@/content/types";
import { cibleClavier } from "@/lib/onglets";

export interface CategorieProblemes {
  id: ProblemCategory;
  label: string;
  /** Énoncés complets de la catégorie en PDF, ou null s'ils ne sont pas encore déposés. */
  pdf: string | null;
  /** « Énoncés Junior PDF ». */
  pdfTexte: string;
  /** Libellé accessible du lien de téléchargement. */
  pdfLabel: string;
  /** Cartes des problèmes 1 à 4, rendues côté serveur (KaTeX compris). */
  problemes: ReactNode[];
}

export interface LibellesProblemes {
  categories: string;
  /** « Problèmes Junior », « Problèmes Senior » : une entrée par catégorie. */
  problemes: Record<ProblemCategory, string>;
  /** « Problème 1 » à « Problème 4 ». */
  onglets: string[];
  pdfPending: string;
}

/**
 * Problèmes en deux niveaux d'onglets : catégorie, puis numéro. Un seul problème
 * (énoncé et corrigé) est affiché à la fois, à la même place ; le numéro choisi est conservé quand
 * on change de catégorie.
 */
export function OngletsProblemes({ categories, libelles }: { categories: CategorieProblemes[]; libelles: LibellesProblemes }) {
  const id = useId();
  const [categorie, setCategorie] = useState(0);
  const [probleme, setProbleme] = useState(0);
  const active = categories[categorie];

  // Le focus suit la sélection : l'onglet visé est retrouvé parmi ses frères.
  const naviguer = (index: number, choisir: (i: number) => void) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const onglets = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    const cible = onglets ? cibleClavier(event.key, index, onglets.length) : null;
    if (cible === null) return;
    event.preventDefault();
    choisir(cible);
    onglets?.[cible]?.focus();
  };

  const pdf = "inline-flex min-h-11 items-center gap-2 rounded-md border px-3 font-semibold sm:px-4";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div role="tablist" aria-label={libelles.categories} className="inline-flex rounded-lg border border-hairline bg-card p-1">
          {categories.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`${id}-categorie-${c.id}`}
              aria-selected={i === categorie}
              aria-controls={`${id}-panneau-categorie`}
              tabIndex={i === categorie ? 0 : -1}
              onClick={() => setCategorie(i)}
              onKeyDown={naviguer(i, setCategorie)}
              className="min-h-11 min-w-[5.5rem] rounded-md px-4 font-semibold text-vert-profond sm:min-w-28 sm:px-5 transition-colors hover:bg-nav-survol aria-selected:bg-vert-profond aria-selected:text-blanc dark:text-primary dark:aria-selected:bg-primary dark:aria-selected:text-primary-foreground"
            >
              {c.label}
            </button>
          ))}
        </div>

        {active.pdf ? (
          <a
            href={active.pdf}
            download
            aria-label={active.pdfLabel}
            className={`${pdf} border-vert-profond text-vert-profond transition-colors hover:bg-vert-profond hover:text-blanc dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground`}
          >
            <FileText aria-hidden className="size-4 text-or-encre dark:text-or" />
            {active.pdfTexte}
          </a>
        ) : (
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              disabled
              aria-describedby={`${id}-pdf-attente`}
              className={`${pdf} cursor-not-allowed border-hairline bg-card text-muted-foreground`}
            >
              <FileText aria-hidden className="size-4" />
              {active.pdfTexte}
            </button>
            <span id={`${id}-pdf-attente`} className="text-small text-muted-foreground">
              {libelles.pdfPending}
            </span>
          </span>
        )}
      </div>

      <div
        id={`${id}-panneau-categorie`}
        role="tabpanel"
        aria-labelledby={`${id}-categorie-${active.id}`}
        className="flex flex-col gap-5"
      >
        <div
          role="tablist"
          aria-label={libelles.problemes[active.id]}
          className="grid grid-cols-4 border-b border-hairline sm:flex sm:gap-2"
        >
          {libelles.onglets.map((libelle, i) => (
            <button
              key={libelle}
              type="button"
              role="tab"
              id={`${id}-probleme-${i}`}
              aria-selected={i === probleme}
              aria-controls={`${id}-panneau-probleme`}
              tabIndex={i === probleme ? 0 : -1}
              onClick={() => setProbleme(i)}
              onKeyDown={naviguer(i, setProbleme)}
              className="-mb-px min-h-11 border-b-2 border-transparent px-0.5 text-[0.8125rem] font-medium whitespace-nowrap text-muted-foreground max-[359px]:leading-tight max-[359px]:whitespace-normal transition-colors hover:text-vert-profond aria-selected:border-or aria-selected:font-semibold aria-selected:text-vert-profond sm:px-4 sm:text-body dark:hover:text-primary dark:aria-selected:text-primary"
            >
              {libelle}
            </button>
          ))}
        </div>

        <div id={`${id}-panneau-probleme`} role="tabpanel" aria-labelledby={`${id}-probleme-${probleme}`} tabIndex={0}>
          {active.problemes[probleme]}
        </div>
      </div>
    </div>
  );
}
