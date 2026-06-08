"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  ShieldCheck,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PsikologData = {
  id: string;
  name: string | null;
  title: string | null;
  avatarUrl?: string | null;
  sessionDurationMinutes?: number | null;
  sessionPrice?: number | null;
};

type SlotData = {
  sessionDurationMinutes: number | null;
  bookingEnabled: boolean;
  minAdvanceBookingHours: number | null;
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
  blockedSlots: { dayOfWeek: number; startTime: string; endTime: string }[];
  bookedSlots: { startsAt: string; endsAt: string }[];
};

type TimeSlot = { time: string; disabled: boolean; reason?: string };

type BookingSectionProps = {
  fixedPsikologId?: string;
  psikologData?: PsikologData;
  onClose?: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const TR_DAYS = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

/** "HH:MM" → dakika */
function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** dakika → "HH:MM" */
function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** YYYY-MM-DD string'den yerel Date */
function localDate(dateStr: string): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y!, mo! - 1, d!);
}

/** ISO string'den yerel HH:MM */
function isoToLocalTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** ISO string'den YYYY-MM-DD */
function isoToLocalDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Slot'ların çakışıp çakışmadığını kontrol et */
function overlaps(
  slotStartMin: number,
  slotEndMin: number,
  blockStartMin: number,
  blockEndMin: number,
): boolean {
  return slotStartMin < blockEndMin && slotEndMin > blockStartMin;
}

/**
 * Belirli bir gün için slot listesi üretir.
 * dayOfWeek: 0=Pazar, 1=Pazartesi, …, 6=Cumartesi
 */
