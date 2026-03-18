export const blogPosts = [
  {
    slug: "sosyal-anksiyete",
    title: "Sosyal Anksiyete Nedir?",
    excerpt:
      "Sosyal ortamlarda yaşanan kaygı ve endişe durumları hakkında detaylı bilgi. Belirtileri, nedenleri ve başa çıkma yöntemleri.",
    content: `
Sosyal anksiyete, sosyal ortamlarda yaşanan yoğun kaygı ve endişe durumudur. Kişi başkaları tarafından değerlendirilmekten, yargılanmaktan veya reddedilmekten korkar.

## Belirtiler
- Sosyal ortamlarda kalp çarpıntısı
- Terleme ve titreme
- Mide sorunları
- Başkalarının önünde konuşmaktan kaçınma
- Göz teması kurmakta zorlanma

## Başa Çıkma Yöntemleri
Bilişsel davranışçı terapi, sosyal anksiyete tedavisinde en etkili yöntemlerden biridir. Mindfulness ve gevşeme teknikleri de destekleyici olabilir.
    `,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    publishedAt: "2025-01-15",
    author: "Mindely Ekibi",
  },
  {
    slug: "terapi-nedir",
    title: "Terapi Nedir?",
    excerpt:
      "Psikolojik terapi süreci nasıl işler? Terapi türleri, faydaları ve doğru terapist seçimi hakkında kapsamlı rehber.",
    content: `
Psikoterapi, bireylerin duygusal, zihinsel ve davranışsal sorunlarını ele almak için kullanılan bilimsel bir tedavi yöntemidir.

## Terapi Türleri
- Bilişsel Davranışçı Terapi (BDT)
- Psikodinamik Terapi
- EMDR
- Kabul ve Kararlılık Terapisi (ACT)

## Doğru Terapist Seçimi
Terapist seçerken lisans, deneyim ve uzmanlık alanlarını mutlaka kontrol edin. İlk görüşmede kendinizi rahat hissetmeniz önemlidir.
    `,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    publishedAt: "2025-01-10",
    author: "Mindely Ekibi",
  },
  {
    slug: "cinsel-terapi",
    title: "Cinsel Terapi Nedir?",
    excerpt:
      "Cinsel sağlık problemleri için özel terapi yaklaşımları. Çiftler ve bireyler için cinsel terapi süreci ve faydaları.",
    content: `
Cinsel terapi, cinsel işlev bozuklukları ve ilişki sorunları için özel olarak tasarlanmış psikoterapi türüdür.

## Kimler Yararlanabilir?
- Cinsel işlev bozukluğu yaşayan bireyler
- İlişki dinamiklerinde zorluk yaşayan çiftler
- Cinsel kimlik ve yönelim konularında destek arayanlar

## Süreç
Cinsel terapi seansları genellikle 45-60 dakika sürer ve gizlilik prensibiyle yürütülür.
    `,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
    publishedAt: "2025-01-05",
    author: "Mindely Ekibi",
  },
  {
    slug: "zihnin-yaniltici-hikayeleri",
    title: "Zihnin Yanıltıcı Hikayeleri",
    excerpt:
      "Zihin bazen olayları olduğu gibi değil, yorumlayarak anlatır. Bu yorumlar gerçek gibi hissedilebilir ancak her düşünce...",
    content: `
Zihin bazen olayları olduğu gibi değil, yorumlayarak anlatır. Bu yorumlar gerçek gibi hissedilebilir ancak her düşünce gerçeği yansıtmayabilir.

Bilişsel çarpıtmalar, düşüncelerimizi etkileyen yaygın kalıplardır. Bunları fark etmek, mental sağlığımız için ilk adımdır.
    `,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    publishedAt: "2025-01-01",
    author: "Mindely Ekibi",
  },
  {
    slug: "terapi-surecinde-direnc",
    title: "Terapi Sürecinde Direnç",
    excerpt:
      "Terapi sürecinde ortaya çıkan direnç çoğu zaman değişim korkusundan kaynaklanır. Bu yazı direncin neden oluştuğunu ve te...",
    content: `
Terapi sürecinde ortaya çıkan direnç, değişim korkusundan sıklıkla kaynaklanır. Direnci anlamak ve üzerinde çalışmak, terapi sürecinin verimliliğini artırır.
    `,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    publishedAt: "2024-12-28",
    author: "Mindely Ekibi",
  },
  {
    slug: "ebeveyn-tukenmisligi",
    title: "Ebeveyn Tükenmişliği",
    excerpt:
      "Modern ebeveynliğin getirdiği aşırı yük ve tükenmişlik hissiyle başa çıkma yollarını keşfedin...",
    content: `
Modern ebeveynliğin getirdiği aşırı yük ve tükenmişlik hissiyle başa çıkma yollarını keşfedin. Kendinize alan açmanın ve destek almanın önemi.
    `,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    publishedAt: "2024-12-25",
    author: "Mindely Ekibi",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
