import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Locale } from "@/content/types";
import { faq as faqItems } from "@/lib/contenu";

export function FaqAccordion({ locale }: { locale: Locale }) {
  return (
    <Accordion>
      {faqItems.map((item, index) => (
        <AccordionItem key={item.question.fr} value={`faq-${index}`}>
          <AccordionTrigger className="text-body-l font-medium">
            {item.question[locale]}
          </AccordionTrigger>
          <AccordionContent className="text-body text-muted-foreground">
            {item.answer[locale]}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
