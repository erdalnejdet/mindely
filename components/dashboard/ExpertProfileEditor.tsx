"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ExpertProfile,
  loadExpertProfile,
  saveExpertProfile,
} from "@/lib/expert-profile";
import { compressImageToDataUrl } from "@/lib/image-compress";
import { Plus, Trash2, ImageIcon, Loader2 } from "lucide-react";

const PRESET_AREAS = [
  "Anksiyete",
  "Depresyon",
  "Travma",
  "Çift Terapisi",
  "EMDR",
  "BDT",
  "Çocuk ve ergen",
  "Öfke yönetimi",
];

export function ExpertProfileEditor() {
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [areaInput, setAreaInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(loadExpertProfile());
  }, []);

  const persist = useCallback((next: ExpertProfile) => {
    setProfile(next);
    saveExpertProfile(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }, []);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) return;
    setImageBusy(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl.length > 900_000) {
        alert("Görsel çok büyük. Lütfen daha küçük bir dosya seçin.");
        return;
      }
      persist({ ...profile, profileImageDataUrl: dataUrl });
    } catch {
      alert("Görsel yüklenemedi.");
    } finally {
      setImageBusy(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    if (!profile) return;
    persist({ ...profile, profileImageDataUrl: null });
  };

  const addArea = (tag: string) => {
    if (!profile) return;
    const t = tag.trim();
    if (!t) return;
    if (profile.expertiseAreas.includes(t)) return;
    persist({
      ...profile,
      expertiseAreas: [...profile.expertiseAreas, t],
    });
    setAreaInput("");
  };

  const removeArea = (tag: string) => {
    if (!profile) return;
    persist({
      ...profile,
      expertiseAreas: profile.expertiseAreas.filter((a) => a !== tag),
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Profil & CV
        </h1>
        <p className="mt-2 text-muted-foreground">
          Danışanların göreceği profilinizi, CV’nizi ve uzmanlık alanlarınızı
          buradan yönetin. Değişiklikler bu cihazda saklanır; hesap
          bağlandığında sunucuya aktarılacaktır.
        </p>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Profil fotoğrafı</CardTitle>
          <CardDescription>
            Yüzünüzün net göründüğü kare veya dikey bir fotoğraf yükleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40">
            {profile.profileImageDataUrl ? (
              <img
                src={profile.profileImageDataUrl}
                alt="Profil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 opacity-40" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImage}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={imageBusy}
              onClick={() => fileRef.current?.click()}
            >
              {imageBusy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Görsel yükle
            </Button>
            {profile.profileImageDataUrl && (
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-destructive hover:text-destructive"
                onClick={removeImage}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Kaldır
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Temel bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="displayName">Görünen ad</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="Dr. Ayşe Yılmaz"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Unvan</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={(e) =>
                setProfile({ ...profile, title: e.target.value })
              }
              placeholder="Uzm. Klinik Psikolog"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="summary">Kısa özet</Label>
            <textarea
              id="summary"
              value={profile.summary}
              onChange={(e) =>
                setProfile({ ...profile, summary: e.target.value })
              }
              placeholder="Listelerde görünecek 2–3 cümlelik tanıtım..."
              className="min-h-[88px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>CV / Özgeçmiş</CardTitle>
          <CardDescription>
            Eğitim, deneyim ve uzmanlıklarınızı detaylı yazabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="education">Eğitim</Label>
            <textarea
              id="education"
              value={profile.education}
              onChange={(e) =>
                setProfile({ ...profile, education: e.target.value })
              }
              placeholder="Üniversite, yüksek lisans, doktora, sertifika programları..."
              className="min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Mesleki deneyim</Label>
            <textarea
              id="experience"
              value={profile.experience}
              onChange={(e) =>
                setProfile({ ...profile, experience: e.target.value })
              }
              placeholder="Çalıştığınız kurumlar, klinik deneyim, süre..."
              className="min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvBody">Tam CV metni</Label>
            <textarea
              id="cvBody"
              value={profile.cvBody}
              onChange={(e) =>
                setProfile({ ...profile, cvBody: e.target.value })
              }
              placeholder="Yayınlar, üyelikler, ek notlar, detaylı kariyer özeti..."
              className="min-h-[200px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Uzmanlık alanları</CardTitle>
          <CardDescription>
            Danışanların sizi bulmasına yardımcı olacak etiketler ekleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESET_AREAS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => addArea(a)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="mr-1 inline h-3.5 w-3.5" />
                {a}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArea(areaInput);
                }
              }}
              placeholder="Özel alan yazıp Enter’a basın"
              className="h-12 flex-1 rounded-xl"
            />
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl sm:w-auto"
              onClick={() => addArea(areaInput)}
            >
              Ekle
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.expertiseAreas.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                  onClick={() => removeArea(tag)}
                  aria-label={`${tag} kaldır`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {profile.expertiseAreas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Henüz alan eklenmedi.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <span className="text-sm text-emerald-600">Kaydedildi.</span>
        )}
        <Button
          type="button"
          className="rounded-xl"
          onClick={() => persist({ ...profile })}
        >
          Kaydet
        </Button>
      </div>
    </div>
  );
}
