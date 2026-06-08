"use client";

import * as React from "react";
import { AlertCircle, CalendarClock, CheckCircle2, CreditCard, Crown, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfilTamamlamaModal } from "@/components/dashboard/ProfilTamamlamaModal";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { parseMinRezervasyonSaatInput } from "@/lib/panel-profile";
import type { PsikologPanelFormState } from "@/lib/panel-profile";
import {
  PsikologPanelAbonelikTab,
  PsikologPanelDanisanlarimTab,
  PsikologPanelGenelAyarlarTab,
  PsikologPanelHero,
  PsikologPanelProfilTab,
  PsikologPanelRandevularimTab,
  PsikologPanelSeansYonetimiTab,
  PsikologPanelTabTriggers,
} from "@/components/dashboard/psikolog-panel";
import type { PsychologistAccountInfo } from "@/lib/psychologist-account";

type PsikologDashboardViewProps = {
  therapistAccount?: PsychologistAccountInfo | null;
};

type SubscriptionInfo = {
  id: string;
  status: "active" | "trial" | "cancelled" | "expired";
  startedAt: string;
  expiresAt: string | null;
  plan: {
    id: string;
    name: string;
    displayName: string;
    priceMonthly: number;
    maxAppointmentsMonth: number | null;
    features: string[];
  };
};

function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

function planIcon(name: string, size = "h-4 w-4") {
  if (name === "paket_12ay") return <Crown className={size} />;
  if (name === "paket_6ay") return <Zap className={size} />;
  return <CalendarClock className={size} />;
}

function SubscriptionCard({
  subscription,
  loading,
  onGoToTab,
}: {
  subscription: SubscriptionInfo | null;
  loading: boolean;
  onGoToTab: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <button
        type="button"
        onClick={onGoToTab}
        className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/40"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          <CreditCard className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-muted-foreground">Aktif abonelik yok</p>
          <p className="text-xs text-muted-foreground">Plan seçmek için tıklayın →</p>
        </div>
      </button>
    );
  }

  const days = subscription.expiresAt ? daysLeft(subscription.expiresAt) : null;
  const isWarning = days !== null && days <= 7;
  const isFree = subscription.plan.priceMonthly === 0;

  return (
    <button
      type="button"
      onClick={onGoToTab}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 shadow-sm transition",
        isWarning
          ? "border-amber-200 bg-amber-50/60 hover:bg-amber-50"
          : "border-emerald-100 bg-white hover:bg-emerald-50/40",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          subscription.plan.name === "paket_12ay" ? "bg-emerald-100 text-emerald-600" :
          subscription.plan.name === "paket_6ay" ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-500",
        )}>
          {planIcon(subscription.plan.name)}
        </div>
        <div className="text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{subscription.plan.displayName} Plan</p>
            {!isFree && (
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                subscription.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500",
              )}>
                {subscription.status === "active" ? "Aktif" : "Trial"}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isFree ? "Ücretsiz plan" : subscription.expiresAt
              ? isWarning
                ? `⚠ ${days} gün kaldı — ${new Date(subscription.expiresAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}`
                : `${new Date(subscription.expiresAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihine kadar`
              : "Süresiz"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        Değiştir
      </div>
    </button>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────


function initFormFromAccount(account: PsychologistAccountInfo | null | undefined): PsikologPanelFormState {
  return {
    name: account?.name ?? "",
    specialization: account?.title ?? "",
    bio: account?.bio ?? "",
    image: account?.avatarUrl ?? "",
    sessionPrice: "1200",
    specializations: [],
    educationExperience: [],
    genelAyarlar: {
      aktifSeansAlma: account?.bookingEnabled ?? true,
      minRezervasyonSaat: account?.minAdvanceBookingHours != null
        ? String(account.minAdvanceBookingHours)
        : "24",
    },
  };
}


async function saveSettings(bookingEnabled: boolean, minAdvanceBookingHours: number | null) {
  const res = await fetch("/api/psychologist/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingEnabled, minAdvanceBookingHours }),
  });
  if (!res.ok) throw new Error("Ayarlar kaydedilemedi.");
}

async function saveProfile(payload: { name?: string; title?: string; bio?: string }) {
  const res = await fetch("/api/psychologist/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Profil kaydedilemedi.");
}

