"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cities = [
  { name: "İstanbul", slug: "istanbul" },
  { name: "Ankara", slug: "ankara" },
  { name: "İzmir", slug: "izmir" },
  { name: "Bursa", slug: "bursa" },
  { name: "Antalya", slug: "antalya" },
];

export function CityExperts() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Şehir Bazlı Uzmanlar
            </h2>
            <p className="mt-2 text-muted-foreground">
              Bulunduğunuz şehirde yüz yüze veya online görüşebileceğiniz
              uzmanları keşfedin.
            </p>
          </div>
          <Link
            href="/experts"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit flex items-center gap-1")}
          >
            Tümünü Gör
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/experts?city=${city.slug}`}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5"
            >
              <MapPin className="h-4 w-4 text-primary" />
              {city.name} Uzmanları
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/experts"
            className={cn(buttonVariants(), "rounded-full px-8")}
          >
            Türkiye&apos;deki Tüm Uzmanları Görüntüle
          </Link>
        </div>
      </div>
    </section>
  );
}
