import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Globe } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { getEquipes } from "@/lib/content";
import type { Country } from "@/types/content";

export const metadata: Metadata = {
  title: "Équipes participantes",
  description:
    "Découvrez les pays et délégations qui participent à l'OFM 2027 au Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

/** Extrait le code ISO 2 depuis /flags/sn.svg → "sn" */
function isoCode(flagPath: string): string {
  return flagPath.replace("/flags/", "").replace(".svg", "").toLowerCase();
}

/** URL flagcdn.com — PNG 40px de large, propre et rapide */
function flagUrl(flagPath: string, width: 20 | 40 | 80 = 40): string {
  return `https://flagcdn.com/w${width}/${isoCode(flagPath)}.png`;
}

export default async function EquipesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const equipes = getEquipes();
  const confirmes = equipes.filter((e) => e.confirmed);
  const enAttente = equipes.filter((e) => !e.confirmed);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Équipes participantes OFM 2027"
      >
        {/* Décoratifs */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(45,106,79,0.5), transparent 65%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-[45%] h-[70%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.15), transparent 60%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 50%, transparent)" }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <Breadcrumb
            items={[{ label: "Équipes" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[560px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Nations</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                {equipes.length} pays<br />
                <span className="text-or">engagés</span>
              </h1>
              <p className="type-body text-white/65 max-w-[50ch]">
                Des délégations du monde francophone représentent leurs nations
                dans cette compétition internationale de mathématiques.
              </p>
            </div>

            {/* Droite — récap drapeaux */}
            <div className="hidden lg:block">
              <div
                className="rounded-2xl overflow-hidden border border-white/[0.12]"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
                }}
              >
                <div
                  className="px-5 py-3.5 border-b border-white/[0.08]"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                >
                  <span className="type-label text-white/45">Nations participantes · OFM 2027</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-vert-pale" aria-hidden="true" />
                      <span className="text-sm text-white/60">Confirmées</span>
                    </div>
                    <span className="text-blanc font-bold text-lg">{confirmes.length}</span>
                  </div>
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-white/30" aria-hidden="true" />
                      <span className="text-sm text-white/60">En attente</span>
                    </div>
                    <span className="text-white/50 font-bold text-lg">{enAttente.length}</span>
                  </div>
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-or/70" aria-hidden="true" />
                      <span className="text-sm text-white/60">Total engagés</span>
                    </div>
                    <span className="text-or font-bold text-lg">{equipes.length}</span>
                  </div>
                </div>
                {/* Mini drapeaux des confirmés */}
                <div className="px-5 py-4 border-t border-white/[0.07]">
                  <p className="type-label text-white/30 mb-3">Délégations confirmées</p>
                  <div className="flex flex-wrap gap-1.5">
                    {confirmes.map((e) => (
                      <img
                        key={e.id}
                        src={flagUrl(e.flag, 40)}
                        alt={e.name}
                        title={e.name}
                        width={24}
                        height={16}
                        className="rounded-sm opacity-90 hover:opacity-100 transition-opacity"
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenu ──────────────────────────────────────────────────────── */}
      <Section bg="sable">
        {/* Stats pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          <div className="inline-flex items-center gap-2.5 bg-vert/10 border border-vert/20 text-vert rounded-full px-4 py-2">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-sm font-semibold">
              {confirmes.length} délégation{confirmes.length > 1 ? "s" : ""} confirmée{confirmes.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="inline-flex items-center gap-2.5 bg-blanc border border-gray-200 text-gris rounded-full px-4 py-2">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-sm font-medium">
              {enAttente.length} en attente de confirmation
            </span>
          </div>
        </div>

        {/* ── Pays confirmés ─────────────────────────────────────────────── */}
        {confirmes.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-or" aria-hidden="true" />
              <span className="type-label text-or">Confirmées</span>
            </div>
            <h2 className="type-h2 text-anthracite mb-7">Délégations confirmées</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {confirmes.map((equipe) => (
                <ConfirmedCard key={equipe.id} equipe={equipe} />
              ))}
            </div>
          </div>
        )}

        {/* ── Pays en attente ─────────────────────────────────────────────── */}
        {enAttente.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-px bg-gray-300" aria-hidden="true" />
                <span className="type-label text-gris/50">En attente</span>
              </div>
              <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
            </div>
            <h2 className="type-h2 text-gris/60 mb-7">Pays invités — confirmation à venir</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {enAttente.map((equipe) => (
                <PendingCard key={equipe.id} equipe={equipe} />
              ))}
            </div>

            <p className="mt-6 type-label text-gris/35 text-center">
              La liste définitive des délégations sera publiée prochainement
            </p>
          </div>
        )}
      </Section>
    </>
  );
}

/* ── Carte pays confirmé ─────────────────────────────────────────────────── */
function ConfirmedCard({ equipe }: { equipe: Country }) {
  return (
    <Link
      href={`/equipes/${equipe.id}`}
      className="group relative bg-blanc rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-vert/20 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
      aria-label={`Voir la délégation ${equipe.name}`}
    >
      {/* Accent top */}
      <div className="h-1 bg-vert group-hover:bg-vert-clair transition-colors duration-200" aria-hidden="true" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Drapeau */}
          <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm flex-shrink-0" style={{ width: 48, height: 36 }}>
            <img
              src={flagUrl(equipe.flag, 80)}
              alt={`Drapeau ${equipe.name}`}
              width={48}
              height={36}
              className="w-full h-full"
              style={{ objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Badge confirmé */}
          <div className="flex items-center gap-1 bg-vert/8 border border-vert/15 rounded-full px-2 py-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-vert" aria-hidden="true" />
            <span className="type-label text-vert">Confirmé</span>
          </div>
        </div>

        {/* Nom */}
        <p className="text-base font-bold text-anthracite group-hover:text-vert transition-colors duration-200 leading-tight mb-1">
          {equipe.name}
        </p>
        <p className="type-body-sm text-gris/60">Délégation OFM 2027</p>
      </div>
    </Link>
  );
}

/* ── Carte pays en attente ───────────────────────────────────────────────── */
function PendingCard({ equipe }: { equipe: Country }) {
  return (
    <div
      className="bg-blanc/60 rounded-xl border border-gray-100 p-4 flex items-center gap-3.5"
      aria-label={`${equipe.name} — confirmation en attente`}
    >
      {/* Drapeau désaturé */}
      <div
        className="rounded-md overflow-hidden border border-gray-100 flex-shrink-0"
        style={{ width: 36, height: 27 }}
      >
        <img
          src={flagUrl(equipe.flag, 40)}
          alt={`Drapeau ${equipe.name}`}
          width={36}
          height={27}
          className="w-full h-full"
          style={{ objectFit: "cover", display: "block", filter: "saturate(0.4) opacity(0.7)" }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gris/70 truncate leading-tight">{equipe.name}</p>
        <p className="type-label text-gris/35 mt-0.5">Confirmation à venir</p>
      </div>
      <Clock className="w-3.5 h-3.5 text-gray-200 flex-shrink-0" aria-hidden="true" />
    </div>
  );
}
