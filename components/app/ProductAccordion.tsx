"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableText } from "next-sanity";
import { Badge } from "@/components/ui/badge";

interface ProductAccordionProps {
  content: any[] | null; // Portable Text
  benefits: string[] | null;
  dosage: string | null;
  allergens: string | null;
  certifications: string[] | null;
}

export function ProductAccordion({
  content,
  benefits,
  dosage,
  allergens,
  certifications,
}: ProductAccordionProps) {
  // Check if we have any content to display
  const hasContent = content && content.length > 0;
  const hasBenefits = benefits && benefits.length > 0;
  const hasDosage = !!dosage;
  const hasAllergens = !!allergens;
  const hasCertifications = certifications && certifications.length > 0;

  if (!hasContent && !hasBenefits && !hasDosage && !hasAllergens && !hasCertifications) {
    return null;
  }

  return (
    <div className="w-full">
      <Accordion type="single" defaultValue="description" collapsible className="w-full">
        {/* Description - Open by default */}
        {hasContent && (
          <AccordionItem value="description" className="border-border">
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
              📖 Description
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-invert max-w-none text-muted-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground [&_a]:text-dodo-yellow">
                <PortableText value={content} />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Benefits */}
        {hasBenefits && (
          <AccordionItem value="benefits" className="border-border">
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
              🎯 Bénéfices Clés
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Mode d'Emploi */}
        {(hasDosage || hasAllergens) && (
          <AccordionItem value="usage" className="border-border">
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
              📋 Mode d'Emploi
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {hasDosage && (
                  <div>
                    <h4 className="mb-2 font-medium text-foreground">
                      Posologie recommandée
                    </h4>
                    <p className="text-muted-foreground">{dosage}</p>
                  </div>
                )}
                {hasAllergens && (
                  <div>
                    <h4 className="mb-2 font-medium text-foreground">
                      Allergènes & Précautions
                    </h4>
                    <p className="text-muted-foreground">{allergens}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <AccordionItem value="certifications" className="border-border">
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
              🏆 Certifications & Garantie
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
