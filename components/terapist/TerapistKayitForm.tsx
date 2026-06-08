"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DogumTarihiPicker } from "@/components/ui/dogum-tarihi-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-client";
import { messageFromApiErrorJson } from "@/lib/api-error-message";

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
    ],
  },
] as const;

type PaketId = (typeof ABONELIK_PAKETLERI)[number]["id"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const STEPS = [
  { id: "temel", label: "Temel bilgiler" },
  { id: "opsiyonel", label: "Diğer bilgiler" },
  { id: "odeme", label: "Abonelik" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function Stepper({ step }: { step: StepId }) {
  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.id === step));

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {STEPS.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={s.id} className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  isCompleted && "border-emerald-600 bg-emerald-600 text-white",
                  isActive && "border-emerald-300 bg-emerald-50 text-emerald-800",
                  !isCompleted && !isActive && "border-border bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    isCompleted && "text-emerald-800",
                    isActive && "text-foreground",
                    !isCompleted && !isActive && "text-muted-foreground",
                  )}
                >
                  {s.label}
                </p>
              </div>
              {i !== STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mx-2 hidden h-1 flex-1 rounded-full sm:block",
                    isCompleted ? "bg-emerald-600" : "bg-muted",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TerapistKayitForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<StepId>("temel");
  const [errors, setErrors] = React.useState<{ temel?: string; api?: string }>({});
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

  const registerPsychologist = async () => {
    setErrors({});
    const temelErr = validateTemel();
    if (temelErr) {
      setErrors({ temel: temelErr });
      setStep("temel");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/register/psychologist"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          firstName: formData.ad.trim(),
          lastName: formData.soyad.trim(),
          phone: formData.telefon.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setErrors({
          api: messageFromApiErrorJson(data, "Kayıt tamamlanamadı."),
        });
        return;
      }
      setStep("odeme");
    } catch {
      setErrors({ api: "Bir hata oluştu. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  // Kayıt formundaki paket → DB plan adı eşlemesi
  const PAKET_TO_PLAN: Record<string, { planName: string; months: number }> = {
    paket_1_6ay: { planName: "paket_6ay", months: 6 },
    paket_2_12ay: { planName: "paket_12ay", months: 12 },
  };

  const goToEmailVerification = () => {
    // Seçilen planı dashboard'a taşımak için sessionStorage'a kaydet
    if (selectedPlanId && PAKET_TO_PLAN[selectedPlanId]) {
      sessionStorage.setItem(
        "mendly_pending_plan",
        JSON.stringify(PAKET_TO_PLAN[selectedPlanId]),
      );
    } else {
      // Seçilmeden devam edildi → ücretsiz plan
      sessionStorage.setItem(
        "mendly_pending_plan",
        JSON.stringify({ planName: "free", months: 0 }),
      );
    }
    router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
  };

  return (
    <div className="space-y-6">
      <Stepper step={step} />

      {errors.api ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.api}
        </p>
      ) : null}

      {step === "temel" ? (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Temel bilgiler</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Şifre otomatik oluşturulur ve kayıt sonrası e‑postanıza gönderilir. Ardından e‑posta
            doğrulaması yaparsınız.
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

          <p className="mt-4 text-sm text-muted-foreground">
            Varsayılan seans süresi hesabınızda <span className="font-medium text-foreground">45 dk</span>{" "}
            olarak kaydedilir; ileride panelden değiştirebilirsiniz.
          </p>

          {errors.temel ? <p className="mt-4 text-sm text-destructive">{errors.temel}</p> : null}
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
      ) : null}

      {step === "opsiyonel" ? (
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
                onValueChange={(dogumTarihi) => setFormData({ ...formData, dogumTarihi })}
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
            <Button
              type="button"
              className="rounded-xl"
              disabled={loading}
              onClick={() => {
                void registerPsychologist();
              }}
            >
              {loading ? "Hesap oluşturuluyor..." : "Hesabı oluştur"}
            </Button>
          </div>
        </div>
      ) : null}

      {step === "odeme" ? (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Abonelik seçimi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hesabınız oluşturuldu. Ödeme ve paket aktivasyonu şimdilik örnek arayüzdür; yakında
            panele bağlanacaktır. İsterseniz paket seçebilir, ardından e‑posta doğrulamasına geçin.
          </p>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-sm text-emerald-900">
              <span className="font-semibold">Not:</span> Bu adım yalnızca arayüz önizlemesidir;
              seçiminiz henüz faturalandırılmaz.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {ABONELIK_PAKETLERI.map((p) => {
              const selected = selectedPlanId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlanId(p.id)}
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
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="mt-0.5 text-emerald-600">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/terapist-islemleri"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terapist İşlemleri
            </Link>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              {selectedPlanId ? (
                <p className="self-center text-sm text-emerald-700">
                  ✓ {PAKET_TO_PLAN[selectedPlanId]
                    ? `${PAKET_TO_PLAN[selectedPlanId].planName === "temel" ? "Temel" : "Pro"} plan seçildi (${PAKET_TO_PLAN[selectedPlanId].months} ay)`
                    : "Plan seçildi"}
                </p>
              ) : (
                <p className="self-center text-xs text-muted-foreground">
                  Plan seçmeden devam ederseniz Ücretsiz plan ile başlarsınız.
                </p>
              )}
              <Button
                type="button"
                size="lg"
                className="w-full rounded-xl px-8 sm:w-auto"
                onClick={goToEmailVerification}
              >
                E‑posta doğrulamasına devam et
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
