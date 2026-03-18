"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Collapsible
          key={index}
          open={openIndex === index}
          onOpenChange={(open) => setOpenIndex(open ? index : null)}
        >
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors">
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  openIndex === index && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t px-6 py-4 text-muted-foreground">
                {item.answer}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  );
}
