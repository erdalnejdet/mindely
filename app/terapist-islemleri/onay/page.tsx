"use client";

import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function OnayPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Kaydınız Alındı
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Mindely terapist üyeliğiniz için teşekkürler. Bilgileriniz
            kaydedildi.
          </p>

          <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg text-left">
            <h2 className="font-semibold text-foreground mb-2">Not</h2>
            <p className="text-sm text-muted-foreground">
              Bu akış şimdilik mock. Kayıt sırasında oluşan JSON, tarayıcı konsoluna
              <span className="font-medium text-foreground"> [Mindely terapist kayıt mock] </span>
              etiketiyle loglanır.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/terapist-islemleri">
              <Button size="lg" className="rounded-xl w-full sm:w-auto">
                Terapist Islemlerine Git
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl w-full sm:w-auto"
              >
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
