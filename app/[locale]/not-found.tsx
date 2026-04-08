import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sable flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-serif text-8xl font-bold text-vert/20 mb-4" aria-hidden="true">
          404
        </div>
        <h1 className="font-serif text-2xl font-bold text-anthracite mb-3">
          Page introuvable
        </h1>
        <p className="text-gris mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
          Retournez à l'accueil pour naviguer sur le site.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-vert text-blanc font-semibold rounded-xl hover:bg-vert-clair transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
