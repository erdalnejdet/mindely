import type { Metadata } from "next";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Takvim",
};

export default function ExpertCalendarPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Takvim</h1>
      <p className="mt-2 text-muted-foreground">
        Müsait gün ve saatlerinizi buradan yönetebileceksiniz.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-center text-muted-foreground">
          Takvim ayarları yakında eklenecek.
        </p>
      </div>
    </div>
  );
}
