import { sansVeuve } from "@/lib/typographie";
import { BandeauCouche, BandeauVertical } from "@/components/motifs/bandeau-tisse";

/**
 * Phase du bandeau tissé, page par page : même pavage, morceau différent.
 * L'accueil est en 0 ; huitièmes de période (les mentions légales et les
 * résultats prennent un seizième), tous distincts.
 */
const PHASES = {
  "/resultats": 5 / 16,
  "/olympiade": 1 / 8,
  "/organisation": 5 / 8,
  "/equipes": 3 / 8,
  "/programme": 6 / 8,
  "/problemes": 2 / 8,
  "/contact": 4 / 8,
  "/mentions-legales": 1 / 16,
} as const;

interface PageHeroProps {
  title: string;
  lead?: string;
  /** Route de la page : fixe la phase de son bandeau. */
  chemin: keyof typeof PHASES;
}

/**
 * En-tête des pages internes : le titre ouvre la page sur papier.
 * Le fond sombre est réservé à l'accueil (hero et geste signature).
 * Seul bandeau tissé de la page : vertical à droite dès la tablette, il
 * repose sur le filet or qui ferme l'en-tête, tiré sur toute la largeur pour
 * le recevoir ; sur téléphone, couché sous le hero, il remplace ce filet.
 */
export function PageHero({ title, lead, chemin }: PageHeroProps) {
  const phase = PHASES[chemin];
  // La marge basse rend l'air que les sections suivantes attendent sous le filet.
  return (
    <section className="avec-bandeau relative isolate mb-12 overflow-hidden border-hairline bg-surface text-foreground md:border-b lg:mb-16">
      <BandeauVertical phase={phase} className="absolute inset-y-0 right-0 hidden w-(--bandeau) md:block" />
      <div className="marge-bandeau mx-auto flex max-w-7xl flex-col gap-5 pt-16 pb-10 pl-6 md:pb-12 lg:pt-24 lg:pb-16">
        <h1 className="max-w-4xl text-display-l text-primary">{sansVeuve(title)}</h1>
        {lead && <p className="max-w-2xl text-body-l text-muted-foreground">{lead}</p>}
      </div>
      <BandeauCouche phase={phase} className="h-5 md:hidden" />
    </section>
  );
}
