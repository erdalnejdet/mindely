import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { ArrowLeft } from "lucide-react";

const tests: Record<
  string,
  {
    title: string;
    description: string;
    questionCount: number;
    duration: string;
  }
> = {
  "anksiyete-testi": {
    title: "Anksiyete Testi",
    description:
      "Bu test, günlük yaşamınızda ne kadar kaygı yaşadığınızı değerlendirmenize yardımcı olur. Lütfen her soruyu dikkatle okuyun ve son 2 haftadaki durumunuza göre cevaplayın.",
    questionCount: 21,
    duration: "5-10 dakika",
  },
  "depresyon-testi": {
    title: "Depresyon Testi",
    description:
      "Bu test, depresif belirtilerinizi değerlendirmenize yardımcı olur. Son 2 haftadaki ruh halinize göre en uygun seçeneği işaretleyin.",
    questionCount: 9,
    duration: "5 dakika",
  },
  "stres-testi": {
    title: "Stres Testi",
    description:
      "Bu test, günlük hayatınızdaki stres düzeyinizi ölçer. Lütfen samimi yanıtlar verin.",
    questionCount: 15,
    duration: "3-5 dakika",
  },
  "psikolojik-checkup": {
    title: "Psikolojik Check Up",
    description:
      "Genel ruh sağlığınızı değerlendiren kapsamlı tarama. Birden fazla alanı içerir.",
    questionCount: 30,
    duration: "15-20 dakika",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = tests[slug];
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
  const test = tests[slug];

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

          <Link
            href={`/tests/${slug}/coz`}
            className={`${buttonVariants({ size: "lg" })} mt-8 w-full rounded-xl`}
          >
            Testi Başlat
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
