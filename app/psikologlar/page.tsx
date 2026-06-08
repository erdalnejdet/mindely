"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, X, ArrowRight, UserRound, Video, UserX } from "lucide-react";
import { BookingModalTrigger } from "@/components/booking/BookingModalTrigger";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type ApiPsikolog = {
  id: string;
  name: string | null;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  sessionDurationMinutes: number | null;
};

export default function PsikologlarPage() {
  const [psikologlar, setPsikologlar] = useState<ApiPsikolog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tümü");
  const [showFilters, setShowFilters] = useState(false);
  const [matchedPsychId, setMatchedPsychId] = useState<string | null>(null);
  const [unlinkModal, setUnlinkModal] = useState(false);
  const [unlinkReason, setUnlinkReason] = useState("");
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/match").then((r) => r.ok ? r.json() : { match: null }).catch(() => ({ match: null })),
      fetch("/api/psychologists/public", { cache: "no-store" }).then((r) => r.json()).catch(() => ({ psychologists: [] })),
    ]).then(([matchData, listData]) => {
      const mid = (matchData as { match?: { psychologistId?: string } | null }).match?.psychologistId ?? null;
      setMatchedPsychId(mid);
      const all: ApiPsikolog[] = (listData as { psychologists: ApiPsikolog[] }).psychologists ?? [];
      // Kural 4: Eşleşme varsa sadece eşleşilen psikolog göster
      setPsikologlar(mid ? all.filter((p) => p.id === mid) : all);
    }).finally(() => setLoading(false));
  }, []);

  const specializations = useMemo(() => {
    const items = new Set<string>(["Tümü"]);
    psikologlar.forEach((p) => {
      if (p.title) items.add(p.title);
    });
    return Array.from(items);
  }, [psikologlar]);

  const filtered = useMemo(
    () =>
      psikologlar.filter((p) => {
        const matchSpec =
          selectedSpec === "Tümü" || p.title === selectedSpec;
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          (p.name ?? "").toLowerCase().includes(q) ||
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.bio ?? "").toLowerCase().includes(q);
        return matchSpec && matchSearch;
      }),
    [psikologlar, searchQuery, selectedSpec],
  );

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-emerald-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Psikologlar</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Alanında uzman psikologlar arasından size en uygun olanı bulun.
              Uygun saatleri görüp hemen randevu oluşturabilirsiniz.
            </p>
          </div>

          {/* Arama */}
          <div className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="İsim, unvan veya biyografi ile ara…"
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

            {specializations.length > 1 && (
              <div className={cn("mt-4 flex flex-wrap gap-2", showFilters ? "flex" : "hidden lg:flex")}>
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
                    {spec}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {matchedPsychId && !loading && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p>Şu an bir psikologla eşleşmiş durumdasınız.</p>
            <button
              type="button"
              onClick={() => setUnlinkModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              <UserX className="h-3.5 w-3.5" />
              Eşleşmeyi Kaldır
            </button>
          </div>
        )}

        {/* Eşleşme kaldırma modal */}
        {unlinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Eşleşmeyi Kaldır</h3>
                <button type="button" onClick={() => { setUnlinkModal(false); setUnlinkReason(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Psikologunuzla eşleşmenizi kaldırmak üzeresiniz. Bunu yaptıktan sonra tüm psikologları tekrar görebilirsiniz.
              </p>
              <div className="mt-4 space-y-2">
                <Label htmlFor="unlink-reason">Ayrılma sebebi <span className="text-muted-foreground">(isteğe bağlı)</span></Label>
                <Input
                  id="unlink-reason"
                  value={unlinkReason}
                  onChange={(e) => setUnlinkReason(e.target.value)}
                  placeholder="Örn: Farklı bir psikolog denemek istiyorum"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="mt-5 flex gap-3">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => { setUnlinkModal(false); setUnlinkReason(""); }}>
                  Vazgeç
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 rounded-xl"
                  disabled={unlinking}
                  onClick={async () => {
                    setUnlinking(true);
                    try {
                      const res = await fetch("/api/user/match", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ reason: unlinkReason || undefined }),
                      });
                      if (res.ok || res.status === 204) {
                        setMatchedPsychId(null);
                        setUnlinkModal(false);
                        setUnlinkReason("");
                        // Tüm psikologları yeniden yükle
                        setLoading(true);
                        fetch("/api/psychologists/public", { cache: "no-store" })
                          .then((r) => r.json())
                          .then((d: { psychologists: ApiPsikolog[] }) => setPsikologlar(d.psychologists ?? []))
                          .finally(() => setLoading(false));
                      }
                    } finally {
                      setUnlinking(false);
                    }
                  }}
                >
                  {unlinking ? "Kaldırılıyor…" : "Eşleşmeyi Kaldır"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border bg-white p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="hidden w-56 flex-col gap-2 lg:flex">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            {psikologlar.length === 0 ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
                  <UserRound className="h-8 w-8" />
                </div>
                <p className="mt-4 font-medium text-foreground">Henüz kayıtlı psikolog bulunamadı</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Platform büyüdükçe burada uzman psikologlar listelenecek.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">Arama kriterinize uygun psikolog bulunamadı.</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => { setSearchQuery(""); setSelectedSpec("Tümü"); }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Filtreleri Temizle
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((psikolog) => (
              <div
                key={psikolog.id}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Sol: avatar + bilgiler */}
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                      {psikolog.avatarUrl ? (
                        <Image
                          src={psikolog.avatarUrl}
                          alt={psikolog.name ?? "Psikolog"}
                          fill
                          className="object-cover"
                          sizes="112px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-emerald-200">
                          <UserRound className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold text-foreground">
                          {psikolog.name ?? "—"}
                        </h2>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <Video className="h-3 w-3" />
                          Online
                        </span>
                      </div>
                      {psikolog.title && (
                        <p className="text-lg text-foreground/80">{psikolog.title}</p>
                      )}
                      {psikolog.sessionDurationMinutes && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {psikolog.sessionDurationMinutes} dk seans
                        </p>
                      )}
                      {psikolog.bio && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {psikolog.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sağ: randevu */}
                  <div className="flex w-full gap-3 lg:w-56 lg:flex-col">
                    <BookingModalTrigger
                      psikologId={psikolog.id}
                      psikologData={psikolog}
                      triggerMode="single"
                    />
                    <Link
                      href={`/psikologlar/${psikolog.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-12 flex-1 justify-center rounded-xl border-emerald-200 text-primary hover:bg-emerald-50",
                      )}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Profili Gör
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
    </PageLayout>
  );
}
