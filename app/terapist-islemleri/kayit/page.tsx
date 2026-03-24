import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { TerapistKayitForm } from "@/components/terapist/TerapistKayitForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terapist Üyeliği",
  description:
    "Mindely'de terapist olarak üye olun. Temel bilgilerinizi girerek başlayın.",
};

export default function TerapistKayitPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/terapist-islemleri"
            className={cn(buttonVariants({ variant: "ghost" }), "mb-8")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terapist İşlemleri
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Üye Ol
            </h1>
            <p className="mt-2 text-muted-foreground">
              Temel bilgilerinizi girerek terapist üyeliğinizi oluşturun. Profil
              ve paket seçimini sonradan tamamlayabilirsiniz.
            </p>

            <div className="mt-8">
              <TerapistKayitForm />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
