"use client";

import { useState } from "react";
import { Calendar, Video } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { BookingSection } from "@/components/booking/BookingSection";

type BookingModalTriggerProps = {
  psikologId: string;
  initialOpen?: boolean;
  triggerMode?: "single" | "double";
};

export function BookingModalTrigger({
  psikologId,
  initialOpen = false,
  triggerMode = "double",
}: BookingModalTriggerProps) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <>
      {triggerMode === "single" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(buttonVariants(), "h-12 w-full justify-center rounded-xl")}
        >
          <Video className="mr-2 h-4 w-4" />
          Randevu Al
        </button>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(buttonVariants(), "h-12 w-full justify-center rounded-xl")}
          >
            <Video className="mr-2 h-4 w-4" />
            Randevu Al
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(buttonVariants({ variant: "outline" }), "h-12 w-full justify-center rounded-xl")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Tarih Secin
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-8">
          <div className="mx-auto max-h-full max-w-5xl overflow-y-auto">
            <BookingSection fixedPsikologId={psikologId} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
