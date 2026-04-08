import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";

export function CTASection() {
  return (
    <Section bg="vert" size="sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="type-label text-or mb-2">Ne manquez rien</p>
          <h2 className="type-h2 text-blanc">Suivez l'OFM 2027</h2>
          <p className="type-body-sm text-white/55 mt-1.5 max-w-[48ch]">
            Équipes, problèmes, résultats — toutes les mises à jour sur ce site officiel.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-or text-anthracite font-semibold rounded-lg hover:bg-or-clair transition-colors text-sm"
          >
            Actualités
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-blanc font-medium rounded-lg hover:bg-white/8 transition-colors text-sm"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </Section>
  );
}
