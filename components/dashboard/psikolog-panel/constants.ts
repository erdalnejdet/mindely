export const HAFTA_GUNLERI = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
] as const;

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
