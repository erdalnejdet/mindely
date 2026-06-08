import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, CheckCircle2, Clock, UserRound } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { backendApiUrl } from "@/lib/api-url";

type ApiPsikolog = {
  id: string;
  name: string | null;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  sessionDurationMinutes: number | null;
};

async function fetchPsikolog(id: string): Promise<ApiPsikolog | null> {
  try {
    const res = await fetch(`${backendApiUrl()}/psychologists/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { psychologists: ApiPsikolog[] };
    return data.psychologists.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const psikolog = await fetchPsikolog(slug);
  if (!psikolog) return { title: "Psikolog bulunamadı" };
  return {
    title: `${psikolog.name ?? "Psikolog"} | Profil`,
    description: psikolog.bio ?? undefined,
  };
}

export default async function PsikologDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const psikolog = await fetchPsikolog(slug);

  if (!psikolog) notFound();

  return (
    <PageLayout>
      <div className="bg-[#f4fafd] py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <section className="rounded-3xl border border-emerald-100 bg-[#eaf4ef] p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative h-44 w-full overflow-hidden rounded-2xl border-4 border-white shadow-sm md:h-48 md:w-64 bg-emerald-100">
                {psikolog.avatarUrl ? (
                  <Image
                    src={psikolog.avatarUrl}
                    alt={psikolog.name ?? "Psikolog"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-200">
                    <UserRound className="h-20 w-20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {psikolog.title && (
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
                      {psikolog.title}
                    </span>
                    {psikolog.sessionDurationMinutes && (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {psikolog.sessionDurationMinutes} dk seans
                      </span>
                    )}
                  </div>
                )}
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {psikolog.name ?? "Psikolog"}
                </h1>
                {psikolog.bio && (
                  <p className="mt-2 max-w-3xl text-muted-foreground line-clamp-3">
                    {psikolog.bio}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* İçerik */}
          <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {psikolog.bio && (
                <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-foreground">Hakkımda</h2>
                  <p className="mt-4 leading-7 text-muted-foreground">{psikolog.bio}</p>
                </div>
              )}

              {psikolog.title && (
                <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-foreground">Uzmanlık Alanı</h2>
                  <div className="mt-4">
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-50 bg-emerald-50/30 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-medium text-foreground">{psikolog.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Bu alanda bireysel psikolojik destek sağlanır.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Randevu kutusu */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <div className="bg-primary px-5 py-4 text-primary-foreground">
                  <p className="text-sm/5">Seans Süresi</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-4xl font-bold">
                      {psikolog.sessionDurationMinutes ?? "—"}
                    </span>
                    <span className="mb-1 text-sm opacity-90">dk</span>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <Link
                    href={`/psikologlar/${psikolog.id}?randevu=1`}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Randevu Al
                  </Link>
                  <p className="text-center text-xs text-muted-foreground">
                    Online rezervasyon yakında aktif olacak.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
