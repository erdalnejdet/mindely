"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api-client";
import { messageFromApiErrorJson } from "@/lib/api-error-message";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          messageFromApiErrorJson(data, "Kayıt tamamlanamadı. Bilgilerinizi kontrol edin."),
        );
        return;
      }
      setRegistered(true);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setError("Google ile kayit su anda devre disi.");
  };

  return (
    <div className="min-h-screen flex">
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-emerald-800" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Değişime bugün başlayın
            </h2>
            <p className="max-w-sm text-emerald-100">
              Ücretsiz hesap oluşturarak uzman psikologlarla randevu alın,
              psikolojik testler çözün.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-sm text-emerald-100">Uzman</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-sm text-emerald-100">Mutlu Danışan</p>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80"
              alt="Mental sağlık"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Mindely</span>
        </Link>

        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mt-12">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hesap oluşturun
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ücretsiz hesap oluşturarak hemen başlayın.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-10 h-12 w-full rounded-xl border-2"
            onClick={handleGoogleRegister}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Google ile Kayıt Ol
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </p>
          )}

          {registered ? (
            <div className="space-y-4 rounded-lg bg-primary/10 p-4">
              <p className="text-sm text-foreground">
                Kayıt başarılı. Giriş sayfasından hesabınızla oturum açabilirsiniz.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="w-full">Giriş sayfasına git</Button>
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Adınız"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 rounded-xl pl-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Soyadınız"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 rounded-xl pl-12"
                    required
                  />
                </div>
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pl-12 pr-12"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl pl-12 pr-12"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Şifre tekrarını gizle" : "Şifre tekrarını göster"
                  }
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary text-base font-medium hover:bg-primary/90"
            >
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Psikolog musunuz?{" "}
            <Link
              href="/terapist-islemleri/kayit"
              className="font-medium text-primary hover:underline"
            >
              Terapist kaydı
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
