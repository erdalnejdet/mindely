"use client";

import { FileCheck, Award, FileText } from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    title: "YÖK Diploma Kontrolü",
    description: "Uzmanlarımızın eğitim geçmişi YÖK kayıtları ile doğrulanır.",
  },
  {
    icon: Award,
    title: "Sertifikasyon Değerlendirmeleri",
    description:
      "Uzmanlık alanlarına yönelik sertifikalar detaylı incelenir.",
  },
  {
    icon: FileText,
    title: "CV Değerlendirmesi",
    description:
      "Deneyim ve uzmanlık alanları profesyonel ekibimiz tarafından değerlendirilir.",
  },
];

export function ExpertQualityProcess() {
  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Uzman Kadromuzu Nasıl Oluşturuyoruz?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Uzmanlarımız detaylı değerlendirmeler sonucunda platformumuzda hizmet
            vermektedir.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl bg-background p-8 text-center shadow-sm"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
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
