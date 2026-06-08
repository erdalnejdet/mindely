"use client";

import Link from "next/link";
import { Leaf, Menu, LogOut, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchSession, logout, type SessionUser } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/psikologlar", label: "Psikologlar" },
  { href: "#uzmanlik-alanlari", label: "Uzmanlık Alanları" },
  { href: "/tests", label: "Psikolojik Testler" },
  { href: "#blog", label: "Blog" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSession().then((u) => {
      if (!cancelled) {
        setUser(u);
        setSessionLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-foreground">Mindely</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={`desktop-${link.href}`}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {sessionLoading ? (
            <span className="text-sm text-muted-foreground">…</span>
          ) : user ? (
            <>
              {(user.role === "psychologist" || user.role === "admin") && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Panel
                </Link>
              )}
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Giriş Yap
              </Link>
              <Link href="/auth/register" className={cn(buttonVariants())}>
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="overflow-hidden border-t border-border/40 bg-background md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {sessionLoading ? null : user ? (
                <>
                  {(user.role === "psychologist" || user.role === "admin") && (
                    <Link
                      href="/dashboard"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Panel
                    </Link>
                  )}
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {user.name || user.email}
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className={cn(buttonVariants(), "flex-1 justify-center")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
