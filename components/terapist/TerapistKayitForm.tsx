"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DogumTarihiPicker } from "@/components/ui/dogum-tarihi-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CINSIYET_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "kadin", label: "Kadın" },
  { value: "erkek", label: "Erkek" },
  { value: "diger", label: "Diğer" },
  { value: "belirtmek_istemiyorum", label: "Belirtmek istemiyorum" },
];

const ABONELIK_PAKETLERI = [
  {
    id: "paket_1_6ay",
    badge: "6 Aylık",
    title: "Paket 1",
    oldPrice: "4500₺/Ay",
    price: "3790₺/Ay",
    note: "KDV Dahil - 6 Ay Taahhüt",
    features: [
      "6 Ay Profesyonel Görünürlük",
      "Yaşadığınız İlde Görünürlük ve Online Seanslar",
      "Komisyonsuz Sistem",
      "Online Randevu Takvimi",
      "SMS Bilgilendirme Sistemi",
      "Yapay Zeka Eşleştirme Sistemi",
      "Bilimsel İçerik Oluşturma ve Yayınlama",
      "Arama Motorlarında Öne Çıkma (SEO)",
      "EMDR Kit + Profesyonel Gelişim Paneli",
      "Danışan Test Takip Paneli",
      "Kısa Vadeli Esneklik",
    ],
  },
  {
    id: "paket_2_12ay",
    badge: "12 Aylık",
    title: "Paket 2",
    recommended: true,
    oldPrice: "4000₺/Ay",
    price: "3290₺/Ay",
    note: "KDV Dahil - 12 Ay Taahhüt",
    features: [
      "12 Ay Profesyonel Görünürlük",
      "Yaşadığınız İlde Görünürlük ve Online Seanslar",
      "Komisyonsuz Sistem",
      "Online Randevu Takvimi",
      "SMS Bilgilendirme Sistemi",
      "Yapay Zeka Eşleştirme Sistemi",
      "Bilimsel İçerik Oluşturma ve Yayınlama",
      "Arama Motorlarında Öne Çıkma (SEO)",
      "EMDR Kit + Profesyonel Gelişim Paneli",
      "Danışan Test Takip Paneli",
      "Ekonomik Avantaj",
      "Uzun Vadeli Tanınırlık",
    ],
  },
] as const;

