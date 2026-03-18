import { Metadata } from "next";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingSection } from "@/components/booking/BookingSection";

export const metadata: Metadata = {
  title: "Randevu Al",
  description:
    "Uzman psikolog veya diyetisyen ile randevu oluşturun. Online veya yüz yüze görüşme seçenekleri.",
};

export default function BookingPage() {
  return (
    <PageLayout>
      <div className="min-h-[60vh] bg-emerald-50/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse rounded-2xl bg-white p-8 h-96" />}>
            <BookingSection />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
