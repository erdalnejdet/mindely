import { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Mindely ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşın.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "E-posta",
    value: "info@mindely.com",
    href: "mailto:info@mindely.com",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+90 (555) 123 45 67",
    href: "tel:+905551234567",
  },
  {
    icon: MapPin,
    title: "Adres",
    value: "Levent, Istanbul, Türkiye",
    href: "#",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Hızlı destek için",
    href: "https://wa.me/905551234567",
  },
];

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              İletişime Geçin
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Sorularınız, önerileriniz veya destek talepleriniz için bize
              ulaşın. En kısa sürede size dönüş yapacağız.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map(({ icon: Icon, title, value, href }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition-colors hover:bg-emerald-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{value}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">
                Mesaj Gönderin
              </h2>
              <p className="mt-2 text-muted-foreground">
                Formu doldurarak bize ulaşabilirsiniz.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
