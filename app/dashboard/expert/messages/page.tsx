import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Mesajlar",
};

export default function ExpertMessagesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Mesajlar
      </h1>
      <p className="mt-2 text-muted-foreground">
        Danışanlarınızla güvenli mesajlaşma bu alanda görünecek.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20">
        <MessageCircle className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-center text-muted-foreground">
          Mesaj modülü yakında aktif olacak.
        </p>
      </div>
    </div>
  );
}
