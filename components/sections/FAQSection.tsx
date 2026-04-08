"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types/content";

interface FAQSectionProps {
  items: FAQItem[];
  limit?: number;
  showLink?: boolean;
}

export function FAQSection({ items, limit = 5, showLink = true }: FAQSectionProps) {
  const t = useTranslations("sections");
  const [openId, setOpenId] = useState<string | null>(null);

  const displayed = items.slice(0, limit);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section-padding bg-blanc">
      <div className="container-main">
        <SectionHeader
          surtitre={t("faq")}
          titre="Questions fréquentes"
          center
          className="mb-10"
        />

        <div className="max-w-2xl mx-auto space-y-3">
          {displayed.map((item) => (
            <FAQAccordion
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        {showLink && (
          <div className="mt-8 text-center">
            <Link
              href="/olympiade#faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-vert hover:text-vert-clair transition-colors"
            >
              Voir toutes les questions →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isOpen
          ? "border-vert/30 bg-vert-pale/30 shadow-sm"
          : "border-gray-100 bg-blanc hover:border-gray-200"
      )}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <span className={cn("font-semibold text-sm leading-snug transition-colors", isOpen ? "text-vert" : "text-anthracite")}>
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180 text-vert" : "text-gris"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          className="px-5 pb-5 text-sm text-gris leading-relaxed"
        >
          {item.answer}
        </div>
      )}
    </div>
  );
}
