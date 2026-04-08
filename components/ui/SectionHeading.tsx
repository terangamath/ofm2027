import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Petit surtitre (uppercase, couleur or) */
  label?: string;
  /** Titre principal H2 */
  title: string;
  /** Texte de description optionnel */
  description?: string;
  /** Alignement */
  align?: "left" | "center";
  /** Mode clair (sur fond sombre) */
  light?: boolean;
  /** Largeur max du titre — restreint si besoin */
  titleWidth?: string;
  className?: string;
}

/**
 * En-tête de section unifiée.
 * Applique l'échelle typographique du design system.
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  light = false,
  titleWidth,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn(isCenter && "text-center", className)}>
      {label && (
        <p className={cn(
          "type-label mb-3",
          light ? "text-or-clair" : "text-or"
        )}>
          {label}
        </p>
      )}
      <h2
        className={cn(
          "type-h2",
          light ? "text-blanc" : "text-anthracite",
          titleWidth
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn(
          "type-body mt-4 max-w-[60ch]",
          isCenter && "mx-auto",
          light ? "text-white/65" : "text-gris"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
