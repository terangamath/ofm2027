import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProgramme } from "@/lib/content";
import { eventTypeLabels, eventTypeColors, cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import type { ProgramEvent } from "@/types/content";

export const metadata: Metadata = {
  title: "Programme",
  description: "Calendrier et programme détaillé de l'OFM 2027 au Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProgrammePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const events = getProgramme();

  // Grouper par date
  const grouped = events.reduce<Record<string, ProgramEvent[]>>((acc, evt) => {
    const key = evt.date;
    if (!acc[key]) acc[key] = [];
    (acc[key] as ProgramEvent[]).push(evt);
    return acc;
  }, {});

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Programme" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Programme"
            sousTitre="Retrouvez les jalons importants et le programme détaillé de l'OFM 2027. [Horaires et lieux à confirmer]"
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main max-w-3xl">
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, dayEvents]) => (
              <div key={date}>
                {/* Date */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-vert rounded-xl px-4 py-2 text-center text-blanc min-w-[80px]">
                    <div className="text-xs font-semibold opacity-70 uppercase">
                      {new Date(date).toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                    <div className="font-serif text-xl font-bold leading-none">
                      {new Date(date).getDate()}
                    </div>
                    <div className="text-xs opacity-70">
                      {new Date(date).getFullYear()}
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
                  <p className="text-sm text-gris">
                    {new Date(date).toLocaleDateString("fr-FR", { weekday: "long" })}
                  </p>
                </div>

                {/* Événements du jour */}
                <div className="ml-0 sm:ml-20 space-y-3">
                  {dayEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EventCard({ event }: { event: ProgramEvent }) {
  const typeColor = eventTypeColors[event.type] ?? "bg-gray-100 text-gris border-gray-200";
  const typeLabel = eventTypeLabels[event.type] ?? event.type;

  return (
    <div className="bg-blanc rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Horaire */}
        {event.time && (
          <div className="flex-shrink-0 text-center min-w-[60px]">
            <p className="font-mono text-sm font-semibold text-anthracite">{event.time}</p>
            {event.endTime && (
              <p className="font-mono text-xs text-gris">{event.endTime}</p>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                typeColor
              )}
            >
              {typeLabel}
            </span>
          </div>
          <h3 className="font-semibold text-anthracite leading-tight">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-gris mt-1 leading-relaxed">{event.description}</p>
          )}
          {event.location && (
            <p className="text-xs text-gris mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {event.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
