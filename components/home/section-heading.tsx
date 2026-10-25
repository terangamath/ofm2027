import { sansVeuve } from "@/lib/typographie";
interface SectionHeadingProps {
  title: string;
  lead?: string;
  align?: "left" | "center";
}

/**
 * Titre de section : le titre porte seul la hiérarchie, sans eyebrow.
 * Couleurs par rôles : elles suivent la surface et le thème.
 */
export function SectionHeading({ title, lead, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "items-start text-left"}`}
    >
      <h2 className="text-h2 text-foreground">{sansVeuve(title)}</h2>
      {lead && (
        <p className={`text-body-l text-muted-foreground ${centered ? "max-w-2xl" : "max-w-xl"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
