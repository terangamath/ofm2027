import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { getProgramme } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { ProgramEvent } from "@/types/content";

export const metadata: Metadata = {
  title: "Programme",
  description: "Calendrier et programme détaillé de l'OFM 2027 au Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

// ── Design par type ────────────────────────────────────────────────────────────

type EventType = "competition" | "ceremonie" | "logistique" | "culturel";

const TYPE_META: Record<EventType, {
  label:      string;
  badge:      string;   // classes pour le pill badge
  bar:        string;   // classe border-l couleur
  dot:        string;   // couleur du point de timeline
}> = {
  competition: {
    label: "Compétition",
    badge: "bg-vert/10 text-vert border-vert/20",
    bar:   "border-vert",
    dot:   "bg-vert",
  },
  ceremonie: {
    label: "Cérémonie",
    badge: "bg-or/12 text-or border-or/25",
    bar:   "border-or",
    dot:   "bg-or",
  },
  logistique: {
    label: "Logistique",
    badge: "bg-gray-50 text-gris border-gray-200",
    bar:   "border-gray-300",
    dot:   "bg-gray-300",
  },
  culturel: {
    label: "Culturel",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    bar:   "border-blue-400",
    dot:   "bg-blue-400",
  },
};

function getMeta(type: string) {
  return TYPE_META[type as EventType] ?? TYPE_META.logistique;
}

// ── Formatage ─────────────────────────────────────────────────────────────────

function fmtWeekday(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long" });
}
function fmtDay(iso: string) {
  return new Date(`${iso}T12:00:00`).getDate().toString();
}
function fmtMonth(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { month: "short" });
}
function fmtYear(iso: string) {
  return new Date(`${iso}T12:00:00`).getFullYear().toString();
}
function fmtMonthLong(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// Détecte le type dominant d'une journée (pour la couleur du dot)
function dominantType(events: ProgramEvent[]): string {
  if (events.some((e) => e.type === "ceremonie"))  return "ceremonie";
  if (events.some((e) => e.type === "competition")) return "competition";
  if (events.some((e) => e.type === "culturel"))   return "culturel";
  return "logistique";
}

export default async function ProgrammePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const events = getProgramme();

  // Grouper par date (préservant l'ordre trié)
  const grouped: [string, ProgramEvent[]][] = [];
  const seen = new Set<string>();
  for (const evt of events) {
    if (!seen.has(evt.date)) {
      seen.add(evt.date);
      grouped.push([evt.date, []]);
    }
    (grouped.find(([d]) => d === evt.date)![1] as ProgramEvent[]).push(evt);
  }

  // Séparer en deux phases
  const preEvent  = grouped.filter(([d]) => !d.startsWith("2027-07"));
  const eventWeek = grouped.filter(([d]) =>  d.startsWith("2027-07"));

  const totalEvents = events.length;
  const competitionDays = new Set(events.filter(e => e.type === "competition").map(e => e.date)).size;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-vert overflow-hidden"
        style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
        aria-label="Programme OFM 2027"
      >
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
            items={[{ label: "Programme" }]}
            className="!px-0 text-white/40 mb-8"
          />

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 xl:gap-16 items-end">
            {/* Gauche */}
            <div className="max-w-[540px]">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-5 h-px bg-or" aria-hidden="true" />
                <span className="type-label text-or">OFM 2027 · Calendrier</span>
              </div>
              <h1 className="type-h1 text-blanc mb-5">
                Programme
                <br /><span className="text-or">officiel</span>
              </h1>
              <p className="type-body text-white/65 max-w-[48ch]">
                Jalons, épreuves et cérémonies de l'OFM 2027.
                Horaires et lieux définitifs à confirmer.
              </p>
            </div>

            {/* Droite — chiffres clés */}
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
                  <span className="type-label text-white/45">Aperçu · OFM 2027</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {[
                    { icon: Calendar, label: "Semaine principale",  value: "13 – 19 juillet 2027" },
                    { icon: MapPin,   label: "Lieu",                value: "Dakar, Sénégal" },
                    { icon: Clock,    label: "Jours de compétition",value: `${competitionDays} jours d'épreuves` },
                    { icon: Calendar, label: "Événements au total", value: `${totalEvents} dans le calendrier` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-5 py-3.5 flex items-start gap-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.18)" }}
                      >
                        <Icon className="w-3.5 h-3.5 text-or" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="type-label text-white/35 mb-1">{label}</p>
                        <p className="text-blanc text-sm font-semibold leading-snug">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <Section bg="sable">
        <div className="max-w-2xl mx-auto">

          {/* ── Phase 1 : pré-événement ─────────────────────────────────── */}
          {preEvent.length > 0 && (
            <div className="mb-14">
              <PhaseLabel
                label="Étapes pré-événement"
                sub="Inscriptions et démarches administratives"
              />
              <Timeline groups={preEvent} />
            </div>
          )}

          {/* ── Phase 2 : semaine OFM ───────────────────────────────────── */}
          {eventWeek.length > 0 && (
            <div>
              <PhaseLabel
                label="Semaine OFM 2027 · Dakar"
                sub="13 – 19 juillet 2027"
                accent
              />
              <Timeline groups={eventWeek} />
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

/* ── Label de phase ────────────────────────────────────────────────────────── */
function PhaseLabel({ label, sub, accent = false }: { label: string; sub: string; accent?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 mb-8 pb-4 border-b",
      accent ? "border-or/20" : "border-gray-200"
    )}>
      <div>
        <p className={cn("type-label mb-0.5", accent ? "text-or" : "text-gris/50")}>{label}</p>
        <p className="text-xs text-gris/40">{sub}</p>
      </div>
      <div className={cn("flex-1 h-px", accent ? "bg-or/20" : "bg-gray-200")} aria-hidden="true" />
    </div>
  );
}

/* ── Timeline ──────────────────────────────────────────────────────────────── */
function Timeline({ groups }: { groups: [string, ProgramEvent[]][] }) {
  return (
    <div className="relative">
      {/* Ligne verticale */}
      <div
        className="absolute left-5 top-3 bottom-3 w-px bg-gray-200"
        aria-hidden="true"
      />

      <div className="space-y-10">
        {groups.map(([date, dayEvents]) => {
          const dom = dominantType(dayEvents);
          const meta = getMeta(dom);

          return (
            <div key={date} className="relative">
              {/* En-tête du jour */}
              <div className="flex items-center gap-4 mb-5">
                {/* Dot sur la ligne */}
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex flex-col items-center justify-center flex-shrink-0 shadow-sm border-2 border-blanc",
                    meta.dot
                  )}
                >
                  <span className="text-blanc font-bold text-[11px] leading-none">
                    {fmtDay(date)}
                  </span>
                  <span className="text-blanc/75 text-[8px] leading-none uppercase tracking-wide mt-0.5">
                    {fmtMonth(date)}
                  </span>
                </div>

                {/* Libellé date */}
                <div>
                  <p className="font-semibold text-anthracite capitalize leading-tight">
                    {fmtWeekday(date)}
                  </p>
                  <p className="type-label text-gris/50 capitalize">
                    {fmtMonthLong(date)}
                  </p>
                </div>
              </div>

              {/* Événements du jour — indentés */}
              <div className="ml-14 space-y-3">
                {dayEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Carte événement ───────────────────────────────────────────────────────── */
function EventCard({ event }: { event: ProgramEvent }) {
  const meta = getMeta(event.type);
  const isPlaceholder = (s?: string) => s?.startsWith("[");

  return (
    <div
      className={cn(
        "bg-blanc rounded-xl border border-gray-100 border-l-4 shadow-sm",
        "hover:shadow-lg hover:-translate-y-px transition-all duration-200",
        meta.bar
      )}
    >
      <div className="p-5">
        {/* Ligne 1 : badge + heure */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full type-label border",
              meta.badge
            )}
          >
            {meta.label}
          </span>

          {event.time && (
            <div className="flex-shrink-0 text-right">
              <p className="font-mono text-sm font-bold text-anthracite leading-none">
                {event.time}
              </p>
              {event.endTime && (
                <p className="font-mono text-[11px] text-gris/50 leading-none mt-0.5">
                  → {event.endTime}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-base font-bold text-anthracite leading-snug mb-1.5">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="type-body-sm text-gris leading-relaxed mb-2">
            {event.description}
          </p>
        )}

        {/* Lieu */}
        {event.location && (
          <p className={cn(
            "inline-flex items-center gap-1 type-label mt-1",
            isPlaceholder(event.location) ? "text-gris/35 italic" : "text-gris/55"
          )}>
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" aria-hidden="true" />
            {event.location}
          </p>
        )}
      </div>
    </div>
  );
}
