export type TestQuestion = {
  prompt: string;
  options: string[];
};

export type TestDefinition = {
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  questions: TestQuestion[];
};

const depresyonQuestions: TestQuestion[] = [
  {
    prompt: "Üzgün ve sıkıntılı değilim.",
    options: [
      "Kendimi üzüntülü ve sıkıntılı hissediyorum.",
      "Hep üzüntülü ve sıkıntılıyım. Bundan kurtulamıyorum.",
      "O kadar üzgün ve sıkıntılıyım ki, artık dayanamıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Gelecek hakkında umutsuz ve karamsar değilim.",
    options: [
      "Gelecek için karamsarım.",
      "Gelecekten beklediğim hiçbir şey yok.",
      "Gelecek hakkında umutsuzum ve hiçbir şey düzelmeyecek gibi geliyor.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Kendimi başarısız biri olarak görmüyorum.",
    options: [
      "Başkalarından daha başarısız olduğumu hissediyorum.",
      "Geçmişe baktığımda başarısızlıklarla dolu olduğunu görüyorum.",
      "Kendimi tümüyle başarısız bir insan olarak görüyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Her şeyden eskisi kadar zevk alıyorum.",
    options: [
      "Birçok şeyden eskiden olduğu gibi zevk alamıyorum.",
      "Artık hiçbir şey bana tam anlamıyla zevk vermiyor.",
      "Her şeyden sıkılıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Kendimi herhangi bir biçimde suçlu hissetmiyorum.",
    options: [
      "Kendimi zaman zaman suçlu hissediyorum.",
      "Çoğu zaman kendimi suçlu hissediyorum.",
      "Kendimi her zaman suçlu hissediyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Kendimden memnunum.",
    options: [
      "Kendimden pek memnun değilim.",
      "Kendime kızgınım.",
      "Kendimden nefret ediyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Başkalarından daha kötü olduğumu sanmıyorum.",
    options: [
      "Hatalarım ve zayıf taraflarım olduğunu düşünüyorum.",
      "Hatalarımdan dolayı kendimden utanıyorum.",
      "Her şeyi yanlış yapıyormuşum gibi geliyor ve hep kendimi kabahat buluyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Kendimi öldürmek gibi düşüncelerim yok.",
    options: [
      "Kimi zaman kendimi öldürmeyi düşündüğüm oluyor ama yapmıyorum.",
      "Kendimi öldürmek isterdim.",
      "Fırsatını bulsam kendimi öldürürüm.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "İçimden ağlamak geldiği pek olmuyor.",
    options: [
      "Zaman zaman içimden ağlamak geliyor.",
      "Çoğu zaman ağlıyorum.",
      "Eskiden ağlayabilirdim ama şimdi istesem de ağlayamıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Her zaman olduğumdan daha canı sıkkın ve sinirli değilim.",
    options: [
      "Eskisine oranla daha kolay canım sıkılıyor ve kızıyorum.",
      "Her şey canımı sıkıyor ve kendimi hep sinirli hissediyorum.",
      "Canımı sıkan şeylere bile artık kızamıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Başkalarıyla görüşme, konuşma isteğimi kaybetmedim.",
    options: [
      "Eskisi kadar insanlarla birlikte olmak istemiyorum.",
      "Birileriyle görüşüp konuşmak hiç içimden gelmiyor.",
      "Artık çevremde hiç kimseyi istemiyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Karar verirken eskisinden fazla güçlük çekmiyorum.",
    options: [
      "Eskiden olduğu kadar kolay karar veremiyorum.",
      "Eskiye kıyasla karar vermekte çok güçlük çekiyorum.",
      "Artık hiçbir konuda karar veremiyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Her zamankinden farklı göründüğümü sanmıyorum.",
    options: [
      "Aynada kendime her zamankinden kötü görünüyorum.",
      "Aynaya baktığımda kendimi yaşlanmış ve çirkinleşmiş buluyorum.",
      "Kendimi çok çirkin buluyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Eskisi kadar iyi iş güç yapabiliyorum.",
    options: [
      "Her zaman yaptığım işler şimdi gözümde büyüyor.",
      "Ufacık bir işi bile kendimi çok zorlayarak yapabiliyorum.",
      "Artık hiçbir iş yapamıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Uykum her zamanki gibi.",
    options: [
      "Eskisi gibi uyuyamıyorum.",
      "Her zamankinden 1-2 saat önce uyanıyorum ve tekrar uykuya dalamıyorum.",
      "Sabahları çok erken uyanıyorum ve bir daha uyuyamıyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Kendimi her zamankinden yorgun hissetmiyorum.",
    options: [
      "Eskiye oranla daha çabuk yoruluyorum.",
      "Her şey beni yoruyor.",
      "Kendimi hiçbir şey yapamayacak kadar yorgun ve bitkin hissediyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "İştahım her zamanki gibi.",
    options: [
      "Eskisinden daha iştahsızım.",
      "İştahım çok azaldı.",
      "Hiçbir şey yiyemiyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Son zamanlarda zayıflamadım.",
    options: [
      "Zayıflamaya çalışmadığım halde en az 2 Kg verdim.",
      "Zayıflamaya çalışmadığım halde en az 4 Kg verdim.",
      "Zayıflamaya çalışmadığım halde en az 6 Kg verdim.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Sağlığımla ilgili kaygılarım yok.",
    options: [
      "Ağrılar ve mide şikayetleri gibi durumlar beni tasalandırıyor.",
      "Sağlığımın bozulmasından çok kaygılanıyorum.",
      "Sağlık durumum kafama o kadar takılıyor ki başka bir şey düşünemiyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Sekse karşı ilgimde herhangi bir değişiklik yok.",
    options: [
      "Eskisine oranla sekse ilgim az.",
      "Cinsel isteğim çok azaldı.",
      "Hiç cinsel istek duymuyorum.",
      "Hiçbirini seçmiyorum.",
    ],
  },
  {
    prompt: "Cezalandırılması gereken şeyler yaptığımı sanmıyorum.",
    options: [
      "Yaptıklarımdan dolayı cezalandırılabileceğimi düşünüyorum.",
      "Cezamı çekmeyi bekliyorum.",
      "Sanki cezamı bulmuşum gibi geliyor.",
      "Hiçbirini seçmiyorum.",
    ],
  },
];

const defaultQuestions: TestQuestion[] = Array.from({ length: 10 }).map((_, i) => ({
  prompt: `Soru ${i + 1}`,
  options: ["Hiç", "Bazen", "Sık", "Çok sık"],
}));

export const TESTS: Record<string, TestDefinition> = {
  "anksiyete-testi": {
    slug: "anksiyete-testi",
    title: "Anksiyete Testi",
    description:
      "Bu test, günlük yaşamınızda ne kadar kaygı yaşadığınızı değerlendirmenize yardımcı olur.",
    questionCount: 10,
    duration: "5-10 dakika",
    questions: defaultQuestions,
  },
  "depresyon-testi": {
    slug: "depresyon-testi",
    title: "Depresyon Testi",
    description:
      "Bu test, depresif belirtilerinizi değerlendirmenize yardımcı olur. Son 2 haftadaki ruh halinize göre seçenekleri işaretleyin.",
    questionCount: 21,
    duration: "5-10 dakika",
    questions: depresyonQuestions,
  },
  "stres-testi": {
    slug: "stres-testi",
    title: "Stres Testi",
    description: "Bu test, günlük hayatınızdaki stres düzeyinizi ölçer.",
    questionCount: 10,
    duration: "3-5 dakika",
    questions: defaultQuestions,
  },
  "psikolojik-checkup": {
    slug: "psikolojik-checkup",
    title: "Psikolojik Check Up",
    description: "Genel ruh sağlığınızı değerlendiren kapsamlı tarama.",
    questionCount: 10,
    duration: "10 dakika",
    questions: defaultQuestions,
  },
};
