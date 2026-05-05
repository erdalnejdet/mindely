"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Filter, X, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/lib/button-variants";
import { psikologlar as staticPsikologlar } from "@/lib/data/psikologlar";
import { BookingModalTrigger } from "@/components/booking/BookingModalTrigger";
import { cn } from "@/lib/utils";

type Psikolog = {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  approach: string;
  rating: number;
  reviewCount: number;
  sessionPrice: number | null;
  image: string;
  uzmanliklar: string[];
};

export default function PsikologlarPage() {
  const [psikologlar] = useState<Psikolog[]>(
    staticPsikologlar.map((psikolog) => ({
      id: psikolog.id,
      slug: psikolog.slug,
      name: psikolog.name,
      specialization: psikolog.specialization,
      approach: psikolog.approach,
      rating: psikolog.rating,
      reviewCount: psikolog.reviewCount,
      sessionPrice: psikolog.sessionPrice,
      image: psikolog.image,
      uzmanliklar: psikolog.specializations,
    })),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tumu");
  const [showFilters, setShowFilters] = useState(false);

  const specializations = useMemo(() => {
    const items = new Set<string>(["Tumu"]);
    psikologlar.forEach((psikolog) => {
      psikolog.uzmanliklar.forEach((item) => items.add(item));
      if (!psikolog.uzmanliklar.length && psikolog.specialization) {
        items.add(psikolog.specialization);
      }
    });
    return Array.from(items);
  }, [psikologlar]);

  const filteredPsikologlar = useMemo(
    () =>
      psikologlar.filter(
        (psikolog) =>
          (selectedSpec === "Tumu" ||
            psikolog.uzmanliklar.includes(selectedSpec) ||
            psikolog.specialization === selectedSpec) &&
          (psikolog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            psikolog.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            psikolog.approach.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [psikologlar, searchQuery, selectedSpec],
  );

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Psikologlar
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Alaninda uzman psikologlar arasindan size en uygun olani bulun.
              Uygun saatleri gorup hemen randevu olusturabilirsiniz.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Isim, uzmanlik alani veya yontem ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-xl pl-12"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 flex flex-wrap gap-2",
                showFilters ? "block" : "hidden lg:flex",
              )}
            >
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedSpec === spec
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-muted-foreground hover:bg-emerald-100 hover:text-foreground",
                  )}
                >
                  {spec === "Tumu" ? "Tumu" : spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredPsikologlar.length > 0 && (
          <div className="space-y-6">
            {filteredPsikologlar.map((psikolog) => (
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
                      <h2 className="text-3xl font-semibold text-foreground">{psikolog.name}</h2>
                      <p className="text-xl text-foreground/80">{psikolog.specialization}</p>
                      <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-base font-medium text-foreground">
                          {psikolog.rating.toFixed(1)}
                        </span>
                        <span className="text-base">({psikolog.reviewCount} Degerlendirme)</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {psikolog.uzmanliklar.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
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
                        "h-12 flex-1 justify-center rounded-xl",
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
        )}

        {filteredPsikologlar.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun psikolog bulunamadi.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpec("Tumu");
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}