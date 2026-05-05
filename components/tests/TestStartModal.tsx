"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TESTS } from "@/lib/data/tests";

type TestStartModalProps = {
  slug: string;
};

export function TestStartModal({ slug }: TestStartModalProps) {
  const test = TESTS[slug];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const total = test?.questions.length ?? 0;
  const current = test?.questions[index];
  const selected = answers[index];
  const isFinished = total > 0 && index >= total;

  const score = useMemo(() => answers.reduce((sum, n) => sum + n, 0), [answers]);
  const result = useMemo(() => {
    if (score <= 13) return "Dusuk";
    if (score <= 27) return "Orta";
    return "Yuksek";
  }, [score]);

  if (!test) return null;

  const selectOption = (optionIndex: number) => {
    const next = [...answers];
    next[index] = optionIndex;
    setAnswers(next);
  };

  const nextQuestion = () => {
    if (index < total) setIndex((i) => i + 1);
  };

  const prevQuestion = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const reset = () => {
    setIndex(0);
    setAnswers([]);
  };

  return (
    <>
      <Button size="lg" className="mt-8 w-full rounded-xl" onClick={() => setOpen(true)}>
        Testi Baslat
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="mx-auto max-h-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{test.title}</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isFinished ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Soru {index + 1} / {total}
                </p>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${((index + 1) / total) * 100}%` }}
                  />
                </div>

                <p className="text-lg font-medium">{current?.prompt}</p>
                <div className="space-y-2">
                  {current?.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectOption(optionIndex)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                        selected === optionIndex ? "border-primary bg-primary/5" : "hover:border-primary/40",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" onClick={prevQuestion} disabled={index === 0}>
                    Geri
                  </Button>
                  <Button onClick={nextQuestion} disabled={selected === undefined}>
                    {index + 1 === total ? "Sonucu Gor" : "Ileri"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h4 className="text-2xl font-semibold">Test Sonucu</h4>
                <div className="rounded-xl border bg-emerald-50 p-5">
                  <p className="text-sm text-muted-foreground">Toplam Puan</p>
                  <p className="text-3xl font-bold text-primary">{score}</p>
                  <p className="mt-2 text-sm">
                    Seviye: <span className="font-semibold">{result}</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bu sonuç tanı koydurmaz. Detaylı değerlendirme için bir psikologla görüşmenizi öneririz.
                </p>
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={reset}>
                    Testi Tekrar Coz
                  </Button>
                  <Button onClick={() => setOpen(false)}>Kapat</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