type PaketId = (typeof ABONELIK_PAKETLERI)[number]["id"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function TerapistKayitForm() {
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<"temel" | "opsiyonel" | "abonelik">("temel");
  const [errors, setErrors] = React.useState<{ temel?: string; abonelik?: string }>({});
  const [formData, setFormData] = React.useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    dogumTarihi: "",
    cinsiyet: "",
  });
  const [selectedPlanId, setSelectedPlanId] = React.useState<PaketId | null>(null);

  const validateTemel = () => {
    const ad = formData.ad.trim();
    const soyad = formData.soyad.trim();
    const email = formData.email.trim();
    const telefon = formData.telefon.trim();
    if (!ad || !soyad || !email || !telefon) {
      return "Lütfen ad, soyad, e‑posta ve telefon alanlarını doldurun.";
    }
    if (!isValidEmail(email)) {
      return "Lütfen geçerli bir e‑posta adresi girin.";
    }
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const temelErr = validateTemel();
    if (temelErr) {
      setErrors({ temel: temelErr });
      setStep("temel");
      return;
    }
    if (!selectedPlanId) {
      setErrors({ abonelik: "Lütfen bir abonelik paketi seçin." });
      setStep("abonelik");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        temelBilgiler: {
          ad: formData.ad.trim(),
          soyad: formData.soyad.trim(),
          email: formData.email.trim(),
          telefon: formData.telefon.trim(),
        },
        opsiyonel: {
          dogumTarihi: formData.dogumTarihi || null,
          cinsiyet: formData.cinsiyet || null,
        },
        abonelik: {
          planId: selectedPlanId,
        },
        kayitTarihi: new Date().toISOString(),
      };

      console.info("[Mindely terapist kayıt mock]", payload);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Tabs value={step} className="w-full gap-6" orientation="horizontal">
        <div className="overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList
            variant="default"
            className={cn(
              "h-auto min-h-12 w-max min-w-full justify-start gap-1 rounded-2xl border border-emerald-100/90 bg-emerald-50/50 p-1.5 shadow-sm sm:min-w-0",
              "ring-1 ring-emerald-100/40",
            )}
          >
            <TabsTrigger
              value="temel"
              onClick={() => setStep("temel")}
              className={cn(
                "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
                "text-muted-foreground shadow-none transition-all duration-200",
                "hover:text-foreground",
                "data-active:bg-white data-active:text-primary data-active:shadow-md",
                "data-active:ring-1 data-active:ring-emerald-200/60",
                "after:hidden",
              )}
            >
              Temel bilgiler
            </TabsTrigger>
            <TabsTrigger
              value="opsiyonel"
              onClick={() => setStep("opsiyonel")}
              className={cn(
                "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
                "text-muted-foreground shadow-none transition-all duration-200",
                "hover:text-foreground",
                "data-active:bg-white data-active:text-primary data-active:shadow-md",
                "data-active:ring-1 data-active:ring-emerald-200/60",
                "after:hidden",
              )}
            >
              Diğer bilgiler (opsiyonel)
            </TabsTrigger>
            <TabsTrigger
              value="abonelik"
              onClick={() => setStep("abonelik")}
              className={cn(
                "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
                "text-muted-foreground shadow-none transition-all duration-200",
                "hover:text-foreground",
                "data-active:bg-white data-active:text-primary data-active:shadow-md",
                "data-active:ring-1 data-active:ring-emerald-200/60",
                "after:hidden",
              )}
            >
              Abonelik
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="temel" className="mt-0 space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Temel bilgiler</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bu alanlar zorunludur. Diğer adımları daha sonra tamamlayabilirsiniz.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ad">Ad</Label>
                <Input
                  id="ad"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  placeholder="Adınız"
                  className="h-12 rounded-xl"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soyad">Soyad</Label>
                <Input
                  id="soyad"
                  value={formData.soyad}
                  onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
                  placeholder="Soyadınız"
                  className="h-12 rounded-xl"
                  autoComplete="family-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E‑posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@email.com"
                  className="h-12 rounded-xl"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefon">Telefon</Label>
                <Input
                  id="telefon"
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  className="h-12 rounded-xl"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
            {errors.temel ? (
              <p className="mt-4 text-sm text-destructive">{errors.temel}</p>
            ) : null}
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => {
                  const err = validateTemel();
                  if (err) {
                    setErrors({ temel: err });
                    return;
                  }
                  setErrors({});
                  setStep("opsiyonel");
                }}
              >
                Devam et
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opsiyonel" className="mt-0 space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Diğer bilgiler (opsiyonel)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bu alanlar zorunlu değil. Şimdilik atlayabilir, sonra güncelleyebilirsiniz.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dogumTarihi">Doğum tarihi</Label>
                <DogumTarihiPicker
                  id="dogumTarihi"
                  value={formData.dogumTarihi}
                  onValueChange={(dogumTarihi) =>
                    setFormData({ ...formData, dogumTarihi })
                  }
                  name="dogumTarihi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cinsiyet">Cinsiyet</Label>
                <select
                  id="cinsiyet"
                  value={formData.cinsiyet}
                  onChange={(e) => setFormData({ ...formData, cinsiyet: e.target.value })}
                  className="h-12 w-full rounded-xl border border-input bg-background px-4"
                >
                  {CINSIYET_OPTIONS.map((opt) => (
                    <option key={opt.value || "empty"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setStep("temel")}
              >
                Geri
              </Button>
              <Button type="button" className="rounded-xl" onClick={() => setStep("abonelik")}>
                Aboneliğe geç
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abonelik" className="mt-0 space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Abonelik seçimi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              İki paketten birini seçin. Kaydet dediğinizde JSON loglanır (mock).
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {ABONELIK_PAKETLERI.map((p) => {
                const selected = selectedPlanId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setErrors((cur) => ({ ...cur, abonelik: undefined }));
                    }}
                    className={cn(
                      "text-left rounded-2xl border bg-white p-6 shadow-sm transition",
                      "hover:shadow-md",
                      selected ? "border-emerald-300 ring-2 ring-emerald-200/60" : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            {p.badge}
                          </span>
                          {"recommended" in p && p.recommended ? (
                            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                              Önerilen
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-lg font-semibold text-foreground">{p.title}</p>
                      </div>
                      <span
                        className={cn(
                          "mt-1 inline-flex size-5 items-center justify-center rounded-full border",
                          selected ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/30",
                        )}
                        aria-hidden
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground line-through">{p.oldPrice}</p>
                      <p className="text-3xl font-bold text-emerald-700">{p.price}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      {p.features.slice(0, 7).map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="mt-0.5 text-emerald-600">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                      <li className="text-xs text-muted-foreground/80">
                        + {Math.max(0, p.features.length - 7)} özellik daha
                      </li>
                    </ul>
                  </button>
                );
              })}
            </div>

            {errors.abonelik ? (
              <p className="mt-4 text-sm text-destructive">{errors.abonelik}</p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/terapist-islemleri"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terapist İşlemleri
              </Link>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setStep("opsiyonel")}
                >
                  Geri
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-xl px-8 sm:w-auto"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet (JSON logla)"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
