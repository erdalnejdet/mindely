"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call for password reset
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/30 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Mindely</span>
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Şifremi Unuttum
            </h1>
            <p className="mt-2 text-muted-foreground">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı
              göndereceğiz.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-emerald-800 font-medium">
                Bağlantı gönderildi!
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                E-posta adresinize şifre sıfırlama bağlantısı gönderdik.
                Lütfen gelen kutunuzu kontrol edin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl pl-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary"
              >
                Sıfırlama Bağlantısı Gönder
              </Button>
            </form>
          )}

          <Link
            href="/auth/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Giriş sayfasına dön
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  );
}
