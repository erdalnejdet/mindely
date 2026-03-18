"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPackageById } from "@/lib/data/packages";

const UZMANLIK_ALANLARI = [
  "Klinik Psikolog",
  "Psikolog",
  "Psikolojik Danışman",
  "Aile Danışmanı",
  "Çift Terapisti",
  "Cinsel Terapist",
  "EMDR Terapisti",
  "BDT Terapisti",
];

export function TerapistKayitForm({ selectedPackageId }: { selectedPackageId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adSoyad: "",
    email: "",
    telefon: "",
    uzmanlikAlani: "",
    unvan: "",
    universite: "",
    mezuniyetYili: "",
    deneyimYili: "",
    calismaAlanlari: [] as string[],
    bio: "",
    seansUcreti: "",
  });

  const pkg = getPackageById(selectedPackageId);
  if (!pkg) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-destructive">Geçersiz paket. Lütfen paket seçimine dönün.</p>
        <Link href="/terapist-islemleri" className="mt-4 inline-block text-primary hover:underline">
          ← Paket Seçimine Dön
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      sessionStorage.setItem(
        "mindely_terapist_kayit",
        JSON.stringify({ formData, packageId: selectedPackageId })
      );
      router.push(`/terapist-islemleri/odeme?paket=${selectedPackageId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const toggleCalismaAlani = (alan: string) => {
    setFormData((prev) => ({
      ...prev,
      calismaAlanlari: prev.calismaAlanlari.includes(alan)
        ? prev.calismaAlanlari.filter((a) => a !== alan)
        : [...prev.calismaAlanlari, alan],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            1
          </span>
          Kişisel Bilgiler
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adSoyad">Ad Soyad</Label>
            <Input
              id="adSoyad"
              value={formData.adSoyad}
              onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
              placeholder="Adınız Soyadınız"
              className="h-12 rounded-xl"
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unvan">Unvan</Label>
            <Input
              id="unvan"
              value={formData.unvan}
              onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
              placeholder="Uzm. Psk., Dr. vb."
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="uzmanlikAlani">Uzmanlık Alanı</Label>
            <select
              id="uzmanlikAlani"
              value={formData.uzmanlikAlani}
              onChange={(e) => setFormData({ ...formData, uzmanlikAlani: e.target.value })}
              className="h-12 w-full rounded-xl border border-input px-4"
              required
            >
              <option value="">Seçiniz</option>
              {UZMANLIK_ALANLARI.map((alan) => (
                <option key={alan} value={alan}>
                  {alan}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            2
          </span>
          Eğitim Bilgileri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="universite">Üniversite</Label>
            <Input
              id="universite"
              value={formData.universite}
              onChange={(e) => setFormData({ ...formData, universite: e.target.value })}
              placeholder="Mezun olduğunuz üniversite"
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mezuniyetYili">Mezuniyet Yılı</Label>
            <Input
              id="mezuniyetYili"
              type="number"
              value={formData.mezuniyetYili}
              onChange={(e) => setFormData({ ...formData, mezuniyetYili: e.target.value })}
              placeholder="örn. 2015"
              className="h-12 rounded-xl"
              min="1990"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deneyimYili">Deneyim (Yıl)</Label>
            <Input
              id="deneyimYili"
              type="number"
              value={formData.deneyimYili}
              onChange={(e) => setFormData({ ...formData, deneyimYili: e.target.value })}
              placeholder="örn. 8"
              className="h-12 rounded-xl"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seansUcreti">Seans Ücreti (₺)</Label>
            <Input
              id="seansUcreti"
              type="number"
              value={formData.seansUcreti}
              onChange={(e) => setFormData({ ...formData, seansUcreti: e.target.value })}
              placeholder="örn. 800"
              className="h-12 rounded-xl"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            3
          </span>
          Profil Bilgileri
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Çalışma Alanlarınız (birden fazla seçebilirsiniz)</Label>
            <div className="flex flex-wrap gap-2">
              {["Anksiyete", "Depresyon", "Çift Terapisi", "Stres", "Travma", "Panik Atak", "Özgüven", "İlişki Sorunları"].map(
                (alan) => (
                  <button
                    key={alan}
                    type="button"
                    onClick={() => toggleCalismaAlani(alan)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      formData.calismaAlanlari.includes(alan)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {alan}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Kısa Biyografi</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Kendinizi ve terapi yaklaşımınızı kısaca tanıtın..."
              className="min-h-[120px] w-full rounded-xl border border-input px-4 py-3"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Link
          href="/terapist-islemleri"
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Paket Seçimine Dön
        </Link>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="rounded-xl px-8"
        >
          {loading ? "Yükleniyor..." : "Ödemeye Geç"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
