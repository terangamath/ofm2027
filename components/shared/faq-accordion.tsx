import { ChevronDownIcon } from "lucide-react";
import { faq as faqItems } from "@/lib/contenu";
import type { Locale } from "@/content/types";

/**
 * FAQ en accordéon natif (`details`/`summary`) : aucun JavaScript, clavier et
 * lecteurs d'écran pris en charge par le navigateur. Le dépliement est animé en
 * CSS (globals.css, `.accordeon`) là où `::details-content` est interpolable ;
 * ailleurs il est instantané.
 */
export function FaqAccordion({ locale }: { locale: Locale }) {
  return (
    <div className="flex w-full flex-col">
      {faqItems.map((item) => (
        <details key={item.question.fr} className="accordeon group not-last:border-b border-border">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-body-l font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.question[locale]}</span>
            <ChevronDownIcon
              aria-hidden
              className="mt-1.5 size-4 shrink-0 text-muted-foreground transition-transform duration-[250ms] ease-[var(--ease-signature)] group-open:rotate-180"
            />
          </summary>
          <p className="pb-5 text-body text-muted-foreground">{item.answer[locale]}</p>
        </details>
      ))}
    </div>
  );
}
