"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api-client";
import { messageFromApiErrorJson } from "@/lib/api-error-message";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get("email");
    if (q) setEmail(q);
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/verify-email"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(messageFromApiErrorJson(data, "Doğrulama başarısız."));
        return;
      }
      router.replace(
        `/auth/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent("/dashboard")}`,
      );
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResendLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/resend-verification"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(messageFromApiErrorJson(data, "Kod gönderilemedi."));
        return;
      }
      setInfo(typeof data.message === "string" ? data.message : "İstek alındı.");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <Link href="/" className="mx-auto flex items-center gap-2">
        <Leaf className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold">Mindely</span>
      </Link>

      <div className="mx-auto mt-10 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">E-posta doğrulama</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gelen kutunuza gönderilen 6 haneli kodu girin.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
        )}
        {info && (
          <p className="text-sm text-foreground bg-primary/10 rounded-lg p-3">{info}</p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl pl-12"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Doğrulama kodu</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
              className="h-12 rounded-xl text-center text-lg tracking-widest"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl">
            {loading ? "Doğrulanıyor..." : "Doğrula"}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-xl"
          onClick={handleResend}
          disabled={resendLoading || !email}
        >
          {resendLoading ? "Gönderiliyor..." : "Kodu yeniden gönder"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:underline">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Yükleniyor...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
