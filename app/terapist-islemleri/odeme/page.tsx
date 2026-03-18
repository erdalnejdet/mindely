"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowLeft, Check, Shield } from "lucide-react";
import { getPackageById } from "@/lib/data/packages";

const ODEME_STORAGE_KEY = "mindely_terapist_odeme";

function OdemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    acceptTerms: false,
  });

  const paketId = searchParams.get("paket");
  const [kayitData, setKayitData] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setKayitData(sessionStorage.getItem("mindely_terapist_kayit"));
    setLoaded(true);
  }, []);

  const packageData = paketId ? getPackageById(paketId) : null;

  useEffect(() => {
    if (!loaded) return;
    if (!paketId || !packageData || !kayitData) {
      router.replace("/terapist-islemleri");
    }
  }, [loaded, paketId, packageData, kayitData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) return;

    setLoading(true);
    try {
      // Simüle ödeme - gerçek uygulamada ödeme gateway API çağrılır
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const odemeData = {
        paketId,
        kayit: JSON.parse(kayitData || "{}"),
        odemeTarihi: new Date().toISOString(),
        durum: "basarili",
      };
      sessionStorage.setItem(ODEME_STORAGE_KEY, JSON.stringify(odemeData));
      sessionStorage.removeItem("mindely_terapist_kayit");

      setSuccess(true);
      setTimeout(() => {
        router.push("/terapist-islemleri/onay");
      }, 2000);
    } catch {
      setLoading(false);
    }
  };

  if (!packageData) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Yönlendiriliyorsunuz...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-12 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/terapist-islemleri/kayit?paket=${paketId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri dön
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-foreground">Ödeme</h1>
            <p className="mt-2 text-muted-foreground">
              Güvenli ödeme ile aboneliğinizi tamamlayın.
            </p>

            {success ? (
              <div className="mt-8 text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Ödeme Başarılı!
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Onay sayfasına yönlendiriliyorsunuz...
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">
                        {packageData.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {packageData.duration} · {packageData.description}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      ₺{packageData.price}/ay
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Kart Numarası</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, cardNumber: e.target.value })
                        }
                        className="h-12 pl-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                    <Input
                      id="cardName"
                      placeholder="Ad Soyad"
                      value={formData.cardName}
                      onChange={(e) =>
                        setFormData({ ...formData, cardName: e.target.value })
                      }
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
                      <Input
                        id="expiryDate"
                        placeholder="AA/YY"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          setFormData({ ...formData, expiryDate: e.target.value })
                        }
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) =>
                          setFormData({ ...formData, cvv: e.target.value })
                        }
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          acceptTerms: e.target.checked,
                        })
                      }
                      className="mt-1 h-4 w-4 rounded border-input"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-muted-foreground"
                    >
                      <Link href="/kullanim-kosullari" className="text-primary hover:underline">
                        Kullanım koşullarını
                      </Link>{" "}
                      ve{" "}
                      <Link href="/gizlilik" className="text-primary hover:underline">
                        gizlilik politikasını
                      </Link>{" "}
                      okudum ve kabul ediyorum.
                    </label>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-4">
                    <Shield className="h-6 w-6 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Ödemeniz 256-bit SSL ile şifrelenir. Kart bilgileriniz
                      güvende tutulur.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl"
                  >
                    {loading ? "İşleniyor..." : `₺${packageData.totalPrice} Öde`}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function OdemePage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </PageLayout>
    }>
      <OdemeContent />
    </Suspense>
  );
}
