import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { ArrowLeft } from "lucide-react";
import { TESTS } from "@/lib/data/tests";
import { TestStartModal } from "@/components/tests/TestStartModal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = TESTS[slug];
  if (!test) return { title: "Test Bulunamadı" };
  return {
    title: test.title,
    description: test.description,
  };
}

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = TESTS[slug];

  if (!test) notFound();

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/tests"
          className={`${buttonVariants({ variant: "ghost" })} mb-8`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Testlere Dön
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {test.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{test.description}</p>

          <div className="mt-8 flex gap-6 rounded-xl bg-emerald-50 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Soru Sayısı</p>
              <p className="text-xl font-bold text-primary">
                {test.questionCount} soru
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Süre</p>
              <p className="text-xl font-bold text-primary">{test.duration}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground">
              Bu test profesyonel değerlendirme amaçlıdır. Sonuçlar tedavi
              yerine geçmez. Detaylı destek için bir uzmanla görüşmenizi
              öneririz.
            </p>
          </div>

          <TestStartModal slug={slug} />
        </div>
      </div>
    </PageLayout>
  );
}
