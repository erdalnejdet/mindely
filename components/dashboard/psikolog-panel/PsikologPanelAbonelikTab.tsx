"use client";

import * as React from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Crown,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  name: string;
  displayName: string;
  priceMonthly: number;
  maxAppointmentsMonth: number | null;
  features: string[];
};

type Subscription = {
  id: string;
  status: "active" | "trial" | "cancelled" | "expired";
  startedAt: string;
  expiresAt: string | null;
  plan: Plan;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function daysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function planIcon(name: string) {
  if (name === "paket_12ay") return <Crown className="h-5 w-5" />;
  if (name === "paket_6ay") return <Zap className="h-5 w-5" />;
  return <CalendarClock className="h-5 w-5" />;
}

function planColor(name: string): string {
  if (name === "paket_12ay") return "emerald";
  if (name === "paket_6ay") return "blue";
  return "gray";
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrent,
  isLoading,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  isLoading: boolean;
  onSelect: () => void;
}) {
  const color = planColor(plan.name);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-all",
        isCurrent
          ? "border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-300"
          : "border-border bg-white hover:border-emerald-200",
      )}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-white">
          Aktif Plan
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              color === "emerald" && "bg-emerald-100 text-emerald-600",
              color === "blue" && "bg-blue-100 text-blue-600",
              color === "gray" && "bg-gray-100 text-gray-500",
            )}
          >
            {planIcon(plan.name)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{plan.displayName}</p>
            <p className="text-xs text-muted-foreground">Sınırsız randevu</p>
          </div>
        </div>
        {plan.name === "paket_12ay" && (
          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Önerilen
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-4">
        {plan.name === "paket_6ay" && (
          <p className="text-xs text-muted-foreground line-through">₺4.500/ay</p>
        )}
        {plan.name === "paket_12ay" && (
          <p className="text-xs text-muted-foreground line-through">₺4.000/ay</p>
        )}
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-foreground">
            {`₺${plan.priceMonthly.toLocaleString("tr-TR")}`}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">/ay</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {plan.name === "paket_6ay" ? "6 Ay Taahhüt · KDV Dahil" :
           plan.name === "paket_12ay" ? "12 Ay Taahhüt · KDV Dahil" : ""}
        </p>
      </div>

      {/* Features */}
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        type="button"
        className={cn(
          "mt-6 w-full rounded-xl",
          isCurrent && "cursor-default opacity-60",
        )}
        variant={isCurrent ? "outline" : "default"}
        disabled={isCurrent || isLoading}
        onClick={onSelect}
      >
        {isLoading && !isCurrent ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isCurrent ? "Mevcut Plan" : plan.priceMonthly === 0 ? "Ücretsiz Başla" : "Bu Planı Seç"}
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PsikologPanelAbonelikTab() {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectingPlanId, setSelectingPlanId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [cancelling, setCancelling] = React.useState(false);
  const [autoActivating, setAutoActivating] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        fetch("/api/plans"),
        fetch("/api/psychologist/subscription"),
      ]);
      let loadedPlans: Plan[] = [];
      let loadedSub: Subscription | null = null;

      if (plansRes.ok) {
        const d = (await plansRes.json()) as { plans: Plan[] };
        loadedPlans = d.plans;
        setPlans(d.plans);
      }
      if (subRes.ok) {
        const d = (await subRes.json()) as { subscription: Subscription | null };
        loadedSub = d.subscription;
        setSubscription(d.subscription);
      }

      // Kayıt sırasında seçilen plan bekliyor mu?
      const pendingRaw = sessionStorage.getItem("mendly_pending_plan");
      if (pendingRaw && !loadedSub && loadedPlans.length > 0) {
        try {
          const pending = JSON.parse(pendingRaw) as { planName: string; months: number };
          const matchedPlan = loadedPlans.find((p) => p.name === pending.planName);
          if (matchedPlan) {
            setAutoActivating(true);
            sessionStorage.removeItem("mendly_pending_plan");
            const createRes = await fetch("/api/psychologist/subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planId: matchedPlan.id,
                months: pending.months || 1,
              }),
            });
            if (createRes.ok) {
              const d = (await createRes.json()) as { subscription: Subscription };
              setSubscription(d.subscription);
            }
          } else {
            sessionStorage.removeItem("mendly_pending_plan");
          }
        } catch {
          sessionStorage.removeItem("mendly_pending_plan");
        } finally {
          setAutoActivating(false);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  const handleSelect = async (planId: string) => {
    setSelectingPlanId(planId);
    setError("");
    try {
      const res = await fetch("/api/psychologist/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, months: 1 }),
      });
      if (!res.ok) { setError("Plan değiştirilemedi."); return; }
      const data = (await res.json()) as { subscription: Subscription };
      setSubscription(data.subscription);
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setSelectingPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Aboneliğinizi iptal etmek istediğinize emin misiniz?")) return;
    setCancelling(true);
    try {
      await fetch("/api/psychologist/subscription", { method: "DELETE" });
      setSubscription(null);
    } finally {
      setCancelling(false);
    }
  };

  if (loading || autoActivating) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Mevcut abonelik skeleton */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-4 rounded-xl bg-emerald-50 px-5 py-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
        </div>
        {/* Plan kartları skeleton */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-28" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => <Skeleton key={j} className="h-4 w-full" />)}
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const days = subscription?.expiresAt ? daysLeft(subscription.expiresAt) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* ── Aktif Abonelik Kartı ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Mevcut Aboneliğiniz</h2>

        {subscription ? (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-emerald-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  {planIcon(subscription.plan.name)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{subscription.plan.displayName} Plan</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(subscription.startedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihinden beri aktif
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {subscription.expiresAt ? (
                  <div className={cn(
                    "rounded-xl px-4 py-2 text-center",
                    days !== null && days <= 7
                      ? "bg-amber-100 text-amber-800"
                      : "bg-white text-foreground",
                  )}>
                    {days !== null && days <= 7 && (
                      <AlertCircle className="mb-0.5 inline h-3.5 w-3.5 mr-1 text-amber-600" />
                    )}
                    <p className="text-xs text-muted-foreground">Bitiş tarihi</p>
                    <p className="font-semibold">{formatDate(subscription.expiresAt)}</p>
                    {days !== null && (
                      <p className="text-xs text-muted-foreground">
                        {days === 0 ? "Bugün bitiyor" : `${days} gün kaldı`}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    Süresiz
                  </span>
                )}

                {subscription.plan.priceMonthly > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={cancelling}
                    onClick={handleCancel}
                  >
                    {cancelling ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
                    İptal et
                  </Button>
                )}
              </div>
            </div>

            {/* Özellikler */}
            <div className="mt-4 flex flex-wrap gap-2">
              {subscription.plan.features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1 text-xs text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Aktif aboneliğiniz yok. Aşağıdan bir plan seçin.
          </div>
        )}
      </div>

      {/* ── Plan Seçimi ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Planlar</h2>
          <Button type="button" variant="ghost" size="sm" className="rounded-xl text-muted-foreground" onClick={load}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Yenile
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          İstediğiniz zaman plan değiştirebilirsiniz. Ödeme entegrasyonu yakında aktif olacak.
        </p>

        {error && (
          <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={subscription?.plan.id === plan.id}
              isLoading={selectingPlanId === plan.id}
              onSelect={() => handleSelect(plan.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Bilgi Notu ───────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-5 py-4 text-sm text-amber-800">
        <p className="font-medium">Ödeme Entegrasyonu Yakında</p>
        <p className="mt-1 text-amber-700/80">
          Şu an planları ücretsiz deneyebilirsiniz. İyzico ile gerçek ödeme altyapısı entegre edilecek.
        </p>
      </div>
    </div>
  );
}
