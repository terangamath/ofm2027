import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/home/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/content/faq.json";
import type { FaqItem, Locale } from "@/content/types";

const faqItems = faqData as FaqItem[];

export async function FaqSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home.Faq" });

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} align="center" />

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
      </div>
    </section>
  );
}
