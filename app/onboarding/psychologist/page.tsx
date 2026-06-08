"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api-client";
import { messageFromApiErrorJson } from "@/lib/api-error-message";

export default function PsychologistOnboardingPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !bio.trim()) {
      setError("Unvan ve biyografi zorunludur; herkese açık liste için panelde de tamamlamanız gerekir.");
      return;
    }
    setLoading(true);
    try {
      const patchRes = await fetch(apiUrl("/api/psychologist/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bio: bio.trim(),
          title: title.trim(),
        }),
      });
      const patchData = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) {
        setError(messageFromApiErrorJson(patchData, "Profil güncellenemedi."));
        return;
      }

      if (file) {
        const fd = new FormData();
        fd.set("avatar", file);
        const upRes = await fetch(apiUrl("/api/psychologist/profile/avatar"), {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const upData = await upRes.json().catch(() => ({}));
        if (!upRes.ok) {
          setError(messageFromApiErrorJson(upData, "Fotoğraf yüklenemedi; metin bilgileri kaydedildi."));
          return;
        }
      }

      router.push("/dashboard");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Leaf className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold">Mindely</span>
      </Link>

      <div className="mx-auto mt-10 w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profilinizi tamamlayın</h1>
          <p className="mt-2 text-muted-foreground">
            Unvan ve biyografi zorunludur. Profil fotoğrafı isteğe bağlıdır. Aynı bilgileri panelden de
            güncelleyebilirsiniz.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Unvan (zorunlu)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl"
              placeholder="Örn. Klinik Psikolog"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biyografi (zorunlu)</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              maxLength={5000}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Profil fotoğrafı</Label>
            <div className="flex items-center gap-3">
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <ImagePlus className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <p className="text-xs text-muted-foreground">En fazla 5 MB, yalnızca görsel.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={loading} className="h-12 flex-1 rounded-xl">
              {loading ? "Kaydediliyor..." : "Kaydet ve panele git"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              Şimdilik atla
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
