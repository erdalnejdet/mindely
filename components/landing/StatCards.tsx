"use client";

import { Users, Heart, Star, Headphones } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Uzman",
  },
  {
    icon: Heart,
    value: "10K+",
    label: "Mutlu Danışan",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Ortalama Puan",
  },
  {
    icon: Headphones,
    value: "7/24",
    label: "Destek",
  },
];

export function StatCards() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-muted/50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <stat.icon className="mb-3 h-8 w-8 text-primary" />
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
