"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExpertRegistrationCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <UserPlus className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Uzman mısınız?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Mindely online psikolog ve sağlık uzmanları ağına katılın. Her gün
              onlarca danışana psikoterapi ve psikolojik destek sağlıyoruz. Siz
              de bu topluluğun bir parçası olun!
            </p>
            <Link
              href="/terapist-islemleri"
              className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-full px-8")}
            >
              Uzman Olarak Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
