import { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { ClipboardList, Brain, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Psikolojik Testler",
  description:
    "Anksiyete, depresyon, stres ve daha fazlası için ücretsiz psikolojik testler. Kendinizi daha iyi tanıyın.",
};

const tests = [
  {
    slug: "anksiyete-testi",
    title: "Anksiyete Testi",
    description:
      "Kaygı düzeyinizi ölçen, günlük yaşamınızda ne kadar anksiyete yaşadığınızı anlamanıza yardımcı olan profesyonel test.",
    icon: Brain,
    duration: "5-10 dk",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    slug: "depresyon-testi",
    title: "Depresyon Testi",
    description:
      "Depresif belirtilerinizi değerlendiren, ruh halinizi ve yaşam kalitenizi ölçen güvenilir psikolojik test.",
    icon: Heart,
    duration: "5-10 dk",
    color: "bg-rose-50 text-rose-700",
  },
  {
    slug: "stres-testi",
    title: "Stres Testi",
    description:
      "Stres düzeyinizi değerlendiren ve başa çıkma stratejilerinizi geliştirmenize yardımcı olan test.",
    icon: Zap,
    duration: "3-5 dk",
    color: "bg-amber-50 text-amber-700",
  },
  {
    slug: "psikolojik-checkup",
    title: "Psikolojik Check Up",
    description:
      "Genel ruh sağlığınızı değerlendiren kapsamlı tarama. Birden fazla alanı tek seferde test edin.",
    icon: ClipboardList,
    duration: "15-20 dk",
    color: "bg-sky-50 text-sky-700",
  },
];

export default function TestsPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Psikolojik Testler
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Psikolojik durumunuzu anlamak için en güvenilir testlerimizi
              ücretsiz olarak yapabilirsiniz.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {tests.map((test) => (
              <div
                key={test.slug}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex gap-6 p-8">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                      test.color
                    )}
                  >
                    <test.icon className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-foreground">
                        {test.title}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {test.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {test.description}
                    </p>
                    <Link
                      href={`/tests/${test.slug}`}
                      className={cn(
                        buttonVariants(),
                        "mt-6 inline-flex rounded-xl"
                      )}
                    >
                      Testi Çöz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
