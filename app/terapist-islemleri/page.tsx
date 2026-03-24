import { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Sparkles,
  Search,
  FileCheck,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terapist İşlemleri",
  description:
    "Psikolog ve psikolojik danışmanlar için Mindely platformuna katılın. Ücretsiz üye olun, profilinizi sonradan tamamlayın.",
};

const benefits = [
  {
    icon: MapPin,
    title: "Bulunduğun İl ve İlçeye Göre Görünürlük",
    description:
      "Arama yapan danışanlar sizi görüntüleyebilir, uzmanlık alanınıza göre listelenirsiniz.",
  },
  {
    icon: Users,
    title: "Akıllı Eşleştirme Sistemi",
    description:
      "Danışanlar size özel sorularla eşleşir, seanslarınızı kendi özelinde gerçekleştirin.",
  },
  {
    icon: Calendar,
    title: "Online Takvim ve SMS Bilgilendirme",
    description:
      "Randevu takvimini yönetin, danışanlarınıza otomatik hatırlatmalar gidin.",
  },
  {
    icon: MessageCircle,
    title: "Mesajlaşma Modülü",
    description:
      "Danışanlarınızla platform üzerinden güvenli iletişim kurun.",
  },
  {
    icon: FileCheck,
    title: "Danışan Test Takip Sistemi",
    description:
      "Beck Depresyon, Anksiyete, SCL-90 gibi testleri online uygulatın, sonuçları takip edin.",
  },
  {
    icon: BarChart3,
    title: "Profesyonel Gelişim Paneli",
    description:
      "Terapi materyalleri, güncel araştırmalar ve tekniklerle kendinizi geliştirin.",
  },
  {
    icon: Search,
    title: "Arama Motorlarında Öne Çıkma (SEO)",
    description:
      "Profiliniz arama motorlarında öne çıkar, daha fazla danışana ulaşın.",
  },
  {
    icon: Sparkles,
    title: "Komisyonsuz Sistem",
    description:
      "Yalnızca aylık abonelik ücreti. Seans gelirinizin tamamı size ait.",
  },
];

export default function TerapistIslemleriPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Terapist İşlemleri
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Önce temel bilgilerinizle üye olun. Paket ve uzman profili
              adımlarını hesabınız açıldıktan sonra tamamlayabilirsiniz.
            </p>
            <div className="mt-10">
              <Link
                href="/terapist-islemleri/kayit"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-foreground mb-12">
          Platformun Avantajları
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">
            Nasıl başlarım?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Kayıt formunda ad, iletişim ve adres bilgilerinizi girin. Onay
            sonrası uzman profilinizi, belgelerinizi ve abonelik tercihinizi
            panel üzerinden tamamlayabilirsiniz.
          </p>
          <Link
            href="/terapist-islemleri/kayit"
            className="mt-6 inline-flex items-center rounded-xl border-2 border-primary px-6 py-3 font-medium text-primary hover:bg-primary/5"
          >
            Hemen Üye Ol
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
