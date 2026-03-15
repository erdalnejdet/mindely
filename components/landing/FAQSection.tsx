"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Online terapi nasıl çalışır?",
    answer:
      "Mindely üzerinden uzman seçtikten sonra uygun bir randevu saati belirleyebilirsiniz. Randevu saatinde platform üzerindeki görüşme odasına katılarak uzmanınızla online görüşme yapabilirsiniz. Tüm süreç güvenli ve gizlilik prensiplerine uygun şekilde yürütülür.",
  },
  {
    question: "Terapistimi nasıl seçebilirim?",
    answer:
      "Uzmanlar sayfasından uzmanlık alanı, deneyim ve fiyat bilgilerine göre filtreleme yapabilirsiniz. Her uzmanın detaylı profilini, uzmanlık alanlarını ve danışan yorumlarını inceleyerek size en uygun uzmanı seçebilirsiniz.",
  },
  {
    question: "Görüşmeler gizli mi?",
    answer:
      "Evet. Tüm görüşmeler şifreli bağlantılar üzerinden gerçekleştirilir. Uzmanlarımız mesleki gizlilik ilkelerine bağlıdır ve bilgileriniz kesinlikle üçüncü taraflarla paylaşılmaz.",
  },
  {
    question: "Randevumu iptal edebilir miyim?",
    answer:
      "Randevunuzu randevu saatinden en az 24 saat önce ücretsiz olarak iptal edebilir veya erteleyebilirsiniz. 24 saatten kısa süre kala yapılan iptallerde iptal politikamız geçerli olacaktır.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Sıkça Sorulan Sorular
        </h2>

        <div className="mt-12 space-y-2">
          {faqs.map((faq, index) => (
            <Collapsible
              key={index}
              open={openIndex === index}
              onOpenChange={(open) => setOpenIndex(open ? index : null)}
            >
              <div className="rounded-xl border border-border bg-background">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-foreground transition-colors hover:bg-muted/50">
                  {faq.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-border px-6 py-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}
