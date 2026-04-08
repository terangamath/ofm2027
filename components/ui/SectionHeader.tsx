import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  surtitre?: string;
  titre: string;
  sousTitre?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}

/** En-tête de section réutilisable avec surtitre, titre et sous-titre */
export function SectionHeader({
  surtitre,
  titre,
  sousTitre,
  center = false,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      {surtitre && (
        <p
          className={cn(
            "text-sm font-semibold tracking-widest uppercase mb-3",
            light ? "text-or-clair" : "text-or"
          )}
        >
          {surtitre}
        </p>
      )}
      <h2
        className={cn(
          "font-serif font-bold leading-tight",
          light ? "text-blanc" : "text-anthracite"
        )}
      >
        {titre}
      </h2>
      {sousTitre && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed max-w-2xl",
            center && "mx-auto",
            light ? "text-white/80" : "text-gris"
          )}
        >
          {sousTitre}
        </p>
      )}
    </div>
  );
}
