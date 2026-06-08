export const HAFTA_GUNLERI = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
] as const;

export type HaftaGunu = (typeof HAFTA_GUNLERI)[number];

/** Türkçe gün adı → JS dayOfWeek (0 = Pazar, 1 = Pazartesi, …) */
export const GUN_TO_DOW: Record<HaftaGunu, number> = {
  Pazartesi: 1,
  Salı: 2,
  Çarşamba: 3,
  Perşembe: 4,
  Cuma: 5,
  Cumartesi: 6,
  Pazar: 0,
};

/** JS dayOfWeek → Türkçe gün adı */
export const DOW_TO_GUN: Record<number, HaftaGunu> = Object.fromEntries(
  Object.entries(GUN_TO_DOW).map(([gun, dow]) => [dow, gun as HaftaGunu]),
) as Record<number, HaftaGunu>;

/** 30 dk adımlar, 06:00–23:00 (bitiş seçiminde başlangıçtan sonraki slotlar kullanılır) */
export const YARIM_SAAT_ARALIKLARI: string[] = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 23; h++) {
    for (const m of [0, 30] as const) {
      if (h === 23 && m === 30) break;
      out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return out;
})();

export const panelNativeSelectClass =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-input bg-background px-3 pr-10 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export const demoRandevular = [
  { tarih: "12 Mayıs 2026", saat: "14:00", danisan: "A. Y." },
  { tarih: "15 Mayıs 2026", saat: "10:00", danisan: "M. K." },
  { tarih: "18 Mayıs 2026", saat: "16:30", danisan: "S. D." },
] as const;

export const demoPendingAppointments = [
  {
    id: "b-1",
    tarih: "10 Mayıs 2026",
    saat: "09:30",
    danisan: "E. T.",
    not: "İlk görüşme",
  },
  {
    id: "b-2",
    tarih: "13 Mayıs 2026",
    saat: "18:00",
    danisan: "B. S.",
    not: "Takip seansı",
  },
] as const;

export const demoCompletedAppointments = [
  {
    id: "t-1",
    tarih: "02 Mayıs 2026",
    saat: "11:00",
    danisan: "M. A.",
    not: "Seans tamamlandı",
  },
  {
    id: "t-2",
    tarih: "04 Mayıs 2026",
    saat: "15:30",
    danisan: "N. K.",
    not: "Seans tamamlandı",
  },
] as const;

export const demoClients = [
  {
    id: "c-1",
    fullName: "Elif Taş",
    phone: "+90 530 123 45 67",
    email: "elif.tas@example.com",
    lastAppointment: "10 Mayıs 2026 • 09:30",
    status: "Aktif",
  },
  {
    id: "c-2",
    fullName: "Berk Sarı",
    phone: "+90 532 222 11 00",
    email: "berk.sari@example.com",
    lastAppointment: "13 Mayıs 2026 • 18:00",
    status: "Aktif",
  },
  {
    id: "c-3",
    fullName: "Merve Akın",
    phone: "+90 533 987 65 43",
    email: "merve.akin@example.com",
    lastAppointment: "02 Mayıs 2026 • 11:00",
    status: "Arşiv",
  },
] as const;
