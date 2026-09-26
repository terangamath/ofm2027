import { notFound } from "next/navigation";

/**
 * Toute adresse inconnue sous une locale aboutit ici, pour afficher la 404
 * traduite (app/[locale]/not-found.tsx) plutôt que la page par défaut de Next.js.
 */
export default function CatchAllPage() {
  notFound();
}
