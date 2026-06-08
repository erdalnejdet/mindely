"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchSession } from "@/lib/auth";
import type { TestDefinition, ScoreRange } from "@/lib/data/tests";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRange(def: TestDefinition, score: number): ScoreRange | null {
  return def.scoreRanges.find((r) => score >= r.min && score <= r.max) ?? null;
}

const COLOR_MAP = {
  green: { bg: "bg-emerald-50", text: "text-emerald-800", bar: "bg-emerald-500", border: "border-emerald-200" },
  yellow: { bg: "bg-amber-50", text: "text-amber-800", bar: "bg-amber-400", border: "border-amber-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-800", bar: "bg-orange-500", border: "border-orange-200" },
  red: { bg: "bg-red-50", text: "text-red-800", bar: "bg-red-500", border: "border-red-200" },
};

// ─── Email Modal ─────────────────────────────────────────────────────────────

function EmailModal({
  testTitle,
  score,
  maxScore,
  range,
  onClose,
  onSent,
  defaultEmail,
  defaultName,
}: {
  testTitle: string;
  score: number;
  maxScore: number;
  range: ScoreRange;
  onClose: () => void;
  onSent: () => void;
  defaultEmail?: string;
  defaultName?: string;
}) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [name, setName] = useState(defaultName ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    if (!email.trim() || !name.trim()) { setError("Ad ve e-posta zorunludur."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/tests/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email.trim(),
          name: name.trim(),
          testTitle,
          score,
          maxScore,
          resultLabel: range.label,
          resultDescription: range.description,
          recommendation: range.recommendation,
        }),
      });
      if (res.ok) { onSent(); }
      else { setError("E-posta gönderilemedi. Lütfen tekrar deneyin."); }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sonucu E-posta ile Al</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Test sonucunuz detaylı açıklama ve önerilerle birlikte e-posta adresinize gönderilecek.
        </p>
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email-name">Adınız</Label>
            <Input
              id="email-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-addr">E-posta</Label>
            <Input
              id="email-addr"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="h-11 rounded-xl"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={sending}
            onClick={handleSend}
          >
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            {sending ? "Gönderiliyor…" : "Sonucu Gönder"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TestRunnerProps = {
  test: TestDefinition;
};

export function TestRunner({ test }: TestRunnerProps) {
  const [phase, setPhase] = useState<"intro" | "running" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    fetchSession().then((u) => {
      if (u) setSessionUser({ email: u.email, name: u.name });
    });
  }, []);

  const total = test.questions.length;
  const current = test.questions[index];
  const selected = answers[index];
  const progress = phase === "result" ? 100 : Math.round((index / total) * 100);

  const score = useMemo(() => answers.reduce((sum, n) => sum + n, 0), [answers]);
  const range = useMemo(() => getRange(test, score), [test, score]);
  const colors = range ? COLOR_MAP[range.color] : COLOR_MAP.green;
  const pct = Math.round((score / test.maxScore) * 100);

  const startTest = () => {
    setAnswers([]);
    setIndex(0);
    setPhase("running");
    setEmailSent(false);
  };

  const selectOption = (optionScore: number) => {
    const next = [...answers];
    next[index] = optionScore;
    setAnswers(next);
  };

  const goNext = () => {
    if (index + 1 >= total) {
      setPhase("result");
      // Giriş yapmışsa otomatik e-posta gönder
      if (sessionUser) {
        fetch("/api/tests/send-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: sessionUser.email,
            name: sessionUser.name,
            testTitle: test.title,
            score,
            maxScore: test.maxScore,
            resultLabel: range?.label ?? "",
            resultDescription: range?.description ?? "",
            recommendation: range?.recommendation ?? "",
          }),
        })
          .then((r) => r.ok && setEmailSent(true))
          .catch(() => null);
      }
    } else {
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => { if (index > 0) setIndex((i) => i - 1); };

  const restart = () => {
    setPhase("intro");
    setAnswers([]);
    setIndex(0);
    setEmailSent(false);
  };

  // ── INTRO ─────────────────────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 rounded-xl bg-emerald-50 p-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">SORU SAYISI</p>
            <p className="text-xl font-bold text-primary">{total} soru</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">TAHMINI SÜRE</p>
            <p className="text-xl font-bold text-primary">{test.duration}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">KATEGORİ</p>
            <p className="text-xl font-bold text-primary">{test.category}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Önemli Not:</strong> Bu test profesyonel bir tanı koymaz ve tıbbi/psikolojik değerlendirmenin yerini tutmaz.
        </div>

        <div className="rounded-xl border p-4 text-sm text-muted-foreground">
          <strong>Talimatlar:</strong> {test.instructions}
        </div>

        {test.reference && (
          <p className="text-xs text-muted-foreground">
            Kaynak: {test.reference}
          </p>
        )}

        <Button size="lg" className="w-full rounded-xl" onClick={startTest}>
          Testi Başlat
        </Button>
      </div>
    );
  }

  // ── RUNNING ───────────────────────────────────────────────────────────────

  if (phase === "running" && current) {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Soru {index + 1} / {total}</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted">
            <div
              className="h-2.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Soru */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {test.shortTitle} · Soru {index + 1}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground leading-snug">
            {current.text}
          </h2>

          <div className="mt-5 space-y-2.5">
            {current.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectOption(opt.score)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                  selected === opt.score
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : "border-border hover:border-primary/50 hover:bg-emerald-50/40",
                )}
              >
                <span className={cn(
                  "mr-3 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold",
                  selected === opt.score
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground",
                )}>
                  {selected === opt.score ? "✓" : i + 1}
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigasyon */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="rounded-xl" onClick={goPrev} disabled={index === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
          <Button
            className="rounded-xl px-6"
            onClick={goNext}
            disabled={selected === undefined}
          >
            {index + 1 === total ? "Sonucu Gör" : "İleri"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────

  if (phase === "result" && range) {
    return (
      <>
        <div className="space-y-6">
          {/* Puan */}
          <div className={cn("rounded-2xl border p-6 text-center", colors.bg, colors.border)}>
            <p className="text-sm font-medium text-muted-foreground">TOPLAM PUAN</p>
            <p className={cn("mt-2 text-6xl font-bold", colors.text)}>
              {score}
              <span className="text-2xl font-normal text-muted-foreground"> / {test.maxScore}</span>
            </p>
            <div className="mx-auto mt-4 max-w-xs">
              <div className="h-3 rounded-full bg-white/60">
                <div
                  className={cn("h-3 rounded-full transition-all", colors.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <p className={cn("mt-4 text-xl font-bold", colors.text)}>{range.label}</p>
          </div>

          {/* Açıklama */}
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-foreground">Sonuç Açıklaması</h3>
            <p className="mt-2 text-sm text-muted-foreground">{range.description}</p>
          </div>

          {/* Öneri */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900">Öneri</h3>
            <p className="mt-2 text-sm text-amber-800">{range.recommendation}</p>
          </div>

          {/* E-posta bildirimi */}
          {sessionUser ? (
            emailSent ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Sonuçlarınız <strong>{sessionUser.email}</strong> adresine gönderildi.
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-700">
                <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />
                Sonuçlarınız e-posta adresinize gönderiliyor…
              </div>
            )
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setEmailModal(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Sonucu E-posta ile Al
            </Button>
          )}

          {/* Psikolog CTA */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <p className="text-sm font-medium text-emerald-900">Detaylı değerlendirme için bir uzmanla görüşün.</p>
            <Link
              href="/psikologlar"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Psikolog Bul
            </Link>
          </div>

          {/* Tekrar çöz */}
          <div className="flex items-center justify-between border-t pt-4">
            <Link href="/tests" className="text-sm text-muted-foreground hover:text-foreground">
              ← Diğer Testler
            </Link>
            <Button variant="ghost" className="rounded-xl" onClick={restart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Tekrar Çöz
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Bu test bir tanı koymaz. Sonuçlar yalnızca bilgilendirme amaçlıdır.
          </p>
        </div>

        {emailModal && (
          <EmailModal
            testTitle={test.title}
            score={score}
            maxScore={test.maxScore}
            range={range}
            defaultEmail=""
            defaultName=""
            onClose={() => setEmailModal(false)}
            onSent={() => { setEmailModal(false); setEmailSent(true); }}
          />
        )}
      </>
    );
  }

  return null;
}
