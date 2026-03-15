"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const quickFilters = [
  "Anksiyete",
  "Depresyon",
  "Çift Terapisi",
  "Stres Yönetimi",
  "Panik Atak",
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Ücretsiz Ön Görüşme Fırsatıyla
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Kendin İçin İyi Hissetmenin{" "}
                <span className="text-primary">
                  1001 Yolundan Birini Bugün Seç!
                </span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Psikolog, diyetisyen ve sağlık uzmanları ile online görüşme
                yapın. Randevu alın, testler çözün, değişime bugün başlayın.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Terapi alanınızı ve uzman arayın..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 rounded-full border-2 pl-12 pr-4 text-base"
                  />
                </div>
                <Link
                  href="/experts"
                  className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-8")}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Ara
                </Link>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/experts?type=online"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full"
                  )}
                >
                  Online Terapi
                </Link>
                <Link
                  href="/experts?type=in-person"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full"
                  )}
                >
                  Yüz Yüze Terapi
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <Link
                    key={filter}
                    href={`/experts?filter=${filter.toLowerCase()}`}
                    className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "rounded-full")}
                  >
                    {filter}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Meditasyon ve mental sağlık"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
