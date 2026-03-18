"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Video, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { experts, getExpertBySlugOrId } from "@/lib/data/experts";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export function BookingSection() {
  const searchParams = useSearchParams();
  const expertParam = searchParams.get("expert");
  const preselectedExpert = expertParam ? getExpertBySlugOrId(expertParam) : null;
  const [selectedExpert, setSelectedExpert] = useState(preselectedExpert?.id || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState<"online" | "yuz-yuze">("online");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground">Randevu Oluştur</h1>
        <p className="mt-2 text-muted-foreground">
          Uzmanınızı seçin, uygun saati belirleyin ve randevunuzu oluşturun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-5 w-5 text-primary" />
            1. Uzman Seçin
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {experts.map((expert) => (
              <button
                key={expert.id}
                type="button"
                onClick={() => setSelectedExpert(expert.id)}
                className={cn(
                  "rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors",
                  selectedExpert === expert.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                {expert.name}
              </button>
            ))}
          </div>
          {!selectedExpert && (
            <Link href="/experts" className="mt-2 inline-block text-sm text-primary hover:underline">
              Tüm uzmanları görüntüle →
            </Link>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-5 w-5 text-primary" />
            2. Tarih ve Saat
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sa-at</Label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      selectedTime === time
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Video className="h-5 w-5 text-primary" />
            3. Görüşme Türü
          </h2>
          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={() => setSessionType("online")}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 transition-colors",
                sessionType === "online"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <Video className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium">Online Görüşme</p>
                <p className="text-sm text-muted-foreground">
                  Evinizden güvenle katılın
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSessionType("yuz-yuze")}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 transition-colors",
                sessionType === "yuz-yuze"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <MapPin className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium">Yüz Yüze Görüşme</p>
                <p className="text-sm text-muted-foreground">
                  Ofiste veya klinikte
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            4. İletişim Bilgileri
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Not (opsiyonel)</Label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Randevu hakkında belirtmek istediğiniz bir şey varsa..."
                className="w-full rounded-xl border border-input px-4 py-3 min-h-[100px] resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Link href="/experts" className="text-muted-foreground hover:text-foreground">
            ← Uzmanlara dön
          </Link>
          <Button
            type="submit"
            size="lg"
            className="rounded-xl bg-primary px-8 hover:bg-primary/90"
          >
            Randevuyu Onayla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
