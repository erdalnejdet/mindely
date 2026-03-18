import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Users, Heart, Shield } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Mindely olarak mental sağlık ve yaşam sağlığı uzmanlarını kullanıcılarla buluşturuyoruz. Misyonumuz ve vizyonumuz hakkında bilgi edinin.",
};

const values = [
  {
    icon: Heart,
    title: "Empati",
    description:
      "Her danışanın benzersiz hikayesi olduğunu biliyoruz. Empati ile yaklaşıyoruz.",
  },
  {
    icon: Shield,
    title: "Güven",
    description:
      "Gizlilik ve güvenlik ilkelerimizle danışanlarımızın mahremiyetini koruyoruz.",
  },
  {
    icon: Users,
    title: "Uzmanlık",
    description:
      "Lisanslı ve deneyimli uzmanlarla çalışıyoruz. Kalite standartlarımızı koruyoruz.",
  },
  {
    icon: Target,
    title: "Erişilebilirlik",
    description:
      "Online terapi ile herkesin psikolojik desteğe ulaşmasını sağlıyoruz.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Mindely Hakkında
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Mindely, mental sağlık ve yaşam sağlığı uzmanlarını kullanıcılarla
              buluşturan modern bir online platformdur. Psikolog, diyetisyen ve
              diğer sağlık profesyonelleri ile online görüşme yapmanın en kolay
              yolunu sunuyoruz.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Misyonumuz
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Her bireyin mental sağlık desteğine erişebilmesini sağlamak.
              Online terapi ile coğrafi engelleri ortadan kaldırarak, uzman
              psikologlarla buluşmayı kolaylaştırıyoruz. Gizlilik, güvenlik ve
              profesyonellik ilkelerimizle hizmet veriyoruz.
            </p>
            <h2 className="mt-12 text-2xl font-bold text-foreground sm:text-3xl">
              Vizyonumuz
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Türkiye&apos;nin en güvenilir online terapi platformu olmak. Teknoloji
              ile insan odaklı yaklaşımı birleştirerek, mental sağlık hizmetlerini
              herkes için erişilebilir kılmak.
            </p>
            <Link
              href="/experts"
              className={buttonVariants({ size: "lg" })}
            >
              Uzmanlarımızı Keşfedin
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
              alt="Terapi ve danışmanlık"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            Değerlerimiz
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
