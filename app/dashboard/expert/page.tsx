import Link from "next/link";
import {
  Calendar,
  Users,
  MessageCircle,
  DollarSign,
  ChevronRight,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpertDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Genel bakış
          </h1>
          <p className="mt-2 text-muted-foreground">
            Randevularınızı takip edin; profil ve CV’nizi güncel tutun.
          </p>
        </div>
        <Button asChild className="rounded-xl shrink-0">
          <Link href="/dashboard/expert/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profil & CV
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <Calendar className="h-10 w-10 text-primary" />
          <h2 className="mt-4 font-semibold text-foreground">
            Bugünkü Randevular
          </h2>
          <p className="mt-1 text-2xl font-bold text-primary">0</p>
          <Link
            href="/dashboard/expert/appointments"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Tümünü gör
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <Users className="h-10 w-10 text-primary" />
          <h2 className="mt-4 font-semibold text-foreground">Toplam Danışan</h2>
          <p className="mt-1 text-2xl font-bold text-primary">0</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <MessageCircle className="h-10 w-10 text-primary" />
          <h2 className="mt-4 font-semibold text-foreground">
            Bekleyen Mesajlar
          </h2>
          <p className="mt-1 text-2xl font-bold text-primary">0</p>
          <Link
            href="/dashboard/expert/messages"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Mesajlara git
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <DollarSign className="h-10 w-10 text-primary" />
          <h2 className="mt-4 font-semibold text-foreground">Bu Ay Kazanç</h2>
          <p className="mt-1 text-2xl font-bold text-primary">₺0</p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            Son 7 Gün
          </h2>
          <div className="mt-6 flex h-40 items-center justify-center rounded-xl bg-muted/30">
            <p className="text-muted-foreground">Henüz veri bulunmuyor</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Hızlı işlemler</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/dashboard/expert/profile"
              className="flex w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2 transition-colors hover:bg-muted"
            >
              Profil, CV ve uzmanlık alanları
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/expert/calendar"
              className="flex w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2 transition-colors hover:bg-muted"
            >
              Takvim ayarları
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
