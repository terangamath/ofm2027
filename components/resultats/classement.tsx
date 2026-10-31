"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Flag } from "@/components/shared/flag";
import type { Classements, Distinction, LigneResultat } from "@/content/types";
import { filtrerResultats, paginer, paysPresents } from "@/lib/resultats";

type Categorie = keyof Classements;
const CATEGORIES: Categorie[] = ["junior", "senior"];
const PROBLEMES = [1, 2, 3, 4] as const;

/**
 * Libellés déjà traduits par la page (le layout n'envoie pas les messages au
 * navigateur). Les gabarits gardent leurs variables entre accolades ({page}),
 * remplacées ici.
 */
export interface LibellesClassement {
  categories: string;
  junior: string;
  senior: string;
  searchLabel: string;
  searchPlaceholder: string;
  countryLabel: string;
  allCountries: string;
  caption: string;
  previewCaption: string;
  colRank: string;
  colAward: string;
  colParticipant: string;
  colCountry: string;
  /** Mot affiché à la place du pays dans l'aperçu : des données fictives ne s'attribuent à aucun pays réel. */
  countryPlaceholder: string;
  colProblem: string;
  colProblemLong: string;
  colTotal: string;
  gold: string;
  silver: string;
  bronze: string;
  noAward: string;
  /** compte[n] : « n participants », pour n de 0 au plus grand classement. */
  compte: string[];
  noMatch: string;
  resetFilters: string;
  paginationLabel: string;
  previous: string;
  next: string;
  pageOf: string;
  legend: string;
  download: string;
  previewBadge: string;
  scrollHint: string;
}

const remplir = (gabarit: string, valeurs: Record<string, string | number>) =>
  gabarit.replace(/\{(\w+)\}/g, (tout, cle: string) => (cle in valeurs ? String(valeurs[cle]) : tout));

const PASTILLE: Record<NonNullable<Distinction>, string> = {
  gold: "bg-or",
  silver: "bg-argent",
  bronze: "bg-bronze",
};

