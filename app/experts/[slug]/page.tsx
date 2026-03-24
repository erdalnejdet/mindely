import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Video, MessageCircle, Calendar, Check, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { fetchExpertBySlug } from "@/lib/backend";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expert = await fetchExpertBySlug(slug);
  if (!expert) return { title: "Uzman Bulunamadi" };
  return {
    title: `${expert.name} - ${expert.specialization}`,
    description: expert.bio,
  };
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expert = await fetchExpertBySlug(slug);

  if (!expert) notFound();

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-xl font-bold text-foreground">{expert.name}</h1>
                  <p className="font-medium text-primary">{expert.specialization}</p>
                  <p className="text-sm text-muted-foreground">{expert.approach}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{expert.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.reviewCount} degerlendirme)
                    </span>
                  </div>
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Seans ucreti</span>
                      <span className="text-xl font-bold">
                        {expert.sessionPrice ? `₺${expert.sessionPrice}` : "Belirtilmemis"}
                      </span>
                    </div>
                    {expert.sessionDuration && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Seans suresi: {expert.sessionDuration} dakika
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/booking?expert=${slug}`}
                      className={cn(buttonVariants(), "w-full justify-center rounded-xl")}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Randevu Al
                    </Link>
                    <Link
                      href="/iletisim"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center rounded-xl",
                      )}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Iletisim Kur
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Hakkinda</h2>
              <p className="mt-2 text-muted-foreground">{expert.bio}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Uzmanlik Alanlari</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {expert.expertise.length > 0 ? (
                  expert.expertise.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Bu uzman icin uzmanlik alanlari henuz eklenmedi.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Hizmet Bilgileri</h2>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-muted-foreground">{expert.approach}</span>
                </li>
                {expert.acceptsOnline && (
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-muted-foreground">Online gorusme kabul ediyor</span>
                  </li>
                )}
                {expert.acceptsInperson && (
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-muted-foreground">Yuz yuze gorusme kabul ediyor</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-6">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Randevu Bilgisi</h2>
                  <p className="mt-1 text-muted-foreground">
                    Uygun tarih ve saatleri gormek icin randevu ekranina gecebilirsiniz.
                  </p>
                  {expert.city && (
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {expert.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
