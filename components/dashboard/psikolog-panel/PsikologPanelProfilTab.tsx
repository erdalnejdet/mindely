"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  CheckCircle2,
  Code2,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PsikologPanelFormState } from "@/lib/panel-profile";
import { parseSessionPriceInput } from "@/lib/panel-profile";
import { demoRandevular } from "./constants";

type PsikologPanelProfilTabProps = {
  form: PsikologPanelFormState;
  setForm: React.Dispatch<React.SetStateAction<PsikologPanelFormState>>;
  onMockSave: () => void;
  jsonPreview: string | null;
};

const MAX_PROFILE_IMAGE_BYTES = 3 * 1024 * 1024;

export function PsikologPanelProfilTab({
  form,
  setForm,
  onMockSave,
  jsonPreview,
}: PsikologPanelProfilTabProps) {
  const [specModalOpen, setSpecModalOpen] = React.useState(false);
  const [specDraft, setSpecDraft] = React.useState("");
  const [imageFileError, setImageFileError] = React.useState<string | null>(null);
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);

  const priceDisplay = parseSessionPriceInput(form.sessionPrice);

  const onSpecModalOpenChange = (open: boolean) => {
    setSpecModalOpen(open);
    if (!open) setSpecDraft("");
  };

  const confirmAddSpecialization = () => {
    const t = specDraft.trim();
    if (!t) return;
    setForm((p) => ({
      ...p,
      specializations: [...p.specializations, t],
    }));
    setSpecDraft("");
    setSpecModalOpen(false);
  };

  const openSpecModal = () => {
    setSpecDraft("");
    setSpecModalOpen(true);
  };

  const removeSpecialization = (index: number) => {
    setForm((p) => ({
      ...p,
      specializations: p.specializations.filter((_, i) => i !== index),
    }));
  };

  const updateSpecialization = (index: number, value: string) => {
    setForm((p) => {
      const next = [...p.specializations];
      next[index] = value;
      return { ...p, specializations: next };
    });
  };

  const addEducationRow = () => {
    setForm((p) => ({
      ...p,
      educationExperience: [...p.educationExperience, { title: "", subtitle: "" }],
    }));
  };

  const removeEducationRow = (index: number) => {
    setForm((p) => ({
      ...p,
      educationExperience: p.educationExperience.filter((_, i) => i !== index),
    }));
  };

  const updateEducationRow = (
    index: number,
    field: "title" | "subtitle",
    value: string,
  ) => {
    setForm((p) => {
      const next = [...p.educationExperience];
      const row = next[index];
      if (!row) return p;
      next[index] = { ...row, [field]: value };
      return { ...p, educationExperience: next };
    });
  };

  const onProfileImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageFileError("Lütfen bir görsel dosyası seçin (JPG, PNG, WebP vb.).");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      setImageFileError("Görsel en fazla 3 MB olabilir.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setForm((p) => ({ ...p, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const clearProfileImage = () => {
    setImageFileError(null);
    setForm((p) => ({ ...p, image: "" }));
    if (imageFileInputRef.current) imageFileInputRef.current.value = "";
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground">Genel bilgiler</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ad, unvan, fotoğraf ve hakkımda metni.
          </p>
          <div className="mt-6 grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="panel-name">Ad soyad / unvan</Label>
              <Input
                id="panel-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="h-12 rounded-xl"
                placeholder="Örn. Uzm. Psk. Ad Soyad"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-spec-title">Meslek unvanı</Label>
              <Input
                id="panel-spec-title"
                value={form.specialization}
                onChange={(e) =>
                  setForm((p) => ({ ...p, specialization: e.target.value }))
                }
                className="h-12 rounded-xl"
                placeholder="Örn. Klinik Psikolog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-image-file">Profil fotoğrafı</Label>
              <p className="text-sm text-muted-foreground">
                Bilgisayarınızdan görsel yükleyin. Önizleme üstteki kartta güncellenir.
              </p>
              <input
                ref={imageFileInputRef}
                id="panel-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={onProfileImageFileChange}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => imageFileInputRef.current?.click()}
                >
                  Dosya seç
                </Button>
                {form.image ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={clearProfileImage}
                  >
                    Görseli kaldır
                  </Button>
                ) : null}
                {form.image ? (
                  <div className="relative size-14 overflow-hidden rounded-xl border border-emerald-100 shadow-sm">
                    <Image
                      src={form.image}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
              </div>
              {imageFileError ? (
                <p className="text-sm text-destructive">{imageFileError}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-bio">Hakkımda</Label>
              <textarea
                id="panel-bio"
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                className="min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                placeholder="Kendinizi tanıtın."
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground">Uzmanlık alanları</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ekle ile açılan pencereden yeni etiket girin; listede düzenleyip çöp kutusuyla
            kaldırabilirsiniz.
          </p>
          <div className="mt-4 space-y-3">
            {form.specializations.map((alan, index) => (
              <div
                key={`${index}-${alan}`}
                className="flex gap-2 rounded-xl border border-emerald-100 bg-white p-3 shadow-sm"
              >
                <Input
                  value={alan}
                  onChange={(e) => updateSpecialization(index, e.target.value)}
                  className="h-11 flex-1 rounded-xl border-0 bg-transparent shadow-none focus-visible:ring-0"
                  placeholder="Uzmanlık adı"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-xl"
                  onClick={() => removeSpecialization(index)}
                  aria-label="Kaldır"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" className="rounded-xl" onClick={openSpecModal}>
              <Plus className="mr-2 h-4 w-4" />
              Ekle
            </Button>
          </div>
        </div>

        <Dialog open={specModalOpen} onOpenChange={onSpecModalOpenChange}>
          <DialogContent className="rounded-2xl sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle>Uzmanlık alanı ekle</DialogTitle>
              <DialogDescription>
                Örneğin Anksiyete, Depresyon veya kendi ifadeniz. Kayıt sonrası listede
                düzenleyebilirsiniz.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-1">
              <Label htmlFor="spec-modal-input">Alan adı</Label>
              <Input
                id="spec-modal-input"
                value={specDraft}
                onChange={(e) => setSpecDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmAddSpecialization();
                  }
                }}
                className="h-12 rounded-xl"
                placeholder="Örn. Anksiyete"
                autoFocus
              />
            </div>
            <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onSpecModalOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="button" className="rounded-xl" onClick={confirmAddSpecialization}>
                Listeye ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Eğitim ve deneyim</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Satır ekleyip çıkarın; her satır başlık + kısa açıklama (API’ye JSON gider).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-xl"
              onClick={addEducationRow}
            >
              <Plus className="mr-2 h-4 w-4" />
              Satır ekle
            </Button>
          </div>
          <ul className="mt-6 space-y-6">
            {form.educationExperience.map((row, index) => (
              <li key={index} className="flex gap-3">
                <CheckCircle2 className="mt-2 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1 space-y-3 rounded-xl border border-emerald-50 bg-emerald-50/30 p-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive"
                      onClick={() => removeEducationRow(index)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Kaldır
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edu-title-${index}`}>Başlık</Label>
                    <Input
                      id={`edu-title-${index}`}
                      value={row.title}
                      onChange={(e) => updateEducationRow(index, "title", e.target.value)}
                      className="h-11 rounded-xl"
                      placeholder="Örn. İstanbul Üniversitesi - Klinik Psikoloji YL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edu-sub-${index}`}>Açıklama</Label>
                    <Input
                      id={`edu-sub-${index}`}
                      value={row.subtitle}
                      onChange={(e) => updateEducationRow(index, "subtitle", e.target.value)}
                      className="h-11 rounded-xl"
                      placeholder="Örn. Akademik uzmanlık eğitimi"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {form.educationExperience.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Henüz satır yok. &quot;Satır ekle&quot; ile başlayın.
            </p>
          ) : null}
        </div>

        <Button type="button" className="rounded-xl" size="lg" onClick={onMockSave}>
          <Code2 className="mr-2 h-4 w-4" />
          Mock kaydet — JSON güncelle
        </Button>

        {jsonPreview ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-foreground">Gönderilecek JSON (mock)</p>
            <pre className="mt-3 max-h-[420px] overflow-auto rounded-xl bg-muted/50 p-4 text-xs leading-relaxed whitespace-pre-wrap break-all">
              {jsonPreview}
            </pre>
          </div>
        ) : null}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="bg-primary px-5 py-4 text-primary-foreground">
            <p className="text-sm/5">Seans ücreti</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-bold">
                {priceDisplay != null ? `₺${priceDisplay}` : "—"}
              </span>
              <span className="mb-1 text-sm opacity-90">/50 dk</span>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              <Label htmlFor="panel-price">Ücret (₺)</Label>
              <Input
                id="panel-price"
                inputMode="numeric"
                value={form.sessionPrice}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sessionPrice: e.target.value }))
                }
                className="h-12 rounded-xl"
                placeholder="800"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Yaklaşan randevular</h3>
          <p className="mt-1 text-sm text-muted-foreground">Örnek veri — canlıda takvimden gelir.</p>
          <ul className="mt-4 divide-y divide-emerald-100">
            {demoRandevular.map((r) => (
              <li
                key={`${r.tarih}-${r.saat}`}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.tarih}</p>
                    <p className="text-xs text-muted-foreground">{r.saat}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{r.danisan}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-4 w-full rounded-xl" disabled>
            Takvimi yönet
          </Button>
        </div>
      </aside>
    </section>
  );
}
