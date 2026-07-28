interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  /**
   * default = fond adaptatif (bg-background/bg-card), texte sémantique.
   * inverted = fond sombre fixe (vert-nuit/vert), texte ivoire.
   * warm = fond clair fixe (sable), texte anthracite — indépendant du thème.
   */
  tone?: "default" | "inverted" | "warm";
}

const TONE_STYLES = {
  default: {
    eyebrow: "text-link",
    title: "text-foreground",
    lead: "text-muted-foreground",
  },
  inverted: {
    eyebrow: "text-or-clair",
    title: "text-ivoire",
    lead: "text-ivoire/75",
  },
  warm: {
    eyebrow: "text-vert",
    title: "text-anthracite",
    lead: "text-gris",
  },
} as const;

export function SectionHeading({
  eyebrow,
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
      <p className={`label-mono ${styles.eyebrow}`}>{eyebrow}</p>
      <h2 className={`text-h2 font-display ${styles.title}`}>{title}</h2>
      {lead && (
        <p className={`text-body-l ${styles.lead} ${centered ? "max-w-2xl" : "max-w-xl"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
