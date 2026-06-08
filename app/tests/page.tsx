import { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { backendApiUrl } from "@/lib/api-url";
import {
  Brain, ClipboardList, Heart, Zap, AlertCircle,
  RefreshCw, Users, Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Psikolojik Testler",
  description: "Depresyon, anksiyete, stres, OKB ve daha fazlası için ücretsiz psikolojik testler.",
};

type DbTest = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  duration: string;
  maxScore: number;
};

const SLUG_META: Record<string, { icon: React.ElementType; color: string }> = {
  "depresyon-testi": { icon: Heart, color: "bg-rose-50 text-rose-700" },
  "anksiyete-testi": { icon: Brain, color: "bg-emerald-50 text-emerald-700" },
  "stres-testi": { icon: Zap, color: "bg-amber-50 text-amber-700" },
  "okb-testi": { icon: RefreshCw, color: "bg-violet-50 text-violet-700" },
  "adhd-testi": { icon: Activity, color: "bg-sky-50 text-sky-700" },
  "sosyal-anksiyete-testi": { icon: Users, color: "bg-indigo-50 text-indigo-700" },
  "panik-atak-testi": { icon: AlertCircle, color: "bg-orange-50 text-orange-700" },
  "psikolojik-checkup": { icon: ClipboardList, color: "bg-teal-50 text-teal-700" },
};

async function fetchTests(): Promise<DbTest[]> {
  try {
    const res = await fetch(`${backendApiUrl()}/tests`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { tests: DbTest[] };
    return data.tests ?? [];
  } catch {
    return [];
  }
}

export default async function TestsPage() {
  const tests = await fetchTests();

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Psikolojik Testler</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Bilimsel geçerliliği kanıtlanmış ölçeklerden uyarlanan testler.
              Sonucunuzu e-posta ile alabilir, psikologunuzla paylaşabilirsiniz.
            </p>
          </div>

          {tests.length === 0 ? (
            <p className="mt-12 text-center text-muted-foreground">Henüz test bulunmuyor.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {tests.map((test) => {
                const meta = SLUG_META[test.slug] ?? { icon: ClipboardList, color: "bg-gray-50 text-gray-700" };
                const Icon = meta.icon;
                return (
                  <div
                    key={test.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm border border-border/60 transition-all hover:shadow-md hover:border-emerald-200"
                  >
                    <div className="flex gap-5 p-6">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", meta.color)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-lg font-semibold text-foreground">{test.title}</h2>
                          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{test.duration}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{test.description}</p>
                        <div className="mt-4 flex items-center gap-3">
                          <Link href={`/tests/${test.slug}`} className={cn(buttonVariants({ size: "sm" }), "rounded-xl")}>
                            Testi Çöz
                          </Link>
                          <span className="text-xs text-muted-foreground">{test.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Bu testler profesyonel tanı yerine geçmez.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
