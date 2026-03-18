"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { setToken, setUser } from "@/lib/auth";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setToken(token);
        setUser(user);
        setStatus("success");
        window.location.href = "/";
      } catch {
        setStatus("error");
      }
    } else {
      setStatus("error");
    }
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

      {status === "success" && (
        <p className="text-muted-foreground">Yönlendiriliyorsunuz...</p>
      )}

      {status === "error" && (
        <div className="text-center max-w-sm">
          <p className="text-destructive font-medium mb-2">Giriş başarısız</p>
          <p className="text-muted-foreground text-sm mb-6">
            Google ile giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
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
