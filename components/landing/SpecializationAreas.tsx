"use client";

import {
  Brain,
  Heart,
  Users,
  Wind,
  Flame,
  User,
  ClipboardList,
  Zap,
} from "lucide-react";
import Link from "next/link";

const specializations = [
  { icon: Brain, label: "Anksiyete" },
  { icon: Heart, label: "Depresyon" },
  { icon: Users, label: "Çift Terapisi" },
  { icon: Wind, label: "Evlilik & İlişki" },
  { icon: Flame, label: "Öfke Yönetimi" },
  { icon: User, label: "Yetişkin Terapisi" },
  { icon: ClipboardList, label: "Psikolojik Testler" },
  { icon: Zap, label: "Travma Terapisi" },
];

export function SpecializationAreas() {
  return (
    <section
      id="uzmanlik-alanlari"
      className="px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Uzmanlık Alanlarımız
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Farklı alanlarda uzmanlaşmış profesyoneller ile ihtiyacınıza uygun
            desteği alın.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specializations.map((spec) => (
            <Link
              key={spec.label}
              href={`/experts?specialization=${spec.label.toLowerCase().replace(/\s/g, "-")}`}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-muted/50 p-6 shadow-sm transition-all hover:bg-muted hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <spec.icon className="h-6 w-6" />
              </div>
              <span className="text-center font-medium text-foreground">
                {spec.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
