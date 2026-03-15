"use client";

import { UserPlus, Calendar, Video } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Uzmanını Seç",
    description:
      "Psikolog, diyetisyen veya ihtiyacınız olan alanda uzman arayın. Profilleri inceleyin ve size uygun olanı seçin.",
  },
  {
    number: 2,
    icon: Calendar,
    title: "Randevu Oluştur",
    description:
      "Uygun saatleri görüntüleyin ve size uygun bir randevu slotu seçin. Online ödeme ile işlemi tamamlayın.",
  },
  {
    number: 3,
    icon: Video,
    title: "Görüşmeye Başla",
    description:
      "Randevu saatinde online görüşme odasına katılın. Evinizin konforunda uzmanınızla görüşün.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Online Görüşme Nasıl Çalışır?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Birkaç basit adımda uzmanınızla buluşun ve değişime bugün başlayın.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
