"use client";

import Image from "next/image";
import { Check } from "lucide-react";

const benefits = [
  "Güvenilir ve Uzman Kadro",
  "Gizlilik ve Güvenlik",
  "Esnek Randevu Saatleri",
];

export function WhyChooseUs() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-primary">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 text-white sm:p-12 lg:p-16">
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                Neden Mindely&apos;i Seçmelisiniz?
              </h2>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-5 w-5" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative hidden aspect-square lg:block">
              <div className="absolute inset-4 overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80"
                  alt="Online görüşme"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
