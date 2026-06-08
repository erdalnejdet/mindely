import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, UserRound, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BookingModalTrigger } from "@/components/booking/BookingModalTrigger";
import { backendApiUrl } from "@/lib/api-url";
import { cn } from "@/lib/utils";

type ApiPsikolog = {
  id: string;
  name: string | null;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  sessionDurationMinutes: number | null;
};

async function fetchFeatured(): Promise<ApiPsikolog[]> {
  try {
    const res = await fetch(`${backendApiUrl()}/psychologists/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { psychologists: ApiPsikolog[] };
    return (data.psychologists ?? []).slice(0, 3);
  } catch {
    return [];
  }
}

export async function FeaturedExperts() {
  const psikologlar = await fetchFeatured();

  if (psikologlar.length === 0) return null;

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
            </p>
          </div>
          <Link
            href="/psikologlar"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit items-center gap-2 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground",
            )}
          >
            Tüm Psikologlar
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 space-y-6">
          {psikologlar.map((psikolog) => (
            <div
              key={psikolog.id}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
                      <h3 className="text-2xl font-semibold text-foreground">
                        {psikolog.name ?? "—"}
                      </h3>
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
      </div>
    </section>
  );
}
