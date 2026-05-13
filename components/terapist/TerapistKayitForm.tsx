"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DogumTarihiPicker } from "@/components/ui/dogum-tarihi-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function formatCardNumber(raw: string) {
  const d = digitsOnly(raw).slice(0, 19);
  const groups = d.match(/.{1,4}/g) ?? [];
  return groups.join(" ");
}

function formatExpiry(raw: string) {
  const d = digitsOnly(raw).slice(0, 4);
  const mm = d.slice(0, 2);
  const yy = d.slice(2, 4);
  if (d.length <= 2) return mm;
  return `${mm}/${yy}`;
}

function isValidLuhn(cardDigits: string) {
  // Basic Luhn check for card number validity (mock validation)
  if (cardDigits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardDigits.length - 1; i >= 0; i--) {
    let digit = Number(cardDigits[i]);
    if (!Number.isFinite(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidExpiry(exp: string) {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  const yy = Number(m[2]);
  if (!Number.isFinite(mm) || !Number.isFinite(yy)) return false;
  if (mm < 1 || mm > 12) return false;
  // Assume 20YY
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  return true;
}

const STEPS = [
  { id: "temel", label: "Temel bilgiler" },
  { id: "opsiyonel", label: "Diğer bilgiler" },
  { id: "abonelik", label: "Abonelik" },
  { id: "odeme", label: "Ödeme" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function Stepper({ step }: { step: StepId }) {
  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.id === step),
  );

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
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<StepId>("temel");
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
  const [payment, setPayment] = React.useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    accept: false,
  });

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

  const validatePayment = () => {
    const cardDigits = digitsOnly(payment.cardNumber);
    const cvcDigits = digitsOnly(payment.cvc);
    if (!payment.cardHolder.trim()) return "Kart üzerindeki isim zorunludur.";
    if (cardDigits.length < 12) return "Kart numarası en az 12 hane olmalıdır.";
    if (!isValidLuhn(cardDigits)) return "Kart numarası geçersiz görünüyor.";
    if (!isValidExpiry(payment.expiry)) return "Son kullanma tarihi geçersiz (AA/YY).";
    if (cvcDigits.length < 3 || cvcDigits.length > 4) return "CVC 3 veya 4 hane olmalıdır.";
    if (!payment.accept) return "Devam etmek için ödeme koşullarını onaylayın.";
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
    const odemeErr = validatePayment();
    if (odemeErr) {
      setErrors({ abonelik: odemeErr });
      setStep("odeme");
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
        odeme: {
          method: "card",
          cardHolder: payment.cardHolder.trim(),
          cardLast4: payment.cardNumber.replace(/\D/g, "").slice(-4) || null,
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
      <Stepper step={step} />

      {step === "temel" ? (
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
      ) : null}

      {step === "abonelik" ? (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Abonelik seçimi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mindely’de <span className="font-medium text-foreground">danışanların sizi ana sayfada ve arama/listelerde görebilmesi</span>{" "}
              için bir abonelik paketi gerekir. Paket seçmeden kaydı tamamlayabilirsiniz gibi görünse de
              profiliniz <span className="font-medium text-foreground">yayına alınmaz</span> ve danışanlar sizi keşfedemez.
            </p>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-sm text-emerald-900">
              <span className="font-semibold">Önemli:</span> Abonelik seçimi, görünürlük ve randevu
              kabul akışını aktive eder. Seçtiğiniz paket; görünürlük süresi, panel araçları ve
              bilgilendirme gibi özellikleri içerir.
            </p>
          </div>

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
                  type="button"
                  size="lg"
                  className="w-full rounded-xl px-8 sm:w-auto"
                  onClick={() => {
                    if (!selectedPlanId) {
                      setErrors({ abonelik: "Lütfen bir abonelik paketi seçin." });
                      return;
                    }
                    setErrors({});
                    setStep("odeme");
                  }}
                >
                  Ödemeye geç
                </Button>
              </div>
            </div>
          </div>
      ) : null}

      {step === "odeme" ? (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Ödeme</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bu adım şimdilik mock. Girdiğiniz bilgiler kaydedilmez; yalnızca doğrulama ve akış
            gösterimi için kullanılır. Ödeme tamamlandığında kayıt JSON’u konsola loglanır.
          </p>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-sm text-amber-900">
              Ödeme tamamlanmadan profiliniz <span className="font-medium">yayına alınmaz</span>.
              Bu sayede danışanlar, sadece aboneliği aktif uzmanları ana sayfada görür.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cardHolder">Kart üzerindeki isim</Label>
              <Input
                id="cardHolder"
                value={payment.cardHolder}
                onChange={(e) => setPayment((p) => ({ ...p, cardHolder: e.target.value }))}
                className="h-12 rounded-xl"
                placeholder="Ad Soyad"
                autoComplete="cc-name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cardNumber">Kart numarası</Label>
              <Input
                id="cardNumber"
                inputMode="numeric"
                value={payment.cardNumber}
                onChange={(e) =>
                  setPayment((p) => ({
                    ...p,
                    cardNumber: formatCardNumber(e.target.value),
                  }))
                }
                className="h-12 rounded-xl"
                placeholder="0000 0000 0000 0000"
                autoComplete="cc-number"
              />
              <p className="text-xs text-muted-foreground">
                Kart numarası otomatik formatlanır. Örnek: 4242 4242 4242 4242
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Son kullanma</Label>
              <Input
                id="expiry"
                value={payment.expiry}
                onChange={(e) =>
                  setPayment((p) => ({
                    ...p,
                    expiry: formatExpiry(e.target.value),
                  }))
                }
                className="h-12 rounded-xl"
                placeholder="AA/YY"
                autoComplete="cc-exp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                inputMode="numeric"
                value={payment.cvc}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, cvc: digitsOnly(e.target.value).slice(0, 4) }))
                }
                className="h-12 rounded-xl"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4">
            <input
              type="checkbox"
              className="mt-1"
              checked={payment.accept}
              onChange={(e) => setPayment((p) => ({ ...p, accept: e.target.checked }))}
            />
            <span className="text-sm text-muted-foreground">
              Ödeme koşullarını ve aboneliğin otomatik yenilenebileceğini okudum, kabul ediyorum
              (mock).
            </span>
          </label>

          {errors.abonelik ? (
            <p className="mt-4 text-sm text-destructive">{errors.abonelik}</p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setStep("abonelik")}
            >
              Aboneliğe geri dön
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="rounded-xl"
            >
              {loading ? "İşleniyor..." : "Ödemeyi tamamla (mock) ve JSON logla"}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
