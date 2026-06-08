"use client";

import Image from "next/image";
import { CheckCircle2, Clock } from "lucide-react";
import type { PsikologPanelFormState } from "@/lib/panel-profile";

type PsikologPanelHeroProps = {
  form: Pick<PsikologPanelFormState, "name" | "image" | "specialization" | "bio">;
  avatarUrl?: string | null;
  isListed?: boolean;
};

export function PsikologPanelHero({ form, avatarUrl, isListed }: PsikologPanelHeroProps) {
  const displayImage = form.image || avatarUrl || "";

  return (
    <section className="rounded-3xl border border-emerald-100 bg-[#eaf4ef] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative h-44 w-full overflow-hidden rounded-2xl border-4 border-white shadow-sm md:h-48 md:w-64 bg-emerald-50">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={form.name || "Profil fotoğrafı"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-300">
              <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {form.specialization && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
                {form.specialization}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              {isListed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Listede görünüyor
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                  <Clock className="h-3.5 w-3.5" />
                  Profil tamamlanmadı
                </span>
              )}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {form.name || "İsim ekleyin"}
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {form.bio || "Hakkınızda metni Profil sekmesinden düzenleyin."}
          </p>
        </div>
      </div>
    </section>
  );
}
