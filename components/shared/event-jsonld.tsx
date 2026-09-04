import { SITE_URL } from "@/lib/site";
import type { EventInfo, Locale } from "@/content/types";

/**
 * JSON-LD schema.org/Event. `OnlineEventAttendanceMode` + `VirtualLocation` reflètent
 * le format 100 % à distance : aucune adresse physique n'est déclarée (cohérence §2.4).
 */
export function EventJsonLd({ event, locale }: { event: EventInfo; locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "OFM 2027 — Olympiade Francophone de Mathématiques",
    description:
      locale === "en"
        ? "The 2027 Francophone Mathematical Olympiad, organised by Terangamath (Senegal), entirely online."
        : "L'Olympiade Francophone de Mathématiques 2027, organisée par Terangamath (Sénégal), entièrement à distance.",
    ...(event.startDate ? { startDate: event.startDate } : {}),
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: SITE_URL,
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      url: "https://terangamath.org",
    },
    inLanguage: locale,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
