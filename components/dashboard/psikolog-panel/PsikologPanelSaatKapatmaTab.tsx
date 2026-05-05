"use client";

import * as React from "react";
import { Clock, Code2, Plus, X } from "lucide-react";
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
import type { KapaliSaatAraligi } from "./types";
import { HAFTA_GUNLERI, panelNativeSelectClass, YARIM_SAAT_ARALIKLARI } from "./constants";

type PsikologPanelSaatKapatmaTabProps = {
  kapaliAraliklar: KapaliSaatAraligi[];
  onRemoveKapali: (id: string) => void;
  onOpenAddModal: () => void;
  kapaliModalOpen: boolean;
  onKapaliModalOpenChange: (open: boolean) => void;
  kapaliGun: string;
  onKapaliGunChange: (gun: string) => void;
  kapaliBas: string;
  onKapaliBasChange: (bas: string) => void;
  kapaliBit: string;
  onKapaliBitChange: (bit: string) => void;
  onConfirmKapali: () => void;
  saatJsonPreview: string | null;
  onMockSave: () => void;
};

export function PsikologPanelSaatKapatmaTab({
  kapaliAraliklar,
  onRemoveKapali,
  onOpenAddModal,
  kapaliModalOpen,
  onKapaliModalOpenChange,
  kapaliGun,
  onKapaliGunChange,
  kapaliBas,
  onKapaliBasChange,
  kapaliBit,
  onKapaliBitChange,
  onConfirmKapali,
  saatJsonPreview,
  onMockSave,
}: PsikologPanelSaatKapatmaTabProps) {
  const bitisSaatSecenekleri = React.useMemo(
    () => YARIM_SAAT_ARALIKLARI.filter((t) => t > kapaliBas),
    [kapaliBas],
  );

  React.useEffect(() => {
    if (!kapaliModalOpen) return;
    if (bitisSaatSecenekleri.length === 0) {
      onKapaliBitChange("");
      return;
    }
    if (!bitisSaatSecenekleri.includes(kapaliBit)) {
      onKapaliBitChange(bitisSaatSecenekleri[0] ?? "");
    }
  }, [kapaliModalOpen, bitisSaatSecenekleri, kapaliBit, onKapaliBitChange]);

  const handleBasChange = (v: string) => {
    onKapaliBasChange(v);
    const after = YARIM_SAAT_ARALIKLARI.filter((t) => t > v);
    if (after.length === 0) {
      onKapaliBitChange("");
      return;
    }
    if (!after.includes(kapaliBit)) {
      onKapaliBitChange(after[0] ?? "");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Saat kapatma</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Haftanın belirli günlerinde randevu alınamayan saat aralıklarını tanımlayın. Bu sekme
              yalnızca sizde görünür; canlıda takvim servisi ile eşleştirilecek.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 rounded-xl"
            onClick={onOpenAddModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Kapalı aralık ekle
          </Button>
        </div>

        {kapaliAraliklar.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Henüz kapalı saat yok. &quot;Kapalı aralık ekle&quot; ile başlayın.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-emerald-100 rounded-xl border border-emerald-50">
            {kapaliAraliklar.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{row.gun}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.baslangic} – {row.bitis} (randevu kapalı)
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onRemoveKapali(row.id)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Kaldır
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-emerald-100 pt-6">
          <Button type="button" className="rounded-xl" onClick={onMockSave}>
            <Code2 className="mr-2 h-4 w-4" />
            Mock kaydet (JSON)
          </Button>
          <p className="text-sm text-muted-foreground">Örnek veri — tarayıcıda kalıcı kayıt yok.</p>
        </div>

        {saatJsonPreview ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">Gönderilecek JSON (kapalı saatler)</p>
            <pre className="mt-3 max-h-[320px] overflow-auto rounded-xl bg-background p-4 text-xs leading-relaxed whitespace-pre-wrap break-all ring-1 ring-emerald-100">
              {saatJsonPreview}
            </pre>
          </div>
        ) : null}
      </div>

      <Dialog open={kapaliModalOpen} onOpenChange={onKapaliModalOpenChange}>
        <DialogContent
          showCloseButton
          className={cn(
            "max-h-[min(90vh,calc(100%-2rem))] gap-0 overflow-y-auto rounded-2xl p-5 sm:max-w-[22rem]",
            "grid auto-rows-max",
          )}
        >
          <DialogHeader className="space-y-1.5 pr-7 text-left">
            <DialogTitle className="text-base">Kapalı saat aralığı</DialogTitle>
            <DialogDescription className="text-xs leading-snug sm:text-sm">
              Seçtiğiniz günde bu saatler arasında yeni randevu oluşturulamaz (mock).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kapali-gun" className="text-xs font-medium">
                Gün
              </Label>
              <div className="relative">
                <select
                  id="kapali-gun"
                  value={kapaliGun}
                  onChange={(e) => onKapaliGunChange(e.target.value)}
                  className={panelNativeSelectClass}
                >
                  {HAFTA_GUNLERI.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ▾
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="kapali-bas" className="text-xs font-medium">
                  Başlangıç
                </Label>
                <div className="relative">
                  <select
                    id="kapali-bas"
                    value={kapaliBas}
                    onChange={(e) => handleBasChange(e.target.value)}
                    className={panelNativeSelectClass}
                  >
                    {YARIM_SAAT_ARALIKLARI.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(":", ".")}
                      </option>
                    ))}
                  </select>
                  <Clock className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kapali-bit" className="text-xs font-medium">
                  Bitiş
                </Label>
                <div className="relative">
                  <select
                    id="kapali-bit"
                    value={
                      bitisSaatSecenekleri.includes(kapaliBit)
                        ? kapaliBit
                        : (bitisSaatSecenekleri[0] ?? "")
                    }
                    onChange={(e) => onKapaliBitChange(e.target.value)}
                    disabled={bitisSaatSecenekleri.length === 0}
                    className={cn(
                      panelNativeSelectClass,
                      bitisSaatSecenekleri.length === 0 && "opacity-50",
                    )}
                  >
                    {bitisSaatSecenekleri.length === 0 ? (
                      <option value="">—</option>
                    ) : (
                      bitisSaatSecenekleri.map((t) => (
                        <option key={t} value={t}>
                          {t.replace(":", ".")}
                        </option>
                      ))
                    )}
                  </select>
                  <Clock className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 mt-4 flex !flex-row justify-end gap-2 border-t border-border/40 bg-transparent p-0 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => onKapaliModalOpenChange(false)}
            >
              İptal
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl"
              disabled={
                !kapaliBas ||
                !kapaliBit ||
                kapaliBit <= kapaliBas ||
                bitisSaatSecenekleri.length === 0
              }
              onClick={onConfirmKapali}
            >
              Listeye ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
