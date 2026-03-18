"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Video, Filter, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const specializations = [
  "Tümü",
  "Anksiyete",
  "Depresyon",
  "Çift Terapisi",
  "Stres Yönetimi",
  "Panik Atak",
  "Travma",
  "EMDR",
];

const experts = [
  {
    id: "1",
    slug: "melis-akcay",
    name: "Uzm. Psk. Melis Akçay",
    specialization: "Klinik Psikolog",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 5.0,
    reviewCount: 23,
    sessionPrice: 800,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    expertise: ["Anksiyete", "Depresyon", "Stres Yönetimi"],
  },
  {
    id: "2",
    slug: "salih-yilmaz",
    name: "Dr. Salih Yılmaz",
    specialization: "Psikolog",
    approach: "EMDR Terapisti",
    rating: 4.9,
    reviewCount: 18,
    sessionPrice: 750,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    expertise: ["Travma", "EMDR", "Anksiyete"],
  },
  {
    id: "3",
    slug: "sinem-oz",
    name: "Uzm. Psk. Sinem Öz",
    specialization: "Klinik Psikolog",
    approach: "Çift Terapisi",
    rating: 5.0,
    reviewCount: 31,
    sessionPrice: 900,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
    expertise: ["Çift Terapisi", "İlişki Sorunları", "Aile"],
  },
  {
    id: "4",
    slug: "burcu-altay",
    name: "Uzm. Psk. Burcu Altay",
    specialization: "Klinik Psikolog",
    approach: "Şema Terapi",
    rating: 4.8,
    reviewCount: 42,
    sessionPrice: 850,
    freeConsultation: false,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
    expertise: ["Depresyon", "Panik Atak", "Kişilik"],
  },
  {
    id: "5",
    slug: "ahmet-demir",
    name: "Dr. Ahmet Demir",
    specialization: "Psikolog",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 4.9,
    reviewCount: 15,
    sessionPrice: 700,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    expertise: ["Anksiyete", "Stres", "Özgüven"],
  },
  {
    id: "6",
    slug: "zeynep-kaya",
    name: "Uzm. Psk. Zeynep Kaya",
    specialization: "Klinik Psikolog",
    approach: "ACT Terapisi",
    rating: 5.0,
    reviewCount: 28,
    sessionPrice: 820,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    expertise: ["Depresyon", "Stres Yönetimi", "Farkındalık"],
  },
];

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tümü");
  const [showFilters, setShowFilters] = useState(false);

  const filteredExperts = experts.filter(
    (e) =>
      (selectedSpec === "Tümü" || e.expertise.includes(selectedSpec)) &&
      (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
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
              Alanında uzman psikologlarımız arasından size en uygun olanı bulun.
              Ücretsiz ön görüşme fırsatlarından yararlanın.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="İsim veya uzmanlık alanı ile ara..."
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
                showFilters ? "block" : "hidden lg:flex"
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
                      : "bg-white text-muted-foreground hover:bg-emerald-100 hover:text-foreground"
                  )}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                  <h2 className="font-semibold text-foreground">
                    {expert.name}
                  </h2>
                  <p className="text-sm font-medium text-primary">
                    {expert.specialization}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expert.approach}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{expert.rating}</span>
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
                      ₺{expert.sessionPrice}
                    </span>
                    <span className="text-sm text-muted-foreground">/seans</span>
                  </div>
                  {expert.freeConsultation && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Ücretsiz Ön Görüşme
                    </span>
                  )}
                </div>
                <Link
                  href={`/experts/${expert.slug}`}
                  className={cn(
                    buttonVariants(),
                    "mt-4 w-full justify-center rounded-xl"
                  )}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Randevu Al
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun uzman bulunamadı.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpec("Tümü");
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
