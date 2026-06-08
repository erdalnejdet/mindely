"use client";

import * as React from "react";
import Image from "next/image";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Plus,
  Star,
  Tag,
  Trash2,
  User,
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
import { cn } from "@/lib/utils";
import type { PsikologPanelFormState } from "@/lib/panel-profile";

type PsikologPanelProfilTabProps = {
  form: PsikologPanelFormState;
  setForm: React.Dispatch<React.SetStateAction<PsikologPanelFormState>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saved: boolean;
  onAvatarUpload: (file: File) => Promise<void>;
  isUploadingAvatar: boolean;
};

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  description,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-emerald-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function PsikologPanelProfilTab({
  form,
  setForm,
  onSave,
  isSaving,
  saved,
  onAvatarUpload,
  isUploadingAvatar,
}: PsikologPanelProfilTabProps) {
  const [specModalOpen, setSpecModalOpen] = React.useState(false);
  const [specDrafts, setSpecDrafts] = React.useState<string[]>([""]);
  const specInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [imageFileError, setImageFileError] = React.useState<string | null>(null);
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);

  // ── Spec modal ──────────────────────────────────────────────────────────────
  const openSpecModal = () => { setSpecDrafts([""]); setSpecModalOpen(true); };
  const onSpecModalOpenChange = (open: boolean) => { setSpecModalOpen(open); if (!open) setSpecDrafts([""]); };

  const addDraftRow = () => {
    setSpecDrafts((p) => [...p, ""]);
    setTimeout(() => { specInputRefs.current[specDrafts.length]?.focus(); }, 30);
  };

  const confirmAddSpecializations = () => {
    const valid = specDrafts.map((s) => s.trim()).filter(Boolean);
    if (!valid.length) return;
    setForm((p) => ({
      ...p,
      specializations: [...p.specializations, ...valid.filter((v) => !p.specializations.includes(v))],
    }));
    setSpecDrafts([""]); setSpecModalOpen(false);
  };

  // ── Education ───────────────────────────────────────────────────────────────
  const addEducationRow = () => {
    setForm((p) => {
      const last = p.educationExperience[p.educationExperience.length - 1];
      if (last && !last.title.trim() && !last.subtitle.trim()) return p;
      return { ...p, educationExperience: [...p.educationExperience, { title: "", subtitle: "" }] };
    });
  };

  const updateEducationRow = (index: number, field: "title" | "subtitle", value: string) => {
    setForm((p) => {
      const next = [...p.educationExperience];
      const row = next[index]; if (!row) return p;
      next[index] = { ...row, [field]: value };
      return { ...p, educationExperience: next };
    });
  };

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const onProfileImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImageFileError("Görsel dosyası seçin (JPG, PNG, WebP)."); e.target.value = ""; return; }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) { setImageFileError("Görsel en fazla 5 MB olabilir."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setForm((p) => ({ ...p, image: reader.result as string })); };
    reader.readAsDataURL(file);
    try { await onAvatarUpload(file); } catch { setImageFileError("Fotoğraf yüklenemedi."); }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">

      {/* ── 1. Kimlik kartı ─────────────────────────────────────────────────── */}
      <Section icon={<User className="h-5 w-5" />} title="Kimlik bilgileri" description="Danışanların profilinizde göreceği temel bilgiler">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => imageFileInputRef.current?.click()}
              className={cn(
                "group relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-emerald-100 bg-emerald-50 transition-opacity",
                isUploadingAvatar && "opacity-60",
              )}
              aria-label="Fotoğraf değiştir"
            >
              {form.image ? (
                <Image src={form.image} alt="Profil" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald-200">
                  <User className="h-12 w-12" />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {isUploadingAvatar
                  ? <Loader2 className="h-5 w-5 animate-spin text-white" />
                  : <Camera className="h-5 w-5 text-white" />}
                <span className="text-[10px] font-medium text-white">
                  {isUploadingAvatar ? "Yükleniyor" : "Değiştir"}
                </span>
              </div>
            </button>
            {form.image && (
              <button
                type="button"
                onClick={() => { setImageFileError(null); setForm((p) => ({ ...p, image: "" })); }}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Kaldır
              </button>
            )}
            {imageFileError && <p className="max-w-[7rem] text-center text-xs text-destructive">{imageFileError}</p>}
            <input ref={imageFileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onProfileImageFileChange} />
          </div>

          {/* Ad + unvan + bio */}
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="panel-name" className="text-xs font-medium">Ad soyad</Label>
                <Input
                  id="panel-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="h-11 rounded-xl"
                  placeholder="Uzm. Psk. Ad Soyad"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="panel-title" className="text-xs font-medium">Meslek unvanı</Label>
                <Input
                  id="panel-title"
                  value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                  className="h-11 rounded-xl"
                  placeholder="Klinik Psikolog"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="panel-bio" className="text-xs font-medium">Hakkımda</Label>
              <textarea
                id="panel-bio"
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                rows={4}
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                placeholder="Yaklaşımınızı, uzmanlık alanlarınızı ve danışanlarınıza nasıl destek olduğunuzu kısaca anlatın…"
              />
              <p className="text-right text-xs text-muted-foreground">{form.bio.length} / 5000</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. Seans ücreti ─────────────────────────────────────────────────── */}
      <Section icon={<Star className="h-5 w-5" />} title="Seans ücreti" description="Danışanlarınıza gösterilen ücret">
        <div className="flex items-center gap-4">
          <div className="relative w-44">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₺</span>
            <Input
              id="panel-price"
              inputMode="numeric"
              value={form.sessionPrice}
              onChange={(e) => setForm((p) => ({ ...p, sessionPrice: e.target.value.replace(/\D/g, "") }))}
              className="h-12 rounded-xl pl-8 text-lg font-semibold"
              placeholder="1200"
            />
          </div>
          <span className="text-sm text-muted-foreground">/ seans</span>
          {form.sessionPrice && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
              ₺{Number(form.sessionPrice).toLocaleString("tr-TR")}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Ücret alanı yakında canlı profile yansıyacak.</p>
      </Section>

      {/* ── 3. Uzmanlık alanları ────────────────────────────────────────────── */}
      <Section
        icon={<Tag className="h-5 w-5" />}
        title="Uzmanlık alanları"
        description="Profilinizde etiket olarak görünür"
        action={
          <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={openSpecModal}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Ekle
          </Button>
        }
      >
        {form.specializations.length === 0 ? (
          <button
            type="button"
            onClick={openSpecModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-200 py-6 text-sm text-muted-foreground transition-colors hover:border-emerald-400 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Uzmanlık alanı ekle
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {form.specializations.map((alan, i) => (
              <span
                key={`${i}-${alan}`}
                className="group flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 py-1.5 pl-3.5 pr-2 text-sm font-medium text-emerald-800"
              >
                {alan}
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, specializations: p.specializations.filter((_, idx) => idx !== i) }))}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-emerald-500 transition-colors hover:bg-emerald-200 hover:text-emerald-900"
                  aria-label="Kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={openSpecModal}
              className="flex items-center gap-1.5 rounded-full border border-dashed border-emerald-300 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Ekle
            </button>
          </div>
        )}
      </Section>

      {/* ── 4. Eğitim & Deneyim ─────────────────────────────────────────────── */}
      <Section
        icon={<GraduationCap className="h-5 w-5" />}
        title="Eğitim ve deneyim"
        description="Okul, sertifika, kurs gibi bilgileri ekleyin"
        action={
          <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={addEducationRow}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Satır ekle
          </Button>
        }
      >
        {form.educationExperience.length === 0 ? (
          <button
            type="button"
            onClick={addEducationRow}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-200 py-6 text-sm text-muted-foreground transition-colors hover:border-emerald-400 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            İlk kaydı ekle
          </button>
        ) : (
          <div className="space-y-3">
            {form.educationExperience.map((row, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-emerald-50 bg-emerald-50/40 p-4"
              >
                <BookOpen className="mt-3 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="flex-1 space-y-2">
                  <Input
                    value={row.title}
                    onChange={(e) => updateEducationRow(index, "title", e.target.value)}
                    className="h-10 rounded-lg border-0 bg-white/80 shadow-none focus-visible:ring-1"
                    placeholder="Üniversite veya kurum adı"
                  />
                  <Input
                    value={row.subtitle}
                    onChange={(e) => updateEducationRow(index, "subtitle", e.target.value)}
                    className="h-10 rounded-lg border-0 bg-white/80 shadow-none focus-visible:ring-1 text-sm"
                    placeholder="Bölüm, derece veya kısa açıklama"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, educationExperience: p.educationExperience.filter((_, i) => i !== index) }))}
                  className="mt-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                  aria-label="Kaldır"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Kaydet ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-6 py-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Kimlik, unvan ve biyografi bilgileri <span className="font-medium text-foreground">Kaydet</span> ile kaydedilir.
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Kaydedildi
            </span>
          )}
          <Button type="button" className="rounded-xl px-6" disabled={isSaving} onClick={onSave}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kaydet
          </Button>
        </div>
      </div>

      {/* ── Uzmanlık Modal ──────────────────────────────────────────────────── */}
      <Dialog open={specModalOpen} onOpenChange={onSpecModalOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Uzmanlık alanları ekle</DialogTitle>
            <DialogDescription>
              Her satıra bir uzmanlık yazın. Enter ile hızlıca yeni satır açabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-1 pr-1">
            {specDrafts.map((draft, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  ref={(el) => { specInputRefs.current[i] = el; }}
                  value={draft}
                  onChange={(e) => setSpecDrafts((p) => { const n = [...p]; n[i] = e.target.value; return n; })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (draft.trim()) addDraftRow(); } }}
                  className="h-11 flex-1 rounded-xl"
                  placeholder={i === 0 ? "Örn. Anksiyete" : "Örn. Depresyon"}
                  autoFocus={i === 0}
                />
                {specDrafts.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-xl text-muted-foreground hover:text-destructive" onClick={() => setSpecDrafts((p) => p.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="w-full rounded-xl border-dashed" onClick={addDraftRow}>
            <Plus className="mr-2 h-4 w-4" />
            Satır ekle
          </Button>
          <DialogFooter className="border-t border-border/40 pt-4 sm:justify-end">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onSpecModalOpenChange(false)}>İptal</Button>
            <Button type="button" className="rounded-xl" disabled={specDrafts.every((s) => !s.trim())} onClick={confirmAddSpecializations}>
              Listeye ekle ({specDrafts.filter((s) => s.trim()).length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
