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
  Check,
} from "lucide-react";
import { packages } from "@/lib/data/packages";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terapist İşlemleri",
  description:
    "Psikolog ve psikolojik danışmanlar için Mindely platformuna katılın. Danışanlarınızla buluşun, randevularınızı yönetin.",
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
              Psikolog ve psikolojik danışmanlar için Mindely platformuna
              katılın. Uzmanlık alanınıza göre listelenin, tanınırlığınızı
              artırın ve danışanlarınızla buluşun.
            </p>
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

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-foreground mb-4">
          Abonelik Planları
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Size uygun planı seçin, bilgilerinizi girin ve ödeme ile aboneliğinizi
          hemen aktifleştirin.
        </p>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "relative rounded-3xl border-2 bg-white p-8 shadow-lg transition-all hover:shadow-xl",
                pkg.recommended
                  ? "border-primary shadow-primary/10"
                  : "border-border"
              )}
            >
              {pkg.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  ÖNERİLEN
                </span>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pkg.months} Ay Taahhüt
                </p>
                <div className="mt-6 flex items-baseline justify-center gap-2">
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {pkg.originalPrice}₺/Ay
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">
                    {pkg.price}₺/Ay
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  KDV Dahil · {pkg.months} Ay
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/terapist-islemleri/kayit?paket=${pkg.id}`}
                className={cn(
                  "mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-base font-medium transition-colors",
                  pkg.recommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-2 border-primary text-primary hover:bg-primary/5"
                )}
              >
                Hemen Başla
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">
            Platformun İşleyişi Hakkında Detaylı Bilgi
          </h2>
          <p className="mt-4 text-muted-foreground">
            Danışmanlık kaydı için mesleki yeterlilik belgelerinizi (diploma,
            sertifika) yüklemeniz gerekmektedir. Ardından seçtiğiniz abonelik
            paketini ödeyerek platformda aktif üye olabilirsiniz.
          </p>
          <Link
            href="/terapist-islemleri/kayit"
            className="mt-6 inline-flex items-center rounded-xl border-2 border-primary px-6 py-3 font-medium text-primary hover:bg-primary/5"
          >
            Kayıt Olmaya Başla
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
