import { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  Calendar,
  Video,
  FileText,
  User,
  ChevronRight,
  Clock,
} from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kullanıcı Paneli",
  description: "Randevularınızı ve test sonuçlarınızı yönetin.",
};

export default function DashboardPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Hoş Geldiniz
        </h1>
        <p className="mt-2 text-muted-foreground">
          Randevularınızı ve hesap bilgilerinizi buradan yönetebilirsiniz.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <Calendar className="h-10 w-10 text-primary" />
            <h2 className="mt-4 font-semibold text-foreground">
              Yaklaşan Randevular
            </h2>
            <p className="mt-1 text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">
              Bu hafta planlanmış randevu yok
            </p>
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-4 w-full rounded-xl"
              )}
            >
              Randevu Al
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <Video className="h-10 w-10 text-primary" />
            <h2 className="mt-4 font-semibold text-foreground">
              Geçmiş Görüşmeler
            </h2>
            <p className="mt-1 text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">
              Tamamlanan seans sayısı
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <FileText className="h-10 w-10 text-primary" />
            <h2 className="mt-4 font-semibold text-foreground">
              Test Sonuçları
            </h2>
            <p className="mt-1 text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">
              Çözülen psikolojik test
            </p>
            <Link
              href="/tests"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-4 w-full rounded-xl"
              )}
            >
              Testleri Gör
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <User className="h-10 w-10 text-primary" />
            <h2 className="mt-4 font-semibold text-foreground">
              Profil Bilgileri
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hesap ayarlarınızı güncelleyin
            </p>
            <Link
              href="/dashboard/settings"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-4 w-full rounded-xl"
              )}
            >
              Profili Düzenle
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">
            Yaklaşan Randevular
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <Clock className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Henüz planlanmış randevunuz yok
            </p>
            <Link
              href="/experts"
              className={cn(buttonVariants(), "mt-4 rounded-xl")}
            >
              Uzman Seç ve Randevu Al
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
