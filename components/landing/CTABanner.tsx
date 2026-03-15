"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTABanner() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-muted/50 p-8 shadow-lg sm:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Değişime Bugün Başla
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Uzman kadromuz ile online görüşme yapın. İlk adımı atmak hiç bu
              kadar kolay olmamıştı.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/experts"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
              >
                Uygun Uzmanı Bul
              </Link>
              <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Destek
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
