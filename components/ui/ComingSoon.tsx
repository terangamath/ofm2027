import Link from "next/link";
import { Clock } from "lucide-react";

interface ComingSoonBlockProps {
  label?: string;
  description?: string;
  showLink?: boolean;
}

/** Bloc affiché pour les contenus non encore publiés */
export function ComingSoonBlock({
  label = "Bientôt disponible",
  description = "Ce contenu sera publié prochainement. Revenez bientôt ou suivez-nous sur les réseaux sociaux.",
  showLink = false,
}: ComingSoonBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-or-pale flex items-center justify-center mb-4">
        <Clock className="w-6 h-6 text-or" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-xl font-bold text-anthracite mb-2">{label}</h3>
      <p className="text-gris max-w-md text-sm leading-relaxed">{description}</p>
      {showLink && (
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      )}
    </div>
  );
}

/** Ligne "à venir" pour les listes */
export function ComingSoonRow({ label = "À venir" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-gris text-sm">
      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
