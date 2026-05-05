"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { tr as trFns } from "date-fns/locale";
import { tr } from "react-day-picker/locale";
import { ChevronDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DogumTarihiPickerProps = {
  id: string;
  /** ISO date string `yyyy-MM-dd` or empty */
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  triggerClassName?: string;
};

export function DogumTarihiPicker({
  id,
  value,
  onValueChange,
  name,
  required,
  disabled,
  placeholder = "Tarih seçin",
  triggerClassName,
}: DogumTarihiPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-full justify-between rounded-xl px-4 text-left font-normal shadow-xs",
            !value && "text-muted-foreground",
            disabled && "pointer-events-none opacity-50",
            triggerClassName,
          )}
        >
          <span>
            {value
              ? format(parseISO(value), "d MMMM yyyy", { locale: trFns })
              : placeholder}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            locale={tr}
            captionLayout="dropdown"
            startMonth={new Date(1920, 0)}
            endMonth={new Date()}
            defaultMonth={value ? parseISO(value) : new Date(1990, 0)}
            selected={value ? parseISO(value) : undefined}
            onSelect={(date) => {
              if (!date) return;
              onValueChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            disabled={(date) => date > new Date()}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {name ? (
        <input type="hidden" name={name} value={value} required={required} />
      ) : null}
    </>
  );
}
