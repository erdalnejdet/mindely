"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { psikologlar } from "@/lib/data/psikologlar";
import { BookingModalTrigger } from "@/components/booking/BookingModalTrigger";
import { cn } from "@/lib/utils";

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
            href="/psikologlar"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit items-center gap-2 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Tüm Psikologlar
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 space-y-6">
          {psikologlar.slice(0, 3).map((psikolog) => (
            <div
              key={psikolog.id}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={psikolog.image}
                      alt={psikolog.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-semibold text-foreground">{psikolog.name}</h3>
                    <p className="text-lg text-foreground/80">{psikolog.specialization}</p>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-base font-medium text-foreground">
                        {psikolog.rating.toFixed(1)}
                      </span>
                      <span className="text-base">({psikolog.reviewCount} Değerlendirme)</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {psikolog.specializations.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    {psikolog.freeConsultation && (
                      <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                        Ucretsiz On Gorusme
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex w-full gap-3 lg:w-56 lg:flex-col">
                  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      SEANS UCRETI
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {psikolog.sessionPrice ? `₺${psikolog.sessionPrice}` : "-"}
                    </p>
                  </div>
                  <BookingModalTrigger psikologId={psikolog.id} triggerMode="single" />
                  <Link
                    href={`/psikologlar/${psikolog.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 flex-1 justify-center rounded-xl border-emerald-200 text-primary hover:bg-emerald-50"
                    )}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Detaya Git
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
