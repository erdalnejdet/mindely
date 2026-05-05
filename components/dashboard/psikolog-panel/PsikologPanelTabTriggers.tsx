"use client";

import { Clock, Settings2, UserRound } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const triggerClass = cn(
  "shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5",
  "text-muted-foreground shadow-none transition-all duration-200",
  "hover:text-foreground",
  "data-active:bg-white data-active:text-primary data-active:shadow-md",
  "data-active:ring-1 data-active:ring-emerald-200/60",
  "after:hidden",
);

export function PsikologPanelTabTriggers() {
  return (
    <div className="overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabsList
        variant="default"
        className={cn(
          "h-auto min-h-12 w-max min-w-full justify-start gap-1 rounded-2xl border border-emerald-100/90 bg-emerald-50/50 p-1.5 shadow-sm sm:min-w-0",
          "ring-1 ring-emerald-100/40",
        )}
      >
        <TabsTrigger value="profil" className={triggerClass}>
          <UserRound className="size-4 shrink-0 opacity-80" />
          Profil
        </TabsTrigger>
        <TabsTrigger value="genel-ayarlar" className={triggerClass}>
          <Settings2 className="size-4 shrink-0 opacity-80" />
          Genel ayarlar
        </TabsTrigger>
        <TabsTrigger value="saat-kapatma" className={triggerClass}>
          <Clock className="size-4 shrink-0 opacity-80" />
          Saat kapatma
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
