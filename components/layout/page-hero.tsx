import { sansVeuve } from "@/lib/typographie";
interface PageHeroProps {
  title: string;
  lead?: string;
}

/**
 * En-tête des pages internes : le titre ouvre la page sur papier.
 * Le fond sombre est réservé à l'accueil (hero et geste signature).
 */
export function PageHero({ title, lead }: PageHeroProps) {
  return (
    <section className="bg-sable pt-16 pb-12 text-anthracite lg:pt-24 lg:pb-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6">
        <h1 className="max-w-4xl text-display-l font-display text-vert">{sansVeuve(title)}</h1>
        {lead && <p className="max-w-2xl text-body-l text-encre">{lead}</p>}
        <span aria-hidden className="mt-4 block h-px w-full bg-hairline" />
      </div>
    </section>
  );
}
