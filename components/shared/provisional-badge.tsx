/** Pastille discrète signalant un contenu de catégorie B/C : structure réutilisable mais non confirmée pour 2027. */
export function ProvisionalBadge({ label }: { label: string }) {
  return (
    <span className="label inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-link">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden />
      {label}
    </span>
  );
}
