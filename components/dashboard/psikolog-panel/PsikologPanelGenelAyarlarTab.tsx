"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  parseMinRezervasyonSaatInput,
  type PsikologPanelFormState,
} from "@/lib/panel-profile";

type PsikologPanelGenelAyarlarTabProps = {
  form: PsikologPanelFormState;
  setForm: React.Dispatch<React.SetStateAction<PsikologPanelFormState>>;
};

export function PsikologPanelGenelAyarlarTab({
  form,
  setForm,
}: PsikologPanelGenelAyarlarTabProps) {
  const minRezervasyonParsed = parseMinRezervasyonSaatInput(
    form.genelAyarlar.minRezervasyonSaat,
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground">Genel ayarlar</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Randevu alımını ve danışanların en erken ne kadar önceden rezervasyon yapabileceğini
          ayarlayın.
        </p>
        <div className="mt-6 space-y-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="panel-aktif-seans"
              className="mt-0.5"
              checked={form.genelAyarlar.aktifSeansAlma}
              onCheckedChange={(checked) =>
                setForm((p) => ({
                  ...p,
                  genelAyarlar: {
                    ...p.genelAyarlar,
                    aktifSeansAlma: checked,
                  },
                }))
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="panel-aktif-seans"
                className="cursor-pointer text-sm font-medium leading-snug"
              >
                Aktif seans alma
              </Label>
              <p className="text-sm text-muted-foreground">
                Kapattığınızda profiliniz yeni randevu kabul etmez; mevcut görüşmeleriniz etkilenmez.
              </p>
            </div>
          </div>
          <div
            className={cn(
              "space-y-3 rounded-xl border border-dashed border-emerald-100/80 bg-emerald-50/30 p-4",
              !form.genelAyarlar.aktifSeansAlma && "pointer-events-none opacity-50",
            )}
          >
            <Label htmlFor="panel-min-rez-saat" className="text-sm font-medium">
              Minimum rezervasyon süresi
            </Label>
            <p className="text-sm text-muted-foreground">
              Danışanın seans saatinden en az bu kadar süre önce rezervasyon yapması gerekir (tam
              saat).
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <Input
                  id="panel-min-rez-saat"
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={!form.genelAyarlar.aktifSeansAlma}
                  value={form.genelAyarlar.minRezervasyonSaat}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setForm((p) => ({
                      ...p,
                      genelAyarlar: { ...p.genelAyarlar, minRezervasyonSaat: v },
                    }));
                  }}
                  className="h-12 w-[7.5rem] rounded-xl"
                  placeholder="24"
                />
              </div>
              <span className="pb-3 text-sm text-muted-foreground">saat</span>
            </div>
            {form.genelAyarlar.aktifSeansAlma &&
            form.genelAyarlar.minRezervasyonSaat.trim() !== "" &&
            minRezervasyonParsed == null ? (
              <p className="text-sm text-destructive">
                Geçerli bir pozitif tam sayı girin (örn. 6, 12, 24).
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Değişiklikleri kaydetmek için üstteki &quot;Mock kaydet (JSON)&quot; düğmesini kullanın.
      </p>
    </div>
  );
}
