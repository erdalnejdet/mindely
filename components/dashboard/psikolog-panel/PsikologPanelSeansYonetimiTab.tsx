"use client";

import * as React from "react";
import { CheckCircle2, Clock, Loader2, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DOW_TO_GUN,
  GUN_TO_DOW,
  HAFTA_GUNLERI,
  panelNativeSelectClass,
  YARIM_SAAT_ARALIKLARI,
  type HaftaGunu,
} from "./constants";
import type { KapaliSaatAraligi } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type DayRow = {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
};

type BlockedSlotApi = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_START = "09:00";
const DEFAULT_END = "18:00";

function buildDefaultRows(): DayRow[] {
  return HAFTA_GUNLERI.map((_, i) => ({
    dayOfWeek: GUN_TO_DOW[HAFTA_GUNLERI[i] as HaftaGunu],
    isActive: i < 5, // Pzt–Cum varsayılan açık
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));
}

function apiToRows(
  api: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[],
): DayRow[] {
  const defaults = buildDefaultRows();
  return defaults.map((def) => {
    const found = api.find((r) => r.dayOfWeek === def.dayOfWeek);
    if (found) return { dayOfWeek: def.dayOfWeek, isActive: found.isActive, startTime: found.startTime, endTime: found.endTime };
    return def;
  });
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  icon, title, description, children, action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-emerald-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PsikologPanelSeansYonetimiTab() {
  // ── Çalışma saatleri ──────────────────────────────────────────────────────
  const [rows, setRows] = React.useState<DayRow[]>(buildDefaultRows);
  const [availLoading, setAvailLoading] = React.useState(true);
  const [savingAvail, setSavingAvail] = React.useState(false);
  const [availSaved, setAvailSaved] = React.useState(false);

  // ── Kapalı saatler ────────────────────────────────────────────────────────
  const [blockedSlots, setBlockedSlots] = React.useState<KapaliSaatAraligi[]>([]);
  const [blocksLoading, setBlocksLoading] = React.useState(true);
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [isSavingSlot, setIsSavingSlot] = React.useState(false);

  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalGun, setModalGun] = React.useState<string>(HAFTA_GUNLERI[0]);
  const [modalBas, setModalBas] = React.useState("09:00");
  const [modalBit, setModalBit] = React.useState("10:00");

  // ── Fetch ─────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    fetch("/api/psychologist/availability", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then(async (d: { availability: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[] } | null) => {
        if (d?.availability?.length) {
          setRows(apiToRows(d.availability));
        } else {
          // DB boşsa varsayılan saatleri otomatik kaydet
          const defaults = buildDefaultRows();
          setRows(defaults);
          await fetch("/api/psychologist/availability", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rows: defaults.map((r) => ({
                dayOfWeek: r.dayOfWeek,
                startTime: r.startTime,
                endTime: r.endTime,
                isActive: r.isActive,
              })),
            }),
          });
        }
      })
      .finally(() => setAvailLoading(false));

    fetch("/api/psychologist/blocked-slots", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d: { blockedSlots: BlockedSlotApi[] } | null) => {
        if (d?.blockedSlots) {
          setBlockedSlots(
            d.blockedSlots.map((s) => ({
              id: s.id,
              gun: DOW_TO_GUN[s.dayOfWeek] ?? "Pazartesi",
              baslangic: s.startTime,
              bitis: s.endTime,
            })),
          );
        }
      })
      .finally(() => setBlocksLoading(false));
  }, []);

  // ── Çalışma saatleri handlers ─────────────────────────────────────────────

  const updateRow = (dow: number, patch: Partial<DayRow>) => {
    setRows((prev) => prev.map((r) => r.dayOfWeek === dow ? { ...r, ...patch } : r));
  };

  const handleSaveAvailability = async () => {
    setSavingAvail(true);
    setAvailSaved(false);
    try {
      const payload = rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
        isActive: r.isActive,
      }));
      await fetch("/api/psychologist/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: payload }),
      });
      setAvailSaved(true);
      setTimeout(() => setAvailSaved(false), 3000);
    } finally {
      setSavingAvail(false);
    }
  };

  // ── Kapalı saatler handlers ───────────────────────────────────────────────

  const endOptions = React.useMemo(
    () => YARIM_SAAT_ARALIKLARI.filter((t) => t > modalBas),
    [modalBas],
  );

  const openModal = () => {
    setModalGun(HAFTA_GUNLERI[0]);
    setModalBas("09:00");
    setModalBit("10:00");
    setModalOpen(true);
  };

  const confirmBlock = async () => {
    if (!modalBas || !modalBit || modalBit <= modalBas) return;
    setIsSavingSlot(true);
    try {
      const dow = GUN_TO_DOW[modalGun as HaftaGunu] ?? 1;
      const res = await fetch("/api/psychologist/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayOfWeek: dow, startTime: modalBas, endTime: modalBit }),
      });
      if (res.ok) {
        const d = (await res.json()) as { blockedSlot: BlockedSlotApi };
        setBlockedSlots((prev) => [
          ...prev,
          { id: d.blockedSlot.id, gun: modalGun, baslangic: modalBas, bitis: modalBit },
        ]);
        setModalOpen(false);
      }
    } finally {
      setIsSavingSlot(false);
    }
  };

  const removeBlock = async (id: string) => {
    setRemovingId(id);
    try {
      await fetch(`/api/psychologist/blocked-slots/${id}`, { method: "DELETE" });
      setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setRemovingId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-8">

      {/* ── Bölüm 1: Çalışma saatleri ──────────────────────────────────── */}
      <Section
        icon={<Clock className="h-5 w-5" />}
        title="Çalışma saatleri"
        description="Her gün için randevu kabul ettiğiniz saat aralığını belirleyin."
      >
        {availLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-[6rem_auto] items-center gap-4 rounded-xl border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-9 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>
            ))}
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => {
              const gunAdi = DOW_TO_GUN[row.dayOfWeek] ?? "?";
              const endOpts = YARIM_SAAT_ARALIKLARI.filter((t) => t > row.startTime);

              return (
                <div
                  key={row.dayOfWeek}
                  className={cn(
                    "grid grid-cols-[6rem_auto] items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                    row.isActive
                      ? "border-emerald-100 bg-emerald-50/40"
                      : "border-border/40 bg-muted/20",
                  )}
                >
                  {/* Gün + toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateRow(row.dayOfWeek, { isActive: !row.isActive })}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none",
                        row.isActive ? "bg-emerald-500" : "bg-muted-foreground/30",
                      )}
                      aria-label={row.isActive ? "Kapat" : "Aç"}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition",
                          row.isActive ? "translate-x-4" : "translate-x-0",
                        )}
                      />
                    </button>
                    <span className={cn("text-sm font-medium", !row.isActive && "text-muted-foreground")}>
                      {gunAdi}
                    </span>
                  </div>

                  {/* Saat aralığı */}
                  {row.isActive ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={row.startTime}
                          onChange={(e) => {
                            const v = e.target.value;
                            updateRow(row.dayOfWeek, { startTime: v });
                            const after = YARIM_SAAT_ARALIKLARI.filter((t) => t > v);
                            if (!after.includes(row.endTime)) {
                              updateRow(row.dayOfWeek, { startTime: v, endTime: after[0] ?? v });
                            }
                          }}
                          className="h-9 w-24 cursor-pointer appearance-none rounded-lg border border-input bg-background px-2 pr-6 text-sm"
                        >
                          {YARIM_SAAT_ARALIKLARI.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">▾</span>
                      </div>
                      <span className="text-sm text-muted-foreground">–</span>
                      <div className="relative">
                        <select
                          value={endOpts.includes(row.endTime) ? row.endTime : (endOpts[0] ?? row.endTime)}
                          onChange={(e) => updateRow(row.dayOfWeek, { endTime: e.target.value })}
                          disabled={endOpts.length === 0}
                          className="h-9 w-24 cursor-pointer appearance-none rounded-lg border border-input bg-background px-2 pr-6 text-sm disabled:opacity-50"
                        >
                          {endOpts.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">▾</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Kapalı</span>
                  )}
                </div>
              );
            })}

            <div className="flex items-center gap-3 border-t border-emerald-100 pt-4">
              <Button
                type="button"
                className="rounded-xl"
                disabled={savingAvail}
                onClick={handleSaveAvailability}
              >
                {savingAvail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Saatleri Kaydet
              </Button>
              {availSaved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Kaydedildi
                </span>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* ── Bölüm 2: Kapalı saatler ────────────────────────────────────── */}
      <Section
        icon={<X className="h-5 w-5" />}
        title="Özel kapalı saatler"
        description="Çalışma saatleriniz içinde istisna olarak kapamak istediğiniz aralıkları ekleyin."
        action={
          <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={openModal}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Ekle
          </Button>
        }
      >
        {blocksLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-xl" />
              </div>
            ))}
          </div>
        ) : blockedSlots.length === 0 ? (
          <button
            type="button"
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-200 py-6 text-sm text-muted-foreground transition-colors hover:border-emerald-400 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Kapalı saat aralığı ekle
          </button>
        ) : (
          <ul className="divide-y divide-emerald-50">
            {blockedSlots.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{slot.gun}</p>
                    <p className="text-xs text-muted-foreground">
                      {slot.baslangic} – {slot.bitis}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-destructive hover:bg-destructive/10"
                  disabled={removingId === slot.id}
                  onClick={() => removeBlock(slot.id)}
                >
                  {removingId === slot.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <X className="h-3.5 w-3.5" />}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ── Modal: kapalı saat ekle ─────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent showCloseButton className="rounded-2xl p-5 sm:max-w-sm">
          <DialogHeader className="text-left">
            <DialogTitle className="text-base">Kapalı saat ekle</DialogTitle>
            <DialogDescription className="text-xs">
              Seçtiğiniz günde bu saatler arasında randevu oluşturulamaz.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Gün</Label>
              <div className="relative">
                <select
                  value={modalGun}
                  onChange={(e) => setModalGun(e.target.value)}
                  className={panelNativeSelectClass}
                >
                  {HAFTA_GUNLERI.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Başlangıç</Label>
                <div className="relative">
                  <select
                    value={modalBas}
                    onChange={(e) => {
                      const v = e.target.value;
                      setModalBas(v);
                      const after = YARIM_SAAT_ARALIKLARI.filter((t) => t > v);
                      if (!after.includes(modalBit)) setModalBit(after[0] ?? "");
                    }}
                    className={panelNativeSelectClass}
                  >
                    {YARIM_SAAT_ARALIKLARI.map((t) => <option key={t} value={t}>{t.replace(":", ".")}</option>)}
                  </select>
                  <Clock className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Bitiş</Label>
                <div className="relative">
                  <select
                    value={endOptions.includes(modalBit) ? modalBit : (endOptions[0] ?? "")}
                    onChange={(e) => setModalBit(e.target.value)}
                    disabled={endOptions.length === 0}
                    className={cn(panelNativeSelectClass, endOptions.length === 0 && "opacity-50")}
                  >
                    {endOptions.length === 0
                      ? <option value="">—</option>
                      : endOptions.map((t) => <option key={t} value={t}>{t.replace(":", ".")}</option>)}
                  </select>
                  <Clock className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 border-t border-border/40 pt-4">
            <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl"
              disabled={isSavingSlot || !modalBas || !modalBit || modalBit <= modalBas}
              onClick={confirmBlock}
            >
              {isSavingSlot ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
