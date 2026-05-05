"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CreditCard, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { psikologlar, getPsikologBySlugOrId } from "@/lib/data/psikologlar";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

type BookingSectionProps = {
  fixedPsikologId?: string;
  onClose?: () => void;
};

export function BookingSection({ fixedPsikologId, onClose }: BookingSectionProps) {
  const searchParams = useSearchParams();
  const psikologParam = searchParams.get("psikolog");
  const preselectedPsikolog = psikologParam ? getPsikologBySlugOrId(psikologParam) : null;
  const [selectedPsikolog, setSelectedPsikolog] = useState(
    fixedPsikologId ?? preselectedPsikolog?.id ?? psikologlar[0]?.id ?? "",
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [coupon, setCoupon] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const selectedPsikologObj = psikologlar.find((p) => p.id === selectedPsikolog) ?? null;
  const basePrice = selectedPsikologObj?.sessionPrice ?? 0;
  const totalPrice = basePrice;

  const canContinueStep1 = Boolean(selectedPsikolog && selectedDate && selectedTime);
  const canPay = Boolean(cardNumber && expiry && cvv && cardName);

  const weekdays = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start justify-between">
          <h1 className="text-center text-4xl font-bold tracking-tight text-foreground sm:flex-1">
            Seansinizi Olusturun
          </h1>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/psikologlar" className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Link>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {[1, 2, 3].map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  step >= item ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {item}
              </div>
              {index < 2 && (
                <div className={cn("h-0.5 w-14", step > item ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="mt-8 space-y-5">
            {!fixedPsikologId && (
              <div className="rounded-2xl border p-5">
                <h2 className="text-xl font-semibold">Psikolog Secin</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {psikologlar.map((psikolog) => (
                    <button
                      key={psikolog.id}
                      type="button"
                      onClick={() => setSelectedPsikolog(psikolog.id)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                        selectedPsikolog === psikolog.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/40",
                      )}
                    >
                      <p className="font-medium">{psikolog.name}</p>
                      <p className="text-sm text-muted-foreground">{psikolog.specialization}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <h3 className="text-2xl font-semibold">Randevu Tarihi</h3>
                <div className="mt-4 rounded-xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <button type="button" className="rounded-md p-1 hover:bg-muted">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="font-semibold">Mayis 2026</p>
                    <button type="button" className="rounded-md p-1 hover:bg-muted">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
                    {weekdays.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                      const dateValue = `2026-05-${String(day).padStart(2, "0")}`;
                      const selected = selectedDate === dateValue;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDate(dateValue)}
                          className={cn(
                            "h-9 rounded-md text-sm transition-colors",
                            selected ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted",
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="text-2xl font-semibold">Seansa baslama saatini secin</h3>
                {selectedDate ? (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "rounded-xl border py-3 text-sm",
                          selectedTime === time ? "border-primary bg-primary text-primary-foreground" : "",
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex h-[220px] items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
                    Once bir tarih secin
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                disabled={!canContinueStep1}
                onClick={() => setStep(2)}
                className="rounded-xl px-8"
              >
                Devam Et
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-center text-3xl text-foreground">Bilgileri Onaylayin</h2>
            <div className="space-y-2">
              <Label htmlFor="coupon">Kampanya Kodu (Opsiyonel)</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Orn: MERHABA25"
                  className="h-12"
                />
                <Button type="button" variant="secondary" className="h-12 px-5">
                  Kodu uygula
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-5">
              <h3 className="text-3xl font-semibold">Randevu Ozeti</h3>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p className="flex items-center justify-between"><span>Psikolog:</span><span className="font-medium text-foreground">{selectedPsikologObj?.name ?? "-"}</span></p>
                <p className="flex items-center justify-between"><span>Tarih:</span><span className="font-medium text-foreground">{selectedDate || "-"}</span></p>
                <p className="flex items-center justify-between"><span>Saat:</span><span className="font-medium text-foreground">{selectedTime || "-"}</span></p>
                <p className="flex items-center justify-between"><span>Sure:</span><span className="font-medium text-foreground">60 dakika</span></p>
                <div className="my-3 border-t" />
                <p className="flex items-center justify-between"><span>Normal Fiyat:</span><span className="font-medium text-foreground">{basePrice} TL</span></p>
                <p className="flex items-center justify-between text-2xl font-semibold text-foreground"><span>Toplam:</span><span className="text-primary">{totalPrice} TL</span></p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Geri
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Odemeye Gec
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">
                  <CreditCard className="h-5 w-5" />
                  Odeme Bilgileri
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Kart Numarasi</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Kart Uzerindeki Isim</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="ISIM SOYISIM"
                      className="mt-2"
                    />
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <p className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      Guvenli Odeme
                    </p>
                    <p className="mt-1">Odeme bilgileriniz SSL sertifikasi ile korunmaktadir.</p>
                  </div>
                  <Button type="button" disabled={!canPay} className="w-full">
                    {totalPrice} TL Ode
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="text-2xl font-semibold">Randevu Ozeti</h3>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <p className="font-medium text-foreground">{selectedPsikologObj?.name ?? "-"}</p>
                  <p>{selectedPsikologObj?.specialization ?? "-"}</p>
                  <p className="pt-2 text-foreground">{selectedDate || "-"} / {selectedTime || "-"}</p>
                  <div className="my-3 border-t" />
                  <p className="flex items-center justify-between"><span>Normal Fiyat:</span><span className="text-foreground">{basePrice} TL</span></p>
                  <p className="flex items-center justify-between text-2xl font-semibold text-foreground"><span>Toplam Tutar:</span><span className="text-primary">{totalPrice} TL</span></p>
                </div>
                <p className="mt-6 rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
                  Odeme tek cekim olarak gerceklestirilecektir.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Geri
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
