import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BgVariant = "white" | "sable" | "vert" | "anthracite";
type SizeVariant = "sm" | "md" | "lg";

const BG: Record<BgVariant, string> = {
  white:      "bg-blanc",
  sable:      "bg-sable",
  vert:       "bg-vert",
  anthracite: "bg-anthracite",
};

const PY: Record<SizeVariant, string> = {
  sm: "section-py-sm",
  md: "section-py",
  lg: "section-py-lg",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  bg?: BgVariant;
  size?: SizeVariant;
  /** Ne pas inclure le container-main (pour les sections full-bleed) */
  noContainer?: boolean;
  /** Identifiant d'ancre */
  id?: string;
}

/**
 * Wrapper de section avec container, background et padding cohérents.
 * Toutes les sections homepage utilisent ce composant.
 */
export function Section({
  bg = "white",
  size = "md",
  noContainer = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(BG[bg], PY[size], className)}
      {...props}
    >
      {noContainer ? children : (
        <div className="container-main">{children}</div>
      )}
    </section>
  );
}