function Badge({ distinction, libelles }: { distinction: Distinction; libelles: LibellesClassement }) {
  if (!distinction) {
    return (
      <>
        <span aria-hidden className="text-muted-foreground">
          –
        </span>
        <span className="sr-only">{libelles.noAward}</span>
      </>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-small font-medium whitespace-nowrap text-card-foreground">
      <span aria-hidden className={`size-2 rounded-full ${PASTILLE[distinction]}`} />
      {libelles[distinction]}
    </span>
  );
}

/** Une cellule CSV : guillemets doublés, champ entre guillemets s'il le faut. */
const cellule = (valeur: string | number) => {
  const texte = String(valeur);
  return /[";\r\n]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
};

/**
 * Classements Junior et Senior : onglets, recherche par nom, filtre par pays,
 * pagination, export CSV de la catégorie. Les quatre se combinent ; changer de
 * catégorie ou de filtre ramène à la première page. Rangs et distinctions sont
 * affichés tels que publiés (ex æquo compris).
 */
export function Classement({
  classements,
  nomsPays,
  apercu,
  libelles,
}: {
  classements: Classements;
  /** Code ISO → nom du pays dans la langue de la page. */
  nomsPays: Record<string, string>;
  /** Données fictives : bandeau, légende du tableau et nom du fichier exporté le disent. */
  apercu: boolean;
  libelles: LibellesClassement;
}) {
  const [categorie, setCategorie] = useState<Categorie>("junior");
  const [recherche, setRecherche] = useState("");
  const [pays, setPays] = useState("");
  const [page, setPage] = useState(1);
  const onglets = useRef<Record<Categorie, HTMLButtonElement | null>>({ junior: null, senior: null });
  const id = useId();

  const options = useMemo(
    () =>
      paysPresents(classements.junior, classements.senior)
        .map((code) => ({ code, nom: nomsPays[code] ?? code }))
        .sort((a, b) => a.nom.localeCompare(b.nom)),
    [classements, nomsPays]
  );
  const filtrees = useMemo(
    () => filtrerResultats(classements[categorie], { recherche, pays }),
    [classements, categorie, recherche, pays]
  );
  const courante = paginer(filtrees, page);
  const filtresActifs = recherche !== "" || pays !== "";

  const choisir = (suivante: Categorie) => {
    setCategorie(suivante);
    setPage(1);
  };

  // Onglets au clavier (motif ARIA) : flèches et Début/Fin déplacent la sélection.
  const naviguer = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = CATEGORIES.indexOf(categorie);
    const cible =
      event.key === "ArrowRight" ? CATEGORIES[(i + 1) % CATEGORIES.length]
      : event.key === "ArrowLeft" ? CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length]
      : event.key === "Home" ? CATEGORIES[0]
      : event.key === "End" ? CATEGORIES[CATEGORIES.length - 1]
      : null;
    if (!cible) return;
    event.preventDefault();
    choisir(cible);
    onglets.current[cible]?.focus();
  };

  const telecharger = () => {
    const entetes = [
      libelles.colRank,
      libelles.colAward,
      libelles.colParticipant,
      libelles.colCountry,
      ...PROBLEMES.map((n) => remplir(libelles.colProblem, { n })),
      libelles.colTotal,
    ];
    const lignes = classements[categorie].map((l: LigneResultat) => [
      l.rank,
      l.award ? libelles[l.award] : "",
      l.name,
      apercu ? libelles.countryPlaceholder : (nomsPays[l.countryCode] ?? l.countryCode),
      ...l.scores,
      l.total,
    ]);
    const csv = [...(apercu ? [[libelles.previewBadge]] : []), entetes, ...lignes]
      .map((ligne) => ligne.map(cellule).join(";"))
      .join("\r\n");
    // BOM : les tableurs lisent alors les accents en UTF-8.
    const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `ofm2027-classement-${categorie}${apercu ? "-apercu-donnees-fictives" : ""}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  };

  const champ =
    "min-h-11 w-full rounded-md border border-input bg-card px-3 text-body text-card-foreground placeholder:text-muted-foreground";
  const legende = `${remplir(libelles.caption, { category: libelles[categorie] })}${apercu ? ` ${libelles.previewCaption}` : ""}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div role="tablist" aria-label={libelles.categories} className="inline-flex self-start rounded-lg border border-hairline bg-card p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              ref={(el) => {
                onglets.current[c] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-onglet-${c}`}
              aria-selected={categorie === c}
              aria-controls={`${id}-panneau`}
              tabIndex={categorie === c ? 0 : -1}
              onClick={() => choisir(c)}
              onKeyDown={naviguer}
              className="min-h-11 min-w-28 rounded-md px-5 font-semibold text-vert-profond transition-colors hover:bg-nav-survol aria-selected:bg-vert-profond aria-selected:text-blanc dark:text-primary dark:aria-selected:bg-primary dark:aria-selected:text-primary-foreground"
            >
              {libelles[c]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:w-[36rem]">
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium">{libelles.searchLabel}</span>
            <span className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={recherche}
                onChange={(event) => {
                  setRecherche(event.target.value);
                  setPage(1);
                }}
                placeholder={libelles.searchPlaceholder}
                className={`${champ} pl-9`}
              />
            </span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium">{libelles.countryLabel}</span>
            <select
              value={pays}
              onChange={(event) => {
                setPays(event.target.value);
                setPage(1);
              }}
              className={champ}
            >
              <option value="">{libelles.allCountries}</option>
              {options.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.nom}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div id={`${id}-panneau`} role="tabpanel" aria-labelledby={`${id}-onglet-${categorie}`} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p aria-live="polite" className="text-small text-muted-foreground tabular-nums">
            {libelles.compte[filtrees.length] ?? filtrees.length}
          </p>
          {classements[categorie].length > 0 && (
            <button
              type="button"
              onClick={telecharger}
              className="inline-flex min-h-11 items-center gap-2 font-medium text-vert-profond underline decoration-1 underline-offset-4 hover:decoration-2 dark:text-primary"
            >
              <Download aria-hidden className="size-4 shrink-0" />
              {libelles.download}
            </button>
          )}
        </div>

        {filtrees.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-hairline bg-card px-6 py-10 text-center shadow-soft">
            <p className="text-body font-medium">{libelles.noMatch}</p>
            {filtresActifs && (
              <button
                type="button"
                onClick={() => {
                  setRecherche("");
                  setPays("");
                  setPage(1);
                }}
                className="inline-flex min-h-11 items-center font-medium text-vert-profond underline decoration-1 underline-offset-4 hover:decoration-2 dark:text-primary"
              >
                {libelles.resetFilters}
              </button>
            )}
          </div>
        ) : (
          // Le tableau défile seul sur petit écran ; la zone prend le focus pour le défilement au clavier.
          <div
            role="region"
            aria-labelledby={`${id}-legende`}
            tabIndex={0}
            className="overflow-x-auto rounded-md border border-hairline bg-card shadow-soft"
          >
            <table className="w-full min-w-[46rem] border-collapse text-left text-body tabular-nums">
              <caption id={`${id}-legende`} className="sr-only">
                {legende}
              </caption>
              <thead className="bg-vert-profond text-blanc">
                <tr>
                  <th scope="col" className="px-3 py-3 text-center text-small font-semibold">{libelles.colRank}</th>
                  <th scope="col" className="px-3 py-3 text-small font-semibold">{libelles.colAward}</th>
                  <th scope="col" className="px-3 py-3 text-small font-semibold">{libelles.colParticipant}</th>
                  <th scope="col" className="px-3 py-3 text-small font-semibold">{libelles.colCountry}</th>
                  {PROBLEMES.map((n) => (
                    <th key={n} scope="col" className="w-12 px-2 py-3 text-right text-small font-semibold">
                      <abbr title={remplir(libelles.colProblemLong, { n })} className="no-underline">
                        {remplir(libelles.colProblem, { n })}
                      </abbr>
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3 text-right text-small font-semibold">{libelles.colTotal}</th>
                </tr>
              </thead>
              <tbody>
                {courante.lignes.map((ligne) => (
                  <tr
                    key={`${ligne.name}-${ligne.countryCode}`}
                    className="border-t border-border bg-blanc even:bg-ivoire dark:bg-entete-fond dark:even:bg-card"
                  >
                    <td className="px-3 py-2.5 text-center font-semibold">{ligne.rank}</td>
                    <td className="px-3 py-2.5">
                      <Badge distinction={ligne.award} libelles={libelles} />
                    </td>
                    <th scope="row" className="px-3 py-2.5 font-medium whitespace-nowrap">{ligne.name}</th>
                    <td className="px-3 py-2.5">
                      {apercu ? (
                        <span className="whitespace-nowrap text-muted-foreground">{libelles.countryPlaceholder}</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <Flag countryCode={ligne.countryCode} size={20} className="border border-border" />
                          {nomsPays[ligne.countryCode] ?? ligne.countryCode}
                        </span>
                      )}
                    </td>
                    {ligne.scores.map((points, i) => (
                      <td key={i} className="px-2 py-2.5 text-right">{points}</td>
                    ))}
                    <td className="px-3 py-2.5 text-right font-bold text-vert-profond dark:text-primary">{ligne.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-muted-foreground">
            {libelles.legend}
            <span className="md:hidden"> {libelles.scrollHint}</span>
          </p>
          {courante.pages > 1 && (
            <nav aria-label={libelles.paginationLabel} className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setPage(courante.page - 1)}
                disabled={courante.page === 1}
                aria-label={libelles.previous}
                className="inline-flex size-11 items-center justify-center rounded-md border border-hairline bg-card text-vert-profond hover:bg-nav-survol disabled:cursor-not-allowed disabled:opacity-40 dark:text-primary"
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <span aria-live="polite" className="min-w-28 text-center text-small tabular-nums">
                {remplir(libelles.pageOf, { page: courante.page, pages: courante.pages })}
              </span>
              <button
                type="button"
                onClick={() => setPage(courante.page + 1)}
                disabled={courante.page === courante.pages}
                aria-label={libelles.next}
                className="inline-flex size-11 items-center justify-center rounded-md border border-hairline bg-card text-vert-profond hover:bg-nav-survol disabled:cursor-not-allowed disabled:opacity-40 dark:text-primary"
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
