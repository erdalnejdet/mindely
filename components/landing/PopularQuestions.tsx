"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const questions = [
  "Depresyonda mıyım?",
  "Anksiyete miyim?",
  "En iyi psikologlar",
  "Psikolog fiyatları",
  "Terapist nasıl seçilir?",
  "Online terapi güvenli mi?",
  "İlk terapi seansında neler olur?",
  "Terapi ne kadar sürer?",
];

export function PopularQuestions() {
  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            En Çok Sorgulananlar
          </h2>
          <p className="mt-4 text-muted-foreground">
            Merak ettiğiniz soruların cevaplarına ulaşın.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {questions.map((question) => (
            <Link
              key={question}
              href={`/blog?q=${encodeURIComponent(question)}`}
              className="flex items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
            >
              {question}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sss"
            className="text-sm font-medium text-primary hover:underline"
          >
            Tüm soruların cevaplarına ulaşmak için tıklayın
          </Link>
        </div>
      </div>
    </section>
  );
}