function generateSlots(
  dateStr: string,
  dayOfWeek: number,
  slotData: SlotData,
): TimeSlot[] {
  const duration = slotData.sessionDurationMinutes ?? 60;
  const step = 60; // Saatler her zaman tam saat başlarında
  const minAdvHours = slotData.minAdvanceBookingHours ?? 0;

  const avail = slotData.availability.find((a) => a.dayOfWeek === dayOfWeek);
  if (!avail) return [];

  const startMin = timeToMin(avail.startTime);
  const endMin = timeToMin(avail.endTime);
  const slots: TimeSlot[] = [];

  const now = new Date();
  const cutoff = new Date(now.getTime() + minAdvHours * 60 * 60 * 1000);
  const selectedDay = localDate(dateStr);
  const isToday =
    selectedDay.getDate() === now.getDate() &&
    selectedDay.getMonth() === now.getMonth() &&
    selectedDay.getFullYear() === now.getFullYear();

  // Booked slot'ları bu güne ait olarak filtrele
  const bookedToday = slotData.bookedSlots.filter(
    (b) => isoToLocalDate(b.startsAt) === dateStr,
  );

  // Blocked slot'ları bu güne ait olarak filtrele
  const blockedToday = slotData.blockedSlots.filter(
    (b) => b.dayOfWeek === dayOfWeek,
  );

  let cur = startMin;
  while (cur + duration <= endMin) {
    const slotEnd = cur + duration;
    const slotTimeStr = minToTime(cur);
    let disabled = false;
    let reason = "";

    // 1. Geçmiş saatler (bugün için)
    if (isToday) {
      const slotDateTime = new Date(selectedDay);
      slotDateTime.setHours(Math.floor(cur / 60), cur % 60, 0, 0);
      if (slotDateTime <= cutoff) {
        disabled = true;
        reason = "Geçmiş";
      }
    }

    // 2. Blocked (kapalı) saatler
    if (!disabled) {
      for (const block of blockedToday) {
        if (overlaps(cur, slotEnd, timeToMin(block.startTime), timeToMin(block.endTime))) {
          disabled = true;
          reason = "Kapalı";
          break;
        }
      }
    }

    // 3. Alınmış randevular
    if (!disabled) {
      for (const booked of bookedToday) {
        const bStart = timeToMin(isoToLocalTime(booked.startsAt));
        const bEnd = timeToMin(isoToLocalTime(booked.endsAt));
        if (overlaps(cur, slotEnd, bStart, bEnd)) {
          disabled = true;
          reason = "Dolu";
          break;
        }
      }
    }

    slots.push({ time: slotTimeStr, disabled, reason });
    cur += step; // Her saat tam saatten başlar (09:00, 10:00, 11:00…)
  }

  return slots;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingSection({ fixedPsikologId, psikologData, onClose }: BookingSectionProps) {
  const searchParams = useSearchParams();
  const psikologId = fixedPsikologId ?? searchParams.get("psikolog") ?? "";

  // Slot verisi
  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [slotLoading, setSlotLoading] = useState(false);

  // Takvim
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed

  // Seçimler
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [coupon, setCoupon] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [bookingDone, setBookingDone] = useState(false);

  const activePsikolog = psikologData ?? null;
  const basePrice = activePsikolog?.sessionPrice ?? null;
  const canPay = Boolean(cardNumber && expiry && cvv && cardName);

  // ── Slot verisi yükle ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!psikologId) return;
    setSlotLoading(true);
    fetch(`/api/psychologists/${psikologId}/slots`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: SlotData & { error?: string }) => {
        console.log("[Mendly] slot verisi:", JSON.stringify(d, null, 2));
        if (!d.error) setSlotData(d);
      })
      .catch((e) => console.error("[Mendly] slot fetch hatası:", e))
      .finally(() => setSlotLoading(false));
  }, [psikologId]);

  // ── Takvim hesaplama ───────────────────────────────────────────────────────
  const calendarCells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    // Pazartesi başlangıçlı haftaya dönüştür (0=Pzt, 6=Paz)
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const cells: (number | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calYear, calMonth]);

  const isDayAvailable = (day: number): boolean => {
    const d = new Date(calYear, calMonth, day);
    if (d < today) return false; // Geçmiş
    if (slotData === null) return true; // Henüz yüklenmedi, tüm günler tıklanabilir
    if (slotData.bookingEnabled === false) return false;
    const backendDow = d.getDay(); // 0=Pazar, 1=Pzt… (backend ile aynı)
    return slotData.availability.some((a) => a.dayOfWeek === backendDow);
  };

  // ── Seçili günün slotları ─────────────────────────────────────────────────
  const timeSlots = useMemo((): TimeSlot[] => {
    if (!selectedDate || !slotData) return [];
    const d = localDate(selectedDate);
    const dow = d.getDay(); // 0=Pazar, 1=Pzt…
    return generateSlots(selectedDate, dow, slotData);
  }, [selectedDate, slotData]);

  const canContinueStep1 = Boolean(selectedDate && selectedTime);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const handleDateSelect = (day: number) => {
    if (!isDayAvailable(day)) return;
    const d = new Date(calYear, calMonth, day);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setSelectedTime("");
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = localDate(dateStr);
    return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:flex-1">
            Randevu Oluşturun
          </h1>
          {onClose ? (
            <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Kapat">
              <X className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/psikologlar" className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Psikolog bilgisi */}
        {activePsikolog && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 text-emerald-300">
              {activePsikolog.avatarUrl
                ? <img src={activePsikolog.avatarUrl} alt="" className="h-full w-full object-cover" />
                : <UserRound className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{activePsikolog.name ?? "Psikolog"}</p>
              <p className="text-xs text-muted-foreground">{activePsikolog.title ?? ""}</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <Video className="h-3 w-3" />
              Online Seans
            </span>
          </div>
        )}

        {/* Stepper */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {(["Tarih & Saat", "Özet", "Ödeme"] as const).map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  step > index + 1 ? "bg-emerald-500 text-white" :
                  step === index + 1 ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground",
                )}>
                  {index + 1}
                </div>
                <span className={cn("hidden text-xs sm:inline", step === index + 1 ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              {index < 2 && <div className={cn("h-0.5 w-10", step > index + 1 ? "bg-emerald-500" : "bg-muted")} />}
            </div>
          ))}
        </div>

        {/* ── Adım 1: Takvim + Saatler ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="mt-8 space-y-5">
            {slotLoading && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border p-5 space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <div className="rounded-xl border p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 rounded-md" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border p-5 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 rounded-xl" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!slotLoading && slotData && !slotData.bookingEnabled && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Bu psikolog şu an randevu kabul etmiyor.
              </div>
            )}
            {!slotLoading && slotData && slotData.bookingEnabled && slotData.availability.length === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Bu psikolog henüz çalışma saatlerini ayarlamamış. Lütfen daha sonra tekrar deneyin.
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Takvim */}
              <div className="rounded-2xl border p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Randevu Tarihi</h3>
                  {slotLoading && <Skeleton className="h-4 w-4 rounded-full" />}
                </div>
                <div className="mt-4 rounded-xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <button type="button" onClick={prevMonth} className="rounded-md p-1 hover:bg-muted">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="font-semibold">{TR_MONTHS[calMonth]} {calYear}</p>
                    <button type="button" onClick={nextMonth} className="rounded-md p-1 hover:bg-muted">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                    {TR_DAYS.map((d) => <span key={d}>{d}</span>)}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {calendarCells.map((day, i) => {
                      if (day === null) return <div key={`empty-${i}`} />;
                      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const available = isDayAvailable(day);
                      const isSelected = selectedDate === dateStr;
                      const isPast = new Date(calYear, calMonth, day) < today;
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={!available}
                          onClick={() => handleDateSelect(day)}
                          className={cn(
                            "h-9 rounded-md text-sm transition-colors",
                            isSelected && "bg-primary text-primary-foreground font-semibold",
                            !isSelected && available && "hover:bg-emerald-100 text-foreground",
                            !isSelected && !available && isPast && "text-muted-foreground/40 line-through",
                            !isSelected && !available && !isPast && "text-muted-foreground/50 cursor-not-allowed",
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedDate && (
                  <p className="mt-2 text-center text-sm font-medium text-emerald-700">
                    {formatDisplayDate(selectedDate)}
                  </p>
                )}
              </div>

              {/* Saatler */}
              <div className="rounded-2xl border p-5">
                <h3 className="text-xl font-semibold text-foreground">Saat Seçin</h3>
                {!selectedDate ? (
                  <div className="mt-4 flex h-[220px] items-center justify-center rounded-xl bg-muted/30 text-sm text-muted-foreground">
                    Önce bir tarih seçin
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="mt-4 flex h-[220px] flex-col items-center justify-center gap-2 rounded-xl bg-muted/30 text-sm text-muted-foreground">
                    <p>Bu gün için uygun saat yok.</p>
                    <p className="text-xs">Başka bir gün seçin.</p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.disabled}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "relative rounded-xl border py-3 text-sm transition-colors",
                          selectedTime === slot.time
                            ? "border-primary bg-primary text-primary-foreground font-semibold"
                            : slot.disabled
                            ? "cursor-not-allowed border-border/30 bg-muted/30 text-muted-foreground/40 line-through"
                            : "border-border hover:border-primary/60 hover:bg-emerald-50",
                        )}
                        title={slot.disabled ? slot.reason : undefined}
                      >
                        {slot.time}
                        {slot.disabled && slot.reason === "Dolu" && (
                          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-red-100 px-1.5 text-[9px] font-medium text-red-600">
                            Dolu
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {slotData?.sessionDurationMinutes && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Seans süresi: {slotData.sessionDurationMinutes} dk
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" disabled={!canContinueStep1} onClick={() => setStep(2)} className="rounded-xl px-8">
                Devam Et
              </Button>
            </div>
          </div>
        )}

        {/* ── Adım 2: Özet ──────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">Randevu Özeti</h2>
            <div className="space-y-2">
              <Label htmlFor="coupon">Kampanya Kodu (Opsiyonel)</Label>
              <div className="flex gap-2">
                <Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Örn: MERHABA25" className="h-12" />
                <Button type="button" variant="secondary" className="h-12 px-5">Uygula</Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-5 space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Psikolog</span>
                <span className="font-medium text-foreground">{activePsikolog?.name ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tarih</span>
                <span className="font-medium text-foreground">{formatDisplayDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Saat</span>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Süre</span>
                <span className="font-medium text-foreground">{slotData?.sessionDurationMinutes ?? activePsikolog?.sessionDurationMinutes ?? 50} dk</span>
              </div>
              <div className="flex justify-between">
                <span>Tür</span>
                <span className="font-medium text-foreground">Online</span>
              </div>
              <div className="border-t pt-3">
                {basePrice != null
                  ? <div className="flex justify-between text-lg font-semibold text-foreground"><span>Toplam</span><span className="text-primary">₺{basePrice}</span></div>
                  : <p className="text-xs">Ücret bilgisi yakında eklenecek.</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Geri</Button>
              <Button type="button" onClick={() => setStep(3)}>Ödemeye Geç</Button>
            </div>
          </div>
        )}

        {/* ── Adım 3: Ödeme ─────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <CreditCard className="h-5 w-5" /> Ödeme Bilgileri
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Kart Numarası</Label>
                    <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Son Kullanma</Label>
                      <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="AA/YY" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                    <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="AD SOYAD" className="mt-2" />
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <p className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="h-4 w-4" /> Güvenli Ödeme
                    </p>
                    <p className="mt-1 text-xs">Ödeme bilgileriniz SSL sertifikası ile korunmaktadır.</p>
                  </div>
                  {payError && <p className="text-sm text-destructive">{payError}</p>}
                  {bookingDone && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Randevunuz oluşturuldu! Onay e-postası gönderildi.
                    </div>
                  )}
                  <Button
                    type="button"
                    disabled={!canPay || paying || bookingDone}
                    className="w-full"
                    onClick={async () => {
                      if (!psikologId || !selectedDate || !selectedTime) return;
                      setPaying(true);
                      setPayError("");
                      try {
                        // Kural 3: Önce ödeme (şimdilik mock), sonra randevu oluştur
                        // TODO: Gerçek ödeme entegrasyonu buraya eklenecek
                        const dur = slotData?.sessionDurationMinutes ?? activePsikolog?.sessionDurationMinutes ?? 60;
                        const [h, m] = selectedTime.split(":").map(Number);
                        const startsAt = new Date(selectedDate);
                        startsAt.setHours(h!, m!, 0, 0);
                        const endsAt = new Date(startsAt.getTime() + dur * 60_000);

                        const res = await fetch("/api/appointments", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            psychologistId: psikologId,
                            startsAt: startsAt.toISOString(),
                            endsAt: endsAt.toISOString(),
                          }),
                        });
                        if (!res.ok) {
                          const d = await res.json() as { message?: string };
                          setPayError(d.message ?? "Randevu oluşturulamadı.");
                        } else {
                          setBookingDone(true);
                        }
                      } finally {
                        setPaying(false);
                      }
                    }}
                  >
                    {paying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {paying ? "İşleniyor…" : bookingDone ? "Tamamlandı" : basePrice != null ? `₺${basePrice} Öde ve Randevu Al` : "Ödemeyi Tamamla"}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border p-5 space-y-3 text-sm text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">Randevu Özeti</h3>
                <div className="flex justify-between"><span>Psikolog</span><span className="font-medium text-foreground">{activePsikolog?.name ?? "-"}</span></div>
                <div className="flex justify-between"><span>Tarih</span><span className="font-medium text-foreground">{formatDisplayDate(selectedDate)}</span></div>
                <div className="flex justify-between"><span>Saat</span><span className="font-medium text-foreground">{selectedTime}</span></div>
                <div className="flex justify-between"><span>Tür</span><span className="font-medium text-foreground">Online</span></div>
                {basePrice != null && (
                  <div className="flex justify-between border-t pt-3 text-lg font-semibold text-foreground">
                    <span>Toplam</span><span className="text-primary">₺{basePrice}</span>
                  </div>
                )}
                <p className="rounded-lg bg-muted p-3 text-center text-xs">Ödeme tek çekim olarak gerçekleştirilecektir.</p>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={() => setStep(2)}>Geri</Button>
          </div>
        )}
      </div>
    </div>
  );
}
