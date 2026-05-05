"use client";

import Image from "next/image";
import Link from "next/link";
import { Code2, ExternalLink, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { psikologlar } from "@/lib/data/psikologlar";
import type { PsikologPanelFormState } from "@/lib/panel-profile";

type Psikolog = (typeof psikologlar)[number];

type PsikologPanelHeroProps = {
  form: Pick<
    PsikologPanelFormState,
    "name" | "image" | "specialization" | "bio" | "specializations"
  >;
  psikolog: Pick<Psikolog, "slug" | "rating" | "reviewCount" | "image">;
  onMockSave: () => void;
  jsonPreview: string | null;
};

export function PsikologPanelHero({
  form,
  psikolog,
  onMockSave,
  jsonPreview,
}: PsikologPanelHeroProps) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-[#eaf4ef] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative h-44 w-full overflow-hidden rounded-2xl border-4 border-white shadow-sm md:h-48 md:w-64">
          <Image
            src={form.image || psikolog.image}
            alt={form.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
            priority
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
              {form.specialization || "—"}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {psikolog.rating.toFixed(1)} ({psikolog.reviewCount} değerlendirme)
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {form.name || "İsim ekleyin"}
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {form.bio || "Hakkınızda metni aşağıdaki formdan düzenleyin."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {form.specializations.length > 0 ? (
              form.specializations.map((alan, i) => (
                <span
                  key={`${i}-${alan}`}
                  className="rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-800"
                >
                  {alan}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Uzmanlık alanı ekleyin.</span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/psikologlar/${psikolog.slug}`}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-xl bg-white")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Halka açık profili görüntüle
            </Link>
            <Button type="button" className="rounded-xl" onClick={onMockSave}>
              <Code2 className="mr-2 h-4 w-4" />
              Mock kaydet (JSON)
            </Button>
          </div>
          {jsonPreview ? (
            <p className="mt-3 text-sm text-emerald-800">
              Aşağıda gönderilecek JSON önizlemesi güncellendi. Veri yalnızca mock; tarayıcıya
              yazılmıyor.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
