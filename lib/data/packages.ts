export const subscriptionPackages = [
  {
    id: "6-ay",
    name: "Paket 1",
    duration: "6 AYLIK",
    months: 6,
    description: "6 Ay Profesyonel Görünürlük",
    price: 3790,
    originalPrice: 4500,
    totalPrice: 22740,
    period: "6 Ay Taahhüt",
    recommended: false,
    features: [
      "6 Ay Profesyonel Görünürlük",
      "Yaşadığınız İl'de Görünürlük ve Online Seanslar",
      "Komisyonsuz Sistem",
      "Online Randevu Takvimi",
      "SMS Bilgilendirme Sistemi",
      "Yapay Zeka Eşleştirme Sistemi",
      "Bilimsel İçerik Oluşturma ve Yayımlama",
      "Arama Motorlarında Öne Çıkma (SEO)",
      "EMDR Kit + Profesyonel Gelişim Paneli",
      "Danışan Test Takip Paneli",
      "Kısa Vadeli Esneklik",
    ],
  },
  {
    id: "12-ay",
    name: "Paket 2",
    months: 12,
    duration: "12 AYLIK",
    description: "12 Ay Profesyonel Görünürlük",
    price: 3290,
    originalPrice: 4000,
    totalPrice: 39480,
    period: "12 Ay Taahhüt",
    recommended: true,
    features: [
      "12 Ay Profesyonel Görünürlük",
      "Yaşadığınız İl'de Görünürlük ve Online Seanslar",
      "Komisyonsuz Sistem",
      "Online Randevu Takvimi",
      "SMS Bilgilendirme Sistemi",
      "Yapay Zeka Eşleştirme Sistemi",
      "Bilimsel İçerik Oluşturma ve Yayımlama",
      "Arama Motorlarında Öne Çıkma (SEO)",
      "EMDR Kit + Profesyonel Gelişim Paneli",
      "Danışan Test Takip Paneli",
      "Ekonomik Avantaj",
      "Uzun Vadeli Tanınırlık",
    ],
  },
];

export type SubscriptionPackage = (typeof subscriptionPackages)[number];

export function getPackageById(id: string) {
  return subscriptionPackages.find((p) => p.id === id);
}

export const packages = subscriptionPackages;
