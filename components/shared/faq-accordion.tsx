import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/content/faq.json";
import type { FaqItem, Locale } from "@/content/types";

const faqItems = faqData as FaqItem[];

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
