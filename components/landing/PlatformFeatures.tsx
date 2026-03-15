"use client";

import { MapPin, MessageCircle, ClipboardCheck, BarChart3 } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MapPin,
    title: "İl ve İlçe Bazlı Uzman Listesi",
    description:
      "Bulunduğunuz il veya ilçede yüz yüze görüşebileceğiniz uzmanların listesi ve bilgileri.",
  },
  {
    icon: MessageCircle,
    title: "Uzman ile Chat & Mesaj",
    description:
      "Randevu öncesi veya sonrası uzmanınızla güvenli mesajlaşma imkanı.",
  },
  {
    icon: ClipboardCheck,
    title: "Ücretsiz Psikolojik Check Up",
    description:
      "Ruh sağlığınızı değerlendirmek için ücretsiz psikolojik tarama araçları.",
  },
  {
    icon: BarChart3,
    title: "Ücretsiz Kişisel Gelişim Paneli",
    description:
      "Gelişiminizi takip edebileceğiniz kişiselleştirilmiş gelişim paneli.",
  },
];

export function PlatformFeatures() {
  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Platform Olarak Sana Neler Sunuyoruz?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Mindely ile uzman bulmaktan randevu almaya, tüm süreç tek platformda.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
