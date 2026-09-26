import type { EventInfo, Locale } from "@/content/types";
import { instantDepuisHeureMurale, isoAvecDecalage } from "@/lib/fuseaux";
import { urlAbsolue, urlImagePartage } from "@/lib/seo";

const TERANGAMATH = "https://www.terangamath.org/";

/**
 * Données structurées de l'accueil : l'Olympiade (`Event`, entièrement en ligne,
 * donc `OnlineEventAttendanceMode` et une `VirtualLocation`) et son organisateur
 * (`Organization` Terangamath). Dates en ISO 8601 à l'heure de Dakar, décalage explicite :
 * début = début de l'épreuve (event.json, `exam`), fin = fin de la journée de correction.
 */
export function EventJsonLd({ event, locale }: { event: EventInfo; locale: Locale }) {
  const zone = event.exam?.referenceZone ?? "Africa/Dakar";
  const debut = event.exam
    ? new Date(event.exam.startInstant)
    : event.startDate
      ? instantDepuisHeureMurale(zone, event.startDate, "00:00")
      : null;
  const fin = event.endDate ? instantDepuisHeureMurale(zone, event.endDate, "23:59") : null;
  const accueil = urlAbsolue(locale, "/");

  const organisation = {
    "@type": "Organization",
    "@id": `${TERANGAMATH}#organisation`,
    name: event.organizer,
    url: TERANGAMATH,
    address: {
      "@type": "PostalAddress",
      addressLocality: event.city[locale],
      addressCountry: event.country[locale],
    },
  };

  const evenement = {
    "@type": "Event",
    "@id": `${urlAbsolue("fr", "/")}/#ofm2027`,
    name:
      locale === "en"
        ? "OFM 2027 — Francophone Mathematical Olympiad"
        : "OFM 2027 — Olympiade Francophone de Mathématiques",
    description:
      locale === "en"
        ? "The 2027 Francophone Mathematical Olympiad, organised by Terangamath (Senegal), entirely online."
        : "L'Olympiade Francophone de Mathématiques 2027, organisée par Terangamath (Sénégal), entièrement à distance.",
    url: accueil,
    image: [urlImagePartage(locale)],
    ...(debut ? { startDate: isoAvecDecalage(zone, debut) } : {}),
    ...(fin ? { endDate: isoAvecDecalage(zone, fin) } : {}),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: accueil },
    organizer: { "@id": organisation["@id"] },
    // Langue des épreuves (le français), pas celle de la page.
    inLanguage: "fr",
  };

  const data = { "@context": "https://schema.org", "@graph": [evenement, organisation] };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }} />
  );
}
