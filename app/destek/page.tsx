import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail, Phone, HelpCircle, BookOpen } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Yardım ve Destek",
  description:
    "Mindely yardım merkezi. Sorularınız için SSS, iletişim ve destek kaynakları.",
};

const supportOptions = [
  {
    icon: HelpCircle,
    title: "Sıkça Sorulan Sorular",
    description: "En çok merak edilen soruların cevapları",
    href: "/sss",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Destek",
    description: "Hızlı yanıt için WhatsApp üzerinden yazın",
    href: "https://wa.me/905551234567",
    external: true,
  },
  {
    icon: Mail,
    title: "E-posta ile Destek",
    description: "Detaylı sorularınız için bize yazın",
    href: "mailto:destek@mindely.com",
    external: true,
  },
  {
    icon: Phone,
    title: "Telefon Destek",
    description: "Pazartesi-Cuma 09:00-18:00",
    href: "tel:+905551234567",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Blog ve Rehberler",
    description: "Psikoloji ve terapi hakkında yazılar",
    href: "/blog",
  },
];

export default function SupportPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Yardım ve Destek
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Size nasıl yardımcı olabiliriz? Aşağıdaki seçeneklerden birini
            deneyin veya bizimle iletişime geçin.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportOptions.map(({ icon: Icon, title, description, href, external }) => (
            <Link
              key={title}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Detaylar →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Hâlâ yardıma mı ihtiyacınız var?
          </h2>
          <p className="mt-2 text-muted-foreground">
            İletişim formu ile bize ulaşın, 24 saat içinde dönüş yapacağız.
          </p>
          <Link
            href="/iletisim"
            className={cn(buttonVariants(), "mt-6 inline-flex rounded-xl")}
          >
            İletişime Geç
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
