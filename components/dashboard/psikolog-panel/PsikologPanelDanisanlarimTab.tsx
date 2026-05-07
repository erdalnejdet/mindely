"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { demoClients } from "./constants";

type ClientRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  lastAppointment: string;
  status: string;
};

const clientColumns: ColumnDef<ClientRow>[] = [
  {
    accessorKey: "fullName",
    header: "Ad soyad",
    cell: ({ row }) => <span className="font-medium">{row.getValue("fullName")}</span>,
  },
  { accessorKey: "phone", header: "Telefon" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "lastAppointment", header: "Son randevu" },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
        {row.getValue("status")}
      </span>
    ),
  },
];

export function PsikologPanelDanisanlarimTab() {
  const clients: ClientRow[] = demoClients.map((c) => ({ ...c }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Danışanlarım</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Seans geçmişi olan danışan listeniz (şimdilik mock).
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <DataTable
          className={cn("[&_table]:text-base")}
          columns={clientColumns}
          data={clients}
          filterKey="fullName"
          filterPlaceholder="Ad soyad ara..."
        />
      </section>
    </div>
  );
}

