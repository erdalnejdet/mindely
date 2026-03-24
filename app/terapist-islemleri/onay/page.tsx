"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, Mail, User, ArrowRight } from "lucide-react";
import { TERAPIST_UYELIK_STORAGE_KEY } from "@/components/terapist/TerapistKayitForm";

type UyeData = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  adres: string;
  dogumTarihi: string;
  cinsiyet: string;
  kayitTarihi?: string;
} | null;

function getInitialUyeData(): UyeData {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(TERAPIST_UYELIK_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UyeData;
  } catch {
    return null;
  }
}

export default function OnayPage() {
  const router = useRouter();
  const [uyeData] = useState<UyeData>(getInitialUyeData);

  useEffect(() => {
    if (uyeData) {
      sessionStorage.removeItem(TERAPIST_UYELIK_STORAGE_KEY);
    } else {
      router.replace("/terapist-islemleri");
    }
  }, [uyeData, router]);

  if (!uyeData) {
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
            Kaydınız Alındı
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Mindely terapist üyeliğiniz için teşekkürler. Bilgileriniz
            kaydedildi.
          </p>

          <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg text-left">
            <h2 className="font-semibold text-foreground mb-6">Özet</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">
                    {uyeData.ad} {uyeData.soyad}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <p className="font-medium">{uyeData.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm text-emerald-800">
                <strong>Sonraki adım:</strong> Hesabınız hazır olduğunda
                e-posta ile bilgilendirileceksiniz. Uzman profilinizi ve
                abonelik tercihinizi panelden tamamlayabilirsiniz.
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
