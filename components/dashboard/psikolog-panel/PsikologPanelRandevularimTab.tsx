"use client";

import * as React from "react";
import { CalendarCheck2, Clock3, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

type ApiAppointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  notes: string | null;
  client: { id: string; name: string | null; email: string };
};

type AppointmentRow = {
  id: string;
  tarih: string;
  saat: string;
  danisan: string;
  not: string;
  status: AppointmentStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
  cancelBlocked?: boolean;
};

function formatTarih(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSaat(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function statusLabel(status: AppointmentStatus) {
  switch (status) {
    case "pending":
      return "Bekliyor";
    case "confirmed":
      return "Onaylandı";
    case "cancelled":
      return "İptal";
    case "completed":
      return "Tamamlandı";
  }
}

function statusClass(status: AppointmentStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-900";
    case "confirmed":
      return "bg-emerald-100 text-emerald-900";
    case "cancelled":
      return "bg-red-100 text-red-900";
    case "completed":
      return "bg-blue-100 text-blue-900";
  }
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

async function patchAppointment(id: string, status: AppointmentStatus) {
  const res = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("update_failed");
  return (await res.json()) as { appointment: ApiAppointment };
}

export function PsikologPanelRandevularimTab() {
  const [appointments, setAppointments] = React.useState<ApiAppointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionId, setActionId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/psychologist/appointments", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { appointments: ApiAppointment[] };
        setAppointments(data.appointments);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (id: string, status: AppointmentStatus) => {
    setActionId(id);
    try {
      const { appointment } = await patchAppointment(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === appointment.id ? appointment : a)));
    } finally {
      setActionId(null);
    }
  };

  const toRow = (a: ApiAppointment): AppointmentRow => {
    // Kural 2: Seans başlamasına 24 saatten az kaldıysa iptal edilemez
    const hoursUntil = (new Date(a.startsAt).getTime() - Date.now()) / 3_600_000;
    const cancelBlocked = hoursUntil > 0 && hoursUntil < 24;
    const canCancel = (a.status === "pending" || a.status === "confirmed") && !cancelBlocked;

    return {
      id: a.id,
      tarih: formatTarih(a.startsAt),
      saat: formatSaat(a.startsAt),
      danisan: a.client.name ?? a.client.email,
      not: a.notes ?? "—",
      status: a.status,
      onConfirm: a.status === "pending" ? () => handleAction(a.id, "confirmed") : undefined,
      onCancel: canCancel ? () => handleAction(a.id, "cancelled") : undefined,
      cancelBlocked,
    };
  };

  const appointmentColumns: ColumnDef<AppointmentRow>[] = [
    {
      accessorKey: "tarih",
      header: "Tarih",
      cell: ({ row }) => <span className="font-medium">{row.getValue("tarih")}</span>,
    },
    { accessorKey: "saat", header: "Saat" },
    { accessorKey: "danisan", header: "Danışan" },
    { accessorKey: "not", header: "Not" },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              statusClass(status),
            )}
          >
            {statusLabel(status)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { id, onConfirm, onCancel } = row.original;
        const busy = actionId === id;
        if (!onConfirm && !onCancel) return null;
        return (
          <div className="flex gap-2">
            {onConfirm && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                disabled={busy}
                onClick={onConfirm}
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Onayla"}
              </Button>
            )}
            {(onCancel || row.original.cancelBlocked) && (
              <div className="flex flex-col items-end gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                  disabled={busy || row.original.cancelBlocked || !onCancel}
                  onClick={onCancel}
                  title={row.original.cancelBlocked ? "Seans başlamasına 24 saatten az kaldığı için iptal edilemez." : undefined}
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "İptal"}
                </Button>
                {row.original.cancelBlocked && (
                  <span className="text-[10px] text-muted-foreground">24s içinde iptal yapılamaz</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const upcoming = appointments
    .filter((a) => a.status === "pending" || a.status === "confirmed")
    .map(toRow);
  const past = appointments
    .filter((a) => a.status === "completed" || a.status === "cancelled")
    .map(toRow);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Randevularım</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bekleyen ve tamamlanan randevularınızın listesi.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full gap-6">
          <TabsList
            variant="default"
            className={cn(
              "h-auto min-h-12 w-max min-w-full justify-start gap-1 rounded-2xl border border-emerald-100/90 bg-emerald-50/50 p-1.5 shadow-sm sm:min-w-0",
              "ring-1 ring-emerald-100/40",
            )}
          >
            <TabsTrigger
              value="upcoming"
              className={cn(
                "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
                "text-muted-foreground shadow-none transition-all duration-200",
                "hover:text-foreground",
                "data-active:bg-white data-active:text-primary data-active:shadow-md",
                "data-active:ring-1 data-active:ring-emerald-200/60",
                "after:hidden",
              )}
            >
              <Clock3 className="size-4 shrink-0 opacity-80" />
              Yaklaşan ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className={cn(
                "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
                "text-muted-foreground shadow-none transition-all duration-200",
                "hover:text-foreground",
                "data-active:bg-white data-active:text-primary data-active:shadow-md",
                "data-active:ring-1 data-active:ring-emerald-200/60",
                "after:hidden",
              )}
            >
              <CalendarCheck2 className="size-4 shrink-0 opacity-80" />
              Geçmiş ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0 space-y-6">
            <SectionCard
              title="Yaklaşan randevular"
              description="Henüz gerçekleşmemiş veya onay bekleyen seanslar."
              icon={<Clock3 className="h-5 w-5" />}
            >
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Yaklaşan randevu yok.</p>
              ) : (
                <DataTable
                  className={cn("[&_table]:text-base")}
                  columns={appointmentColumns}
                  data={upcoming}
                  filterKey="danisan"
                  filterPlaceholder="Danışan ara..."
                />
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="past" className="mt-0 space-y-6">
            <SectionCard
              title="Geçmiş randevular"
              description="Tamamlanan veya iptal edilen seanslar."
              icon={<CalendarCheck2 className="h-5 w-5" />}
            >
              {past.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geçmiş randevu yok.</p>
              ) : (
                <DataTable
                  className={cn("[&_table]:text-base")}
                  columns={appointmentColumns}
                  data={past}
                  filterKey="danisan"
                  filterPlaceholder="Danışan ara..."
                />
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
