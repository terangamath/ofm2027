"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FAQItem } from "@/types/content";

interface FAQSectionProps {
  items: FAQItem[];
  limit?: number;
  showLink?: boolean;
}

export function FAQSection({ items, limit = 4, showLink = true }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const displayed = items.slice(0, limit);

  return (
    <Section bg="white">
      <div className="grid lg:grid-cols-[260px_1fr] gap-10 xl:gap-16 items-start">

        {/* Gauche — ancre visuelle forte */}
        <div className="lg:sticky lg:top-24">
          <SectionHeading
            label="FAQ"
            title="Questions fréquentes"
            className="mb-4"
          />
          <p className="type-body-sm text-gris mb-6 max-w-[40ch]">
            Tout ce qu'il faut savoir sur l'OFM 2027 avant de participer.
          </p>
          {showLink && (
            <Link
              href="/olympiade#faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert hover:text-vert-clair transition-colors"
            >
              Toutes les questions
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Droite — accordéon */}
        <div className="space-y-2">
          {displayed.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border transition-all duration-200",
                openId === item.id
                  ? "border-vert/20 bg-vert-pale/25 shadow-sm"
                  : "border-gray-100 bg-sable hover:border-gray-200"
              )}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                aria-expanded={openId === item.id}
              >
                <span className={cn(
                  "text-sm font-semibold leading-snug transition-colors",
                  openId === item.id ? "text-vert" : "text-anthracite"
                )}>
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                    openId === item.id ? "rotate-180 text-vert" : "text-gris/40"
                  )}
                  aria-hidden="true"
                />
              </button>
              {openId === item.id && (
                <div className="px-5 pb-4 type-body-sm text-gris">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
