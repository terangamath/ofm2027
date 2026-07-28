import { IsometricGrid } from "@/components/motifs/isometric-grid";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
}

/** En-tête signature des pages internes : bande vert-nuit + grille isométrique. */
export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-vert-nuit py-20 text-ivoire lg:py-28">
      <IsometricGrid className="pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-6">
        <p className="label-mono text-or-clair">{eyebrow}</p>
        <h1 className="max-w-3xl text-display-l font-display">{title}</h1>
        {lead && <p className="max-w-2xl text-body-l text-ivoire/75">{lead}</p>}
      </div>
    </section>
  );
}
