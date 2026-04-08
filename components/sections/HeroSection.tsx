import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-vert"
      aria-label="Présentation OFM 2027"
    >
      {/* Texture décorative */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #c9a84c 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #c9a84c 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />

      {/* Motif géométrique discret */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            rgba(201, 168, 76, 0.3) 40px,
            rgba(201, 168, 76, 0.3) 41px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10 pt-28 pb-16">
        <div className="max-w-3xl">
          {/* Surtitre */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-0.5 bg-or" aria-hidden="true" />
            <p className="text-or font-semibold text-sm tracking-widest uppercase">
              {t("surtitre")}
            </p>
          </div>

          {/* Titre principal */}
          <h1 className="font-serif font-bold text-blanc leading-tight mb-6"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}>
            Olympiade Francophone
            <br />
            <span className="text-or">de Mathématiques</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
            {t("sousTitre")}
          </p>

          {/* Infos clés */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Calendar className="w-4 h-4 text-or flex-shrink-0" aria-hidden="true" />
              <span>{t("dates")}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4 text-or flex-shrink-0" aria-hidden="true" />
              <span>Sénégal, Afrique de l'Ouest</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/olympiade"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-or text-anthracite font-semibold rounded-lg hover:bg-or-clair transition-colors text-base"
            >
              {t("cta_primaire")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/informations"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-blanc font-semibold rounded-lg hover:bg-white/10 transition-colors text-base"
            >
              {t("cta_secondaire")}
            </Link>
          </div>

          {/* Tag organisateur */}
          <p className="mt-10 text-white/40 text-xs tracking-wide">
            {t("organisateur")}
          </p>
        </div>
      </div>

      {/* Vague décorative bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-sable"
        style={{
          clipPath: "ellipse(55% 100% at 50% 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
