"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Video, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const experts = [
  {
    id: "1",
    name: "Uzm. Psk. Melis Akçay",
    specialization: "Klinik Psikolog",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 5.0,
    reviewCount: 23,
    sessionPrice: "₺800",
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Dr. Salih Yılmaz",
    specialization: "Psikolog",
    approach: "EMDR Terapisti",
    rating: 4.9,
    reviewCount: 18,
    sessionPrice: "₺750",
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Uzm. Psk. Sinem Öz",
    specialization: "Klinik Psikolog",
    approach: "Çift Terapisi",
    rating: 5.0,
    reviewCount: 31,
    sessionPrice: "₺900",
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
  },
];

export function FeaturedExperts() {
  return (
    <section className="bg-emerald-50/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Öne Çıkanlar
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Uzman Psikologlar
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Alanında uzman, deneyimli sağlık profesyonelleri ile tanışın.
              Ücretsiz ön görüşme fırsatından yararlanın.
            </p>
          </div>
          <Link
            href="/experts"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit items-center gap-2 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Tüm Psikologlar
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10"
            >
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-50">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-16">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {expert.name}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      {expert.specialization}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {expert.approach}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">
                      {expert.rating}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {expert.reviewCount} değerlendirme
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-foreground">
                      {expert.sessionPrice}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /seans
                    </span>
                  </div>
                  {expert.freeConsultation && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Ücretsiz Ön Görüşme
                    </span>
                  )}
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/booking?expert=${expert.id}`}
                    className={cn(
                      buttonVariants(),
                      "flex-1 justify-center rounded-xl bg-primary hover:bg-primary/90"
                    )}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Randevu Al
                  </Link>
                  <Link
                    href={`/experts/${expert.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-xl border-emerald-200 text-primary hover:bg-emerald-50"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
