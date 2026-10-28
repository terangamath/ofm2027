import type { ReactNode } from "react";

/**
 * En-tête resserré des pages internes qui doivent montrer vite leur contenu
 * (Organisation, Résultats) : titre vert, filet or, sous-titre, fond clair.
 * `decor` reçoit un motif décoratif, posé sous le texte.
 */
export function IntroCompacte({ title, lead, decor }: { title: string; lead: string; decor?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-entete-fond text-foreground">
      {decor}
      <div className="mx-auto flex max-w-[75rem] flex-col gap-3 px-4 py-8 sm:px-6 lg:py-10">
        <h1 className="text-[clamp(1.875rem,1.5rem+1.5vw,2.75rem)] leading-tight font-bold text-vert-profond dark:text-primary">
          {title}
        </h1>
        <span aria-hidden className="h-0.5 w-12 bg-accent" />
        <p className="max-w-xl text-body-l text-muted-foreground">{lead}</p>
      </div>
    </section>
  );
}
