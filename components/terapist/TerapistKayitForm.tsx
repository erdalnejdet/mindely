"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const TERAPIST_UYELIK_STORAGE_KEY = "mindely_terapist_uyelik";

const CINSIYET_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "kadin", label: "Kadın" },
  { value: "erkek", label: "Erkek" },
  { value: "diger", label: "Diğer" },
  { value: "belirtmek_istemiyorum", label: "Belirtmek istemiyorum" },
];

export function TerapistKayitForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    adres: "",
    dogumTarihi: "",
    cinsiyet: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      sessionStorage.setItem(
        TERAPIST_UYELIK_STORAGE_KEY,
        JSON.stringify({
          ...formData,
          kayitTarihi: new Date().toISOString(),
        })
      );
      router.push("/terapist-islemleri/onay");
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!calendarWrapperRef.current) return;
      if (!calendarWrapperRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    if (calendarOpen) {
      window.addEventListener("mousedown", onPointerDown);
    }
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [calendarOpen]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
          <Label htmlFor="email">E-posta</Label>
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
        <div className="space-y-2">
          <Label htmlFor="dogumTarihi">Doğum tarihi</Label>
          <div className="relative" ref={calendarWrapperRef}>
            <button
              id="dogumTarihi"
              type="button"
              onClick={() => setCalendarOpen((prev) => !prev)}
              className={cn(
                "h-12 w-full rounded-xl border border-input bg-background px-4 text-left text-sm",
                "flex items-center justify-between",
                !formData.dogumTarihi && "text-muted-foreground",
              )}
            >
              <span>
                {formData.dogumTarihi
                  ? format(parseISO(formData.dogumTarihi), "d MMMM yyyy", { locale: tr })
                  : "Tarih secin"}
              </span>
              <CalendarIcon className="h-4 w-4" />
            </button>
            {calendarOpen && (
              <div className="absolute left-0 top-14 z-50 rounded-xl border bg-background shadow-lg">
                <Calendar
                  mode="single"
                  selected={formData.dogumTarihi ? parseISO(formData.dogumTarihi) : undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    setFormData({ ...formData, dogumTarihi: format(date, "yyyy-MM-dd") });
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </div>
            )}
            <input type="hidden" name="dogumTarihi" value={formData.dogumTarihi} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cinsiyet">Cinsiyet</Label>
          <select
            id="cinsiyet"
            value={formData.cinsiyet}
            onChange={(e) =>
              setFormData({ ...formData, cinsiyet: e.target.value })
            }
            className="h-12 w-full rounded-xl border border-input bg-background px-4"
            required
          >
            {CINSIYET_OPTIONS.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adres">Adres</Label>
        <textarea
          id="adres"
          value={formData.adres}
          onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
          placeholder="İl, ilçe ve açık adres"
          className="min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          autoComplete="street-address"
          required
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between sm:items-center">
        <Link
          href="/terapist-islemleri"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terapist İşlemleri
        </Link>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="rounded-xl px-8 w-full sm:w-auto"
        >
          {loading ? "Kaydediliyor..." : "Üyeliği Tamamla"}
        </Button>
      </div>
    </form>
  );
}
