export const experts = [
  {
    id: "1",
    slug: "melis-akcay",
    name: "Uzm. Psk. Melis Akçay",
    specialization: "Klinik Psikolog",
    approach: "Bilişsel Davranışçı Terapi",
    rating: 5.0,
    reviewCount: 23,
    sessionPrice: 800,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    bio: "2015 yılında İstanbul Üniversitesi Psikoloji bölümünden mezun oldum. Klinik psikoloji alanında yüksek lisans yaptım. 8 yılı aşkın süredir bireysel terapi, çift terapisi ve anksiyete-depresyon tedavisi konularında çalışmaktayım.",
    specializations: ["Anksiyete", "Depresyon", "Çift Terapisi", "Stres Yönetimi"],
    education: "İstanbul Üniversitesi - Klinik Psikoloji Yüksek Lisans",
  },
  {
    id: "2",
    slug: "salih-yilmaz",
    name: "Dr. Salih Yılmaz",
    specialization: "Psikolog",
    approach: "EMDR Terapisti",
    rating: 4.9,
    reviewCount: 18,
    sessionPrice: 750,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    bio: "EMDR ve travma terapisinde uzmanlaşmış psikolog. 10 yıldan fazla deneyimle yetişkin ve ergen danışanlarla çalışıyorum.",
    specializations: ["Travma", "EMDR", "Anksiyete", "PTSD"],
    education: "Ankara Üniversitesi - Psikoloji Doktora",
  },
  {
    id: "3",
    slug: "sinem-oz",
    name: "Uzm. Psk. Sinem Öz",
    specialization: "Klinik Psikolog",
    approach: "Çift Terapisi",
    rating: 5.0,
    reviewCount: 31,
    sessionPrice: 900,
    freeConsultation: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    bio: "İlişki ve çift terapisi alanında uzmanım. Gottman metodu eğitimi almış olup, evlilik danışmanlığı ve ilişki problemleri üzerine çalışıyorum.",
    specializations: ["Çift Terapisi", "İlişki Sorunları", "Evlilik Danışmanlığı"],
    education: "Koç Üniversitesi - Klinik Psikoloji",
  },
];

export function getExpertBySlug(slug: string) {
  return experts.find((e) => e.slug === slug);
}

export function getExpertById(id: string) {
  return experts.find((e) => e.id === id);
}

export function getExpertBySlugOrId(slugOrId: string) {
  return experts.find((e) => e.slug === slugOrId || e.id === slugOrId);
}
