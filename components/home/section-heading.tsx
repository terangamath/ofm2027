import { sansVeuve } from "@/lib/typographie";
interface SectionHeadingProps {
  title: string;
  lead?: string;
  align?: "left" | "center";
  /**
   * default = fond adaptatif (bg-background/bg-card), texte sémantique.
   * inverted = fond sombre fixe (vert-nuit), texte ivoire.
   * warm = fond clair fixe (sable), texte anthracite — indépendant du thème.
   */
  tone?: "default" | "inverted" | "warm";
}

const TONE_STYLES = {
  default: { title: "text-foreground", lead: "text-muted-foreground" },
  inverted: { title: "text-ivoire", lead: "text-ivoire/75" },
  warm: { title: "text-anthracite", lead: "text-encre" },
} as const;

/** Titre de section : le titre porte seul la hiérarchie, sans eyebrow. */
export function SectionHeading({
  title,
  lead,
  align = "left",
  tone = "default",
}: SectionHeadingProps) {
  const centered = align === "center";
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "items-start text-left"}`}
    >
      <h2 className={`text-h2 font-display ${styles.title}`}>{sansVeuve(title)}</h2>
      {lead && (
        <p className={`text-body-l ${styles.lead} ${centered ? "max-w-2xl" : "max-w-xl"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
