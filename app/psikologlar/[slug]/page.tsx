import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getPsikologBySlugOrId } from "@/lib/data/psikologlar";
import { BookingModalTrigger } from "@/components/booking/BookingModalTrigger";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const psikolog = getPsikologBySlugOrId(slug);
  if (!psikolog) return { title: "Psikolog bulunamadi" };
  return {
    title: `${psikolog.name} | Psikolog Profili`,
    description: psikolog.bio,
  };
}

export default async function PsikologDetayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ randevu?: string }>;
}) {
  const { slug } = await params;
  const { randevu } = await searchParams;
  const psikolog = getPsikologBySlugOrId(slug);

  if (!psikolog) notFound();

  return (
    <PageLayout>
      <div className="bg-[#f4fafd] py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-emerald-100 bg-[#eaf4ef] p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative h-44 w-full overflow-hidden rounded-2xl border-4 border-white shadow-sm md:h-48 md:w-64">
                <Image
                  src={psikolog.image}
                  alt={psikolog.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 256px"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
                    {psikolog.specialization}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {psikolog.rating.toFixed(1)} ({psikolog.reviewCount} degerlendirme)
                  </span>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {psikolog.name}
                </h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">{psikolog.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {psikolog.specializations.map((alan) => (
                    <span
                      key={alan}
                      className="rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-800"
                    >
                      {alan}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <h2 className="text-3xl font-semibold text-foreground">Hakkimda</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{psikolog.bio}</p>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-foreground">Uzmanlik Alanlari</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {psikolog.specializations.map((alan) => (
                    <div
                      key={alan}
                      className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
                    >
                      <p className="font-medium text-foreground">{alan}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Bu alanda bireysel psikolojik destek saglanir.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <h2 className="text-3xl font-semibold text-foreground">Egitim ve Deneyim</h2>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-foreground">{psikolog.education}</p>
                      <p className="text-sm text-muted-foreground">Akademik uzmanlik egitimi</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-foreground">{psikolog.approach}</p>
                      <p className="text-sm text-muted-foreground">Terapi yaklasimi</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <div className="bg-primary px-5 py-4 text-primary-foreground">
                  <p className="text-sm/5">Seans Ucreti</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-4xl font-bold">
                      {psikolog.sessionPrice ? `₺${psikolog.sessionPrice}` : "-"}
                    </span>
                    <span className="mb-1 text-sm opacity-90">/50 dk</span>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                    Takvim secimi randevu adiminda yapilir.
                  </div>
                  <BookingModalTrigger psikologId={psikolog.id} initialOpen={randevu === "1"} />
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
