"use client";

import * as React from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type CvFields = {
  name: string | null;
  title: string | null;
  bio: string | null;
  specializations: string[];
  education: Array<{ title: string; subtitle: string }>;
};

type ProfilTamamlamaModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (fields: { title: string; bio: string; name?: string }) => void;
};

export function ProfilTamamlamaModal({
  open,
  onOpenChange,
  onSaved,
}: ProfilTamamlamaModalProps) {
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  // CV parse state
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [parsing, setParsing] = React.useState(false);
  const [parseError, setParseError] = React.useState("");
  const [parsedFields, setParsedFields] = React.useState<CvFields | null>(null);
  const [cvSource, setCvSource] = React.useState<"ai" | "text" | null>(null);
  const cvInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle(""); setBio(""); setName("");
    setError(""); setCvFile(null);
    setParsedFields(null); setParseError(""); setCvSource(null);
  };

  React.useEffect(() => { if (!open) reset(); }, [open]);

  // ── CV parse ──────────────────────────────────────────────────────────────
  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setParseError("");
    setParsedFields(null);
    setParsing(true);

    try {
      const fd = new FormData();
      fd.append("cv", file);
      const res = await fetch("/api/psychologist/cv-parse", { method: "POST", body: fd });
      const data = (await res.json()) as {
        source?: "ai" | "text";
        fields?: CvFields;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setParseError(data.message ?? "CV işlenemedi.");
        return;
      }
      if (data.fields) {
        setParsedFields(data.fields);
        setCvSource(data.source ?? null);
      }
    } catch {
      setParseError("CV yüklenirken hata oluştu.");
    } finally {
      setParsing(false);
      e.target.value = "";
    }
  };

  const applyParsed = () => {
    if (!parsedFields) return;
    if (parsedFields.name) setName(parsedFields.name);
    if (parsedFields.title) setTitle(parsedFields.title);
    if (parsedFields.bio) setBio(parsedFields.bio);
    setParsedFields(null);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError("");
    if (!title.trim() || !bio.trim()) {
      setError("Unvan ve biyografi zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/psychologist/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), bio: bio.trim(), name: name.trim() || undefined }),
      });
      if (!res.ok) { setError("Kaydedilemedi. Lütfen tekrar deneyin."); return; }
      onSaved({ title: title.trim(), bio: bio.trim(), name: name.trim() || undefined });
      onOpenChange(false);
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] overflow-y-auto rounded-2xl p-0 sm:max-w-lg"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-emerald-100 bg-white px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Profilini tamamla</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Unvan ve biyografi doldurulunca herkese açık listede görünürsün.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 py-5">

          {/* ── CV yükleme ────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">CV'den otomatik doldur</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  PDF CV'ni yükle, bilgileri otomatik aktaralım. İstersen düzenleyebilirsin.
                </p>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={handleCvChange}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-xl border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                  disabled={parsing}
                  onClick={() => cvInputRef.current?.click()}
                >
                  {parsing ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Okunuyor…</>
                  ) : (
                    <><Upload className="mr-2 h-3.5 w-3.5" />{cvFile ? cvFile.name : "CV Yükle (PDF)"}</>
                  )}
                </Button>
                {parseError && <p className="mt-2 text-xs text-destructive">{parseError}</p>}
              </div>
            </div>

            {/* Parse sonucu önizleme */}
            {parsedFields && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <FileText className="h-3.5 w-3.5" />
                    {cvSource === "ai" ? "AI ile çıkarıldı" : "Metinden çıkarıldı"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setParsedFields(null)}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {parsedFields.name && <p><span className="font-medium text-foreground">Ad:</span> {parsedFields.name}</p>}
                  {parsedFields.title && <p><span className="font-medium text-foreground">Unvan:</span> {parsedFields.title}</p>}
                  {parsedFields.bio && <p className="line-clamp-2"><span className="font-medium text-foreground">Biyografi:</span> {parsedFields.bio}</p>}
                  {parsedFields.specializations.length > 0 && (
                    <p><span className="font-medium text-foreground">Uzmanlık:</span> {parsedFields.specializations.join(", ")}</p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full rounded-xl"
                  onClick={applyParsed}
                >
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  Formlara uygula
                </Button>
              </div>
            )}
          </div>

          {/* ── Form alanları ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mt-name" className="text-xs font-medium">
                Ad soyad <span className="text-muted-foreground">(isteğe bağlı)</span>
              </Label>
              <Input
                id="mt-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="Uzm. Psk. Ad Soyad"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mt-title" className="text-xs font-medium">
                Meslek unvanı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mt-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn("h-11 rounded-xl", !title && error ? "border-destructive" : "")}
                placeholder="Klinik Psikolog"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mt-bio" className="text-xs font-medium">
                Biyografi <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="mt-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={5000}
                rows={5}
                className={cn(
                  "w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  !bio && error ? "border-destructive" : "border-input",
                )}
                placeholder="Yaklaşımınızı, uzmanlık alanlarınızı ve danışanlara nasıl destek olduğunuzu kısaca anlatın…"
              />
              <p className="text-right text-xs text-muted-foreground">{bio.length} / 5000</p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-2xl border-t border-emerald-100 bg-white px-6 py-4">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Şimdilik atla
          </Button>
          <Button type="button" className="rounded-xl px-6" disabled={saving} onClick={handleSave}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
