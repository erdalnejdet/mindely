"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Konu</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Mesaj konusu"
          className="h-12 rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mesajınız</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          className="w-full min-h-[150px] rounded-xl border border-input px-4 py-3 resize-y"
          required
        />
      </div>
      <Button type="submit" size="lg" className="rounded-xl">
        Gönder
      </Button>
    </form>
  );
}
