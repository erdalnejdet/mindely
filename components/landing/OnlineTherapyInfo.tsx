"use client";

import { Monitor } from "lucide-react";

export function OnlineTherapyInfo() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-muted/50 p-8 text-center sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Monitor className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Online Terapi
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Online terapi, yüz yüze terapi kadar etkili bir destek sunar;
              araştırmalar, çevrimiçi terapinin duygu durum iyileştirme ve stres
              azaltmada yüz yüze seanslarla benzer başarı sağladığını
              göstermektedir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
