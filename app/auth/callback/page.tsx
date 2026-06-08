"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { apiUrl } from "@/lib/api-client";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const access = searchParams.get("access");
    const token = searchParams.get("token") || access;
    const refresh = searchParams.get("refresh");

    if (!token) {
      queueMicrotask(() => setStatus("error"));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/auth/oauth-sync"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: token,
            refreshToken: refresh || undefined,
          }),
        });
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          return;
        }
        window.location.href = "/";
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Leaf className="h-8 w-8 text-primary" />
        <span className="text-xl font-semibold">Mindely</span>
      </Link>

      {status === "loading" && (
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Giriş yapılıyor...</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center max-w-sm">
          <p className="text-destructive font-medium mb-2">Giriş başarısız</p>
          <p className="text-muted-foreground text-sm mb-6">
            Oturum doğrulanamadı. Lütfen tekrar deneyin.
          </p>
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Giriş sayfasına dön
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
