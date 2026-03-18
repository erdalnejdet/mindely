import { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { TerapistKayitForm } from "@/components/terapist/TerapistKayitForm";
import { getPackageById } from "@/lib/data/packages";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Uzman Kayıt",
  description:
    "Mindely platformunda uzman olarak kayıt olun. Bilgilerinizi girin ve aboneliğe başlayın.",
};

export default async function TerapistKayitPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const params = await searchParams;
  const paketId = params.paket || "6-ay";
  const selectedPackage = getPackageById(paketId);

  if (!selectedPackage) {
    redirect("/terapist-islemleri");
  }

  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/terapist-islemleri"
            className={cn(buttonVariants({ variant: "ghost" }), "mb-8")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Paket Seçimine Dön
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm text-muted-foreground">Seçili paket</p>
              <p className="text-lg font-bold text-primary">
                {selectedPackage.name} - {selectedPackage.price}/ay
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedPackage.duration} taahhüt
              </p>
            </div>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Uzman Bilgileriniz
            </h1>
            <p className="mt-2 text-muted-foreground">
              Platformda görünecek bilgilerinizi girin.
            </p>

            <TerapistKayitForm selectedPackageId={selectedPackage.id} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
