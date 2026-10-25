"use client";

import { useState, type ReactNode } from "react";

interface Etiquette {
  nom: string;
  x: number;
  y: number;
}

/**
 * Nom du pays sous le pointeur, ou du pays focalisé au clavier. La carte
 * elle-même est rendue côté serveur ; cet îlot ne fait que lire l'attribut
 * `data-nom` des tracés. L'étiquette est décorative : les liens de la carte
 * portent déjà leur nom accessible.
 */
export function CarteSurvol({ children }: { children: ReactNode }) {
  const [etiquette, setEtiquette] = useState<Etiquette | null>(null);

  const cible = (element: EventTarget | null) =>
    element instanceof Element ? element.closest<SVGElement>("[data-nom]") : null;

  return (
    <div
      className="relative"
      onPointerMove={(event) => {
        const pays = cible(event.target);
        if (!pays) return setEtiquette(null);
        const cadre = event.currentTarget.getBoundingClientRect();
        setEtiquette({ nom: pays.dataset.nom ?? "", x: event.clientX - cadre.left, y: event.clientY - cadre.top });
      }}
      onPointerLeave={() => setEtiquette(null)}
      onFocus={(event) => {
        const pays = cible(event.target);
        if (!pays) return;
        const cadre = event.currentTarget.getBoundingClientRect();
        const zone = pays.getBoundingClientRect();
        setEtiquette({ nom: pays.dataset.nom ?? "", x: zone.left + zone.width / 2 - cadre.left, y: zone.top - cadre.top });
      }}
      onBlur={() => setEtiquette(null)}
    >
      {children}
      {etiquette && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.5rem)] rounded-md bg-ivoire px-2.5 py-1 text-small font-semibold whitespace-nowrap text-vert-profond shadow-soft"
          style={{ left: etiquette.x, top: etiquette.y }}
        >
          {etiquette.nom}
        </span>
      )}
    </div>
  );
}
