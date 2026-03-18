"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, Mail, Calendar, ArrowRight } from "lucide-react";
import { getPackageById } from "@/lib/data/packages";

const ODEME_STORAGE_KEY = "mindely_terapist_odeme";

type OdemeData = {
  paketId: string;
  kayit: Record<string, unknown>;
  odemeTarihi: string;
  durum: string;
} | null;

function getInitialOdemeData(): OdemeData {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(ODEME_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as OdemeData;
  } catch {
    return null;
  }
}

export default function OnayPage() {
  const router = useRouter();
  const [odemeData] = useState<OdemeData>(getInitialOdemeData);

  useEffect(() => {
    if (odemeData) {
      sessionStorage.removeItem(ODEME_STORAGE_KEY);
    } else {
      router.replace("/terapist-islemleri");
    }
  }, [odemeData, router]);

  const packageData = odemeData?.paketId
    ? getPackageById(odemeData.paketId)
    : null;
  const kayit = odemeData?.kayit as { formData?: { email?: string } } | undefined;

  if (!odemeData) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Aboneliğiniz Onaylandı!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Mindely ailesine hoş geldiniz. Hesabınız aktifleştiriliyor.
          </p>

          <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg text-left">
            <h2 className="font-semibold text-foreground mb-6">
              Kayıt Özeti
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <p className="font-medium">{kayit?.formData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paket</p>
                  <p className="font-medium">
                    {packageData?.name} - ₺{packageData?.price}/ay
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm text-emerald-800">
                <strong>Sonraki adım:</strong> E-posta adresinize gönderilen
                aktivasyon linkine tıklayarak profil oluşturma sürecini
                tamamlayın. 24 saat içinde profiliniz incelenecek ve onay
                sonrası platformda görünür olacaksınız.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard/expert">
              <Button size="lg" className="rounded-xl w-full sm:w-auto">
                Panele Git
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
