import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Video, MessageCircle, Calendar, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const experts: Record<
  string,
  {
    name: string;
    specialization: string;
    bio: string;
    approach: string;
    rating: number;
    reviewCount: number;
    sessionPrice: number;
    freeConsultation: boolean;
    image: string;
    expertise: string[];
    education: string[];
    languages: string[];
    availability: string;
  }
> = {
  "melis-akcay": {
    name: "Uzm. Psk. Melis Akçay",
    specialization: "Klinik Psikolog",
    bio: "10 yılı aşkın deneyimimle anksiyete, depresyon ve stres yönetimi alanlarında çalışıyorum. Bilişsel Davranışçı Terapi yaklaşımını kullanarak danışanlarıma bireyselleştirilmiş destek sunuyorum.",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 5.0,
    reviewCount: 23,
    sessionPrice: 800,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    expertise: ["Anksiyete", "Depresyon", "Stres Yönetimi", "Panik Atak"],
    education: [
      "İstanbul Üniversitesi - Klinik Psikoloji Yüksek Lisans",
      "Boğaziçi Üniversitesi - Psikoloji Lisans",
    ],
    languages: ["Türkçe", "İngilizce"],
    availability: "Pazartesi - Cuma, 09:00 - 18:00",
  },
  "salih-yilmaz": {
    name: "Dr. Salih Yılmaz",
    specialization: "Psikolog",
    bio: "EMDR terapisti olarak travma ve kaygı bozuklukları üzerine uzmanlaştım. Bilimsel temelli yaklaşımlarla danışanlarımın iyileşme sürecine eşlik ediyorum.",
    approach: "EMDR Terapisti",
    rating: 4.9,
    reviewCount: 18,
    sessionPrice: 750,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    expertise: ["Travma", "EMDR", "Anksiyete", "PTSD"],
    education: [
      "Hacettepe Üniversitesi - Klinik Psikoloji Doktora",
      "EMDR Level 1-2 Sertifikası",
    ],
    languages: ["Türkçe"],
    availability: "Salı - Perşembe, 10:00 - 19:00",
  },
  "sinem-oz": {
    name: "Uzm. Psk. Sinem Öz",
    specialization: "Klinik Psikolog",
    bio: "Çift ve aile terapisi alanında uzmanım. İlişki dinamikleri, iletişim sorunları ve evlilik danışmanlığı konularında çalışıyorum.",
    approach: "Çift Terapisi",
    rating: 5.0,
    reviewCount: 31,
    sessionPrice: 900,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    expertise: ["Çift Terapisi", "İlişki Sorunları", "Aile", "Evlilik"],
    education: [
      "Ankara Üniversitesi - Klinik Psikoloji Yüksek Lisans",
      "Gottman Çift Terapisi Sertifikası",
    ],
    languages: ["Türkçe", "İngilizce"],
    availability: "Çarşamba - Cuma, 14:00 - 20:00",
  },
  "burcu-altay": {
    name: "Uzm. Psk. Burcu Altay",
    specialization: "Klinik Psikolog",
    bio: "Şema terapi ve psikodinamik yaklaşımla çalışıyorum. Kişilik yapıları, depresyon ve uzun vadeli terapi süreçlerinde deneyimliyim.",
    approach: "Şema Terapi",
    rating: 4.8,
    reviewCount: 42,
    sessionPrice: 850,
    freeConsultation: false,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    expertise: ["Depresyon", "Panik Atak", "Kişilik", "Şema Terapi"],
    education: [
      "İstanbul Üniversitesi - Klinik Psikoloji Yüksek Lisans",
      "Şema Terapi Sertifikası",
    ],
    languages: ["Türkçe"],
    availability: "Pazartesi - Perşembe, 09:00 - 17:00",
  },
  "ahmet-demir": {
    name: "Dr. Ahmet Demir",
    specialization: "Psikolog",
    bio: "Bilişsel davranışçı terapi ile anksiyete, stres ve özgüven konularında çalışıyorum. Kısa süreli, hedef odaklı terapi sunuyorum.",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 4.9,
    reviewCount: 15,
    sessionPrice: 700,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    expertise: ["Anksiyete", "Stres", "Özgüven", "BDT"],
    education: [
      "Hacettepe Üniversitesi - Psikoloji Doktora",
      "BDT Süpervizyon Sertifikası",
    ],
    languages: ["Türkçe", "Almanca"],
    availability: "Pazartesi - Cuma, 08:00 - 18:00",
  },
  "zeynep-kaya": {
    name: "Uzm. Psk. Zeynep Kaya",
    specialization: "Klinik Psikolog",
    bio: "Kabul ve Kararlılık Terapisi (ACT) ile depresyon, stres ve farkındalık konularında çalışıyorum. Mindfulness temelli yaklaşımlar kullanıyorum.",
    approach: "ACT Terapisi",
    rating: 5.0,
    reviewCount: 28,
    sessionPrice: 820,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    expertise: ["Depresyon", "Stres Yönetimi", "Farkındalık", "ACT"],
    education: [
      "ODTÜ - Klinik Psikoloji Yüksek Lisans",
      "ACT Practitioner Sertifikası",
    ],
    languages: ["Türkçe", "İngilizce"],
    availability: "Salı - Cuma, 10:00 - 19:00",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expert = experts[slug];
  if (!expert) return { title: "Uzman Bulunamadı" };
  return {
    title: `${expert.name} - ${expert.specialization}`,
    description: expert.bio,
  };
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expert = experts[slug];

  if (!expert) notFound();

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-xl font-bold text-foreground">
                    {expert.name}
                  </h1>
                  <p className="font-medium text-primary">
                    {expert.specialization}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expert.approach}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{expert.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.reviewCount} değerlendirme)
                    </span>
                  </div>
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Seans ücreti</span>
                      <span className="text-xl font-bold">
                        ₺{expert.sessionPrice}
                      </span>
                    </div>
                    {expert.freeConsultation && (
                      <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Ücretsiz ön görüşme mevcut
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/booking?expert=${slug}`}
                      className={cn(
                        buttonVariants(),
                        "w-full justify-center rounded-xl"
                      )}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Randevu Al
                    </Link>
                    <Link
                      href="#"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center rounded-xl"
                      )}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Mesaj Gönder
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Hakkında</h2>
              <p className="mt-2 text-muted-foreground">{expert.bio}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Uzmanlık Alanları
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {expert.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Eğitim</h2>
              <ul className="mt-3 space-y-2">
                {expert.education.map((edu) => (
                  <li key={edu} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-muted-foreground">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Diller</h2>
              <p className="mt-2 text-muted-foreground">
                {expert.languages.join(", ")}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Müsaitlik Saatleri
              </h2>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>{expert.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
