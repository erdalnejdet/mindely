"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Video, Filter, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/lib/button-variants";
import { fetchExperts, type Expert } from "@/lib/backend";
import { cn } from "@/lib/utils";

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tumu");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadExperts() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchExperts();
        if (active) {
          setExperts(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Uzmanlar yuklenemedi.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadExperts();

    return () => {
      active = false;
    };
  }, []);

  const specializations = useMemo(() => {
    const items = new Set<string>(["Tumu"]);
    experts.forEach((expert) => {
      expert.expertise.forEach((item) => items.add(item));
      if (!expert.expertise.length && expert.specialization) {
        items.add(expert.specialization);
      }
    });
    return Array.from(items);
  }, [experts]);

  const filteredExperts = useMemo(
    () =>
      experts.filter(
        (expert) =>
          (selectedSpec === "Tumu" ||
            expert.expertise.includes(selectedSpec) ||
            expert.specialization === selectedSpec) &&
          (expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expert.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expert.approach.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [experts, searchQuery, selectedSpec],
  );

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Uzman Psikologlar
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
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && filteredExperts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex gap-4 p-6">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground">{expert.name}</h2>
                    <p className="text-sm font-medium text-primary">
                      {expert.specialization}
                    </p>
                    <p className="text-sm text-muted-foreground">{expert.approach}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{expert.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({expert.reviewCount} yorum)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">
                        {expert.sessionPrice ? `₺${expert.sessionPrice}` : "Fiyat yakinda"}
                      </span>
                      {expert.sessionPrice && (
                        <span className="text-sm text-muted-foreground">/seans</span>
                      )}
                    </div>
                    {expert.city && (
                      <span className="text-sm text-muted-foreground">{expert.city}</span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {expert.expertise.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/booking?expert=${expert.slug}`}
                      className={cn(buttonVariants(), "flex-1 justify-center rounded-xl")}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Randevu Al
                    </Link>
                    <Link
                      href={`/experts/${expert.slug}`}
                      className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
                    >
                      Profili Gor
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredExperts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun uzman bulunamadi.
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
