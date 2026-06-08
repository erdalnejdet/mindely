import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { backendApiUrl } from "@/lib/api-url";
import { TestRunner } from "@/components/tests/TestRunner";
import type { TestDefinition } from "@/lib/data/tests";

type DbTest = TestDefinition & { id: string; isActive: boolean };

async function fetchTest(slug: string): Promise<DbTest | null> {
  try {
    const res = await fetch(`${backendApiUrl()}/tests/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { test: DbTest };
    return data.test ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = await fetchTest(slug);
  if (!test) return { title: "Test Bulunamadı" };
  return { title: test.title, description: test.description };
}

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = await fetchTest(slug);
  if (!test) notFound();

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/tests" className={`${buttonVariants({ variant: "ghost" })} mb-6 -ml-3`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Testlere Dön
        </Link>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-emerald-100 sm:p-8">
          <div className="mb-6">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {test.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{test.title}</h1>
            <p className="mt-2 text-muted-foreground">{test.description}</p>
          </div>
          <TestRunner test={test} />
        </div>
      </div>
    </PageLayout>
  );
}
