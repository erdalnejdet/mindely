"use client";

import * as React from "react";
import { CalendarCheck2, Clock3 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { demoCompletedAppointments, demoPendingAppointments } from "./constants";

type AppointmentRow = {
  id: string;
  tarih: string;
  saat: string;
  danisan: string;
  not: string;
  status: "Bekliyor" | "Tamamlandı";
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
      const status = row.getValue("status") as AppointmentRow["status"];
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            status === "Bekliyor"
              ? "bg-amber-100 text-amber-900"
              : "bg-emerald-100 text-emerald-900",
          )}
        >
          {status}
        </span>
      );
    },
  },
];

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

export function PsikologPanelRandevularimTab() {
  const pending: AppointmentRow[] = demoPendingAppointments.map((r) => ({
    ...r,
    status: "Bekliyor",
  }));
  const completed: AppointmentRow[] = demoCompletedAppointments.map((r) => ({
    ...r,
    status: "Tamamlandı",
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Randevularım</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bekleyen ve tamamlanan randevularınızın listesi (şimdilik mock).
        </p>
      </header>

      <Tabs defaultValue="pending" className="w-full gap-6">
        <TabsList
          variant="default"
          className={cn(
            "h-auto min-h-12 w-max min-w-full justify-start gap-1 rounded-2xl border border-emerald-100/90 bg-emerald-50/50 p-1.5 shadow-sm sm:min-w-0",
            "ring-1 ring-emerald-100/40",
          )}
        >
          <TabsTrigger
            value="pending"
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
            Bekleyen
          </TabsTrigger>
          <TabsTrigger
            value="completed"
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
            Tamamlanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0 space-y-6">
          <SectionCard
            title="Bekleyen randevular"
            description="Henüz gerçekleşmemiş veya onay bekleyen seanslar."
            icon={<Clock3 className="h-5 w-5" />}
          >
            <DataTable
              className={cn("[&_table]:text-base")}
              columns={appointmentColumns}
              data={pending}
              filterKey="danisan"
              filterPlaceholder="Danışan ara..."
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="completed" className="mt-0 space-y-6">
          <SectionCard
            title="Tamamlanan randevular"
            description="Gerçekleşmiş seanslar."
            icon={<CalendarCheck2 className="h-5 w-5" />}
          >
            <DataTable
              className={cn("[&_table]:text-base")}
              columns={appointmentColumns}
              data={completed}
              filterKey="danisan"
              filterPlaceholder="Danışan ara..."
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

