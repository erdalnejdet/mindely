"use client";

import Link from "next/link";
import { Brain, Heart, Activity } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tests = [
  {
    icon: Brain,
    title: "Anksiyete Testi",
    description:
      "Kaygı düzeyinizi ölçen, günlük yaşamınızda ne kadar anksiyete yaşadığınızı anlamanıza yardımcı olan profesyonel test.",
    href: "/tests/anksiyete",
  },
  {
    icon: Heart,
    title: "Depresyon Testi",
    description:
      "Depresif belirtilerinizi değerlendiren, ruh halinizi ve yaşam kalitenizi ölçen güvenilir psikolojik test.",
    href: "/tests/depresyon",
  },
  {
    icon: Activity,
    title: "Stres Testi",
    description:
      "Stres düzeyinizi değerlendiren, günlük yaşamınızdaki stres faktörlerini anlamanıza yardımcı olan test.",
    href: "/tests/stres",
  },
];

export function PsychologicalTestsPreview() {
  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Psikolojik Testler
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Psikolojik durumunuzu anlamak için en güvenilir testlerimizi ücretsiz
            olarak yapabilirsiniz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test.title}
              className="flex flex-col rounded-2xl bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <test.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{test.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {test.description}
              </p>
              <Link
                href={test.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-4 w-full justify-center rounded-full"
                )}
              >
                Testi Çöz
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/tests"
            className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}
          >
            Psikolojik Check Up
          </Link>
        </div>
      </div>
    </section>
  );
}