async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch("/api/psychologist/profile/avatar", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Avatar yüklenemedi.");
  const data = (await res.json()) as { secureUrl?: string };
  return data.secureUrl ?? "";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PsikologDashboardView({ therapistAccount }: PsikologDashboardViewProps) {
  const [form, setForm] = React.useState<PsikologPanelFormState>(() =>
    initFormFromAccount(therapistAccount),
  );

  // (Saat kapatma SeansYönetimi sekmesine taşındı)

  // Genel ayarlar
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);
  const [settingsSaved, setSettingsSaved] = React.useState(false);

  // Profil
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [profilModalOpen, setProfilModalOpen] = React.useState(false);

  // Abonelik
  const [subscription, setSubscription] = React.useState<SubscriptionInfo | null>(null);
  const [subLoading, setSubLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("profil");


  React.useEffect(() => {
    console.log("[Mendly] therapistAccount:", therapistAccount);
  }, [therapistAccount]);


  React.useEffect(() => {
    fetch("/api/psychologist/subscription", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d: { subscription: SubscriptionInfo | null } | null) => {
        setSubscription(d?.subscription ?? null);
      })
      .catch(() => null)
      .finally(() => setSubLoading(false));
  }, []);

  // ── Profil ──────────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileSaved(false);
    try {
      await saveProfile({
        name: form.name.trim() || undefined,
        title: form.specialization.trim() || undefined,
        bio: form.bio.trim() || undefined,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(file);
      if (url) setForm((p) => ({ ...p, image: url }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ── Genel ayarlar ──────────────────────────────────────────────────────────

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSaved(false);
    try {
      const minHours = parseMinRezervasyonSaatInput(form.genelAyarlar.minRezervasyonSaat);
      await saveSettings(form.genelAyarlar.aktifSeansAlma, minHours);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleProfilModalSaved = (fields: { title: string; bio: string; name?: string }) => {
    setForm((p) => ({
      ...p,
      specialization: fields.title,
      bio: fields.bio,
      name: fields.name ?? p.name,
    }));
  };

  return (
    <>
    <ProfilTamamlamaModal
      open={profilModalOpen}
      onOpenChange={setProfilModalOpen}
      onSaved={handleProfilModalSaved}
    />
    <PageLayout>
      <div className="bg-[#f4fafd] py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {therapistAccount && therapistAccount.profileCompleted !== true && (
            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-4 text-sm text-amber-950 shadow-sm sm:px-5"
              role="status"
            >
              <div>
                <p className="font-medium">Profilinizi tamamlayın</p>
                <p className="mt-0.5 text-amber-900/90">
                  Unvan ve biyografinizi kaydedince herkese açık listede görünürsünüz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfilModalOpen(true)}
                className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Hızlı tamamla
              </button>
            </div>
          )}

          {therapistAccount?.profileCompleted === true && therapistAccount.isListed === true && (
            <div
              className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950 shadow-sm sm:px-5"
              role="status"
            >
              Profiliniz tamam; herkese açık liste koşullarını sağlıyorsunuz
              {typeof therapistAccount.sessionDurationMinutes === "number"
                ? ` (${therapistAccount.sessionDurationMinutes} dk seans).`
                : "."}
            </div>
          )}

          <PsikologPanelHero
            form={form}
            avatarUrl={therapistAccount?.avatarUrl}
            isListed={therapistAccount?.isListed}
          />

          {/* Abonelik özet kartı — sadece aktif abonelik varsa göster */}
          {(subLoading || subscription) && (
            <SubscriptionCard
              subscription={subscription}
              loading={subLoading}
              onGoToTab={() => setActiveTab("abonelik")}
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-6">
            <PsikologPanelTabTriggers />

            <TabsContent value="profil" className="mt-0 space-y-8">
              <PsikologPanelProfilTab
                form={form}
                setForm={setForm}
                onSave={handleSaveProfile}
                isSaving={isSavingProfile}
                saved={profileSaved}
                onAvatarUpload={handleAvatarUpload}
                isUploadingAvatar={isUploadingAvatar}
              />
            </TabsContent>

            <TabsContent value="genel-ayarlar" className="mt-0 space-y-6">
              <PsikologPanelGenelAyarlarTab
                form={form}
                setForm={setForm}
                onSaveSettings={handleSaveSettings}
                isSavingSettings={isSavingSettings}
                settingsSaved={settingsSaved}
              />
            </TabsContent>

            <TabsContent value="seans-yonetimi" className="mt-0 space-y-6">
              <PsikologPanelSeansYonetimiTab />
            </TabsContent>

            <TabsContent value="randevularim" className="mt-0 space-y-6">
              <PsikologPanelRandevularimTab />
            </TabsContent>

            <TabsContent value="danisanlarim" className="mt-0 space-y-6">
              <PsikologPanelDanisanlarimTab />
            </TabsContent>

            <TabsContent value="abonelik" className="mt-0 space-y-6">
              <PsikologPanelAbonelikTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
    </>
  );
}
