export type TestOption = {
  text: string;
  score: number;
};

export type TestQuestion = {
  id: number;
  text: string;
  options: TestOption[];
};

export type ScoreRange = {
  min: number;
  max: number;
  label: string;
  color: "green" | "yellow" | "orange" | "red";
  description: string;
  recommendation: string;
};

export type TestDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  instructions: string;
  duration: string;
  maxScore: number;
  questions: TestQuestion[];
  scoreRanges: ScoreRange[];
  reference?: string;
};

// ─── Paylaşılan seçenek setleri ──────────────────────────────────────────────

const FREQUENCY_OPTIONS = [
  { text: "Hiç", score: 0 },
  { text: "Birkaç gün", score: 1 },
  { text: "Yarısından fazla gün", score: 2 },
  { text: "Neredeyse her gün", score: 3 },
];

// ─── 1. Depresyon Testi (Beck Depression Inventory – BDI-II) ─────────────────

const DEPRESYON: TestDefinition = {
  slug: "depresyon-testi",
  title: "Depresyon Testi",
  shortTitle: "Depresyon",
  category: "Duygu Durum",
  description: "Son iki haftanızdaki ruh halinizi değerlendiren, bilimsel geçerliliği kanıtlanmış Beck Depresyon Ölçeği.",
  instructions: "Her madde için son iki hafta içinde kendinizi en iyi tanımlayan ifadeyi seçin.",
  duration: "8-12 dk",
  maxScore: 63,
  reference: "Beck AT, Steer RA, Brown GK (1996). BDI-II. Psychological Corporation.",
  questions: [
    { id: 1, text: "Üzüntü", options: [{ text: "Kendimi üzgün hissetmiyorum.", score: 0 }, { text: "Kendimi sık sık üzgün hissediyorum.", score: 1 }, { text: "Çoğu zaman üzgünüm.", score: 2 }, { text: "O kadar üzgünüm ki artık dayanamıyorum.", score: 3 }] },
    { id: 2, text: "Karamsarlık", options: [{ text: "Geleceğe karamsarlıkla bakmıyorum.", score: 0 }, { text: "Gelecek konusunda zaman zaman karamsarım.", score: 1 }, { text: "Gelecekten beklediğim hiçbir şey yok.", score: 2 }, { text: "Gelecek umutsuz; hiçbir şey düzelmeyecek.", score: 3 }] },
    { id: 3, text: "Geçmişteki Başarısızlıklar", options: [{ text: "Kendimi başarısız biri olarak görmüyorum.", score: 0 }, { text: "Başkalarından daha çok başarısızlığım var.", score: 1 }, { text: "Geçmişime baktığımda çok fazla başarısızlık görüyorum.", score: 2 }, { text: "Kendimi tam bir başarısız olarak görüyorum.", score: 3 }] },
    { id: 4, text: "Zevk Kaybı", options: [{ text: "Her zamankisi kadar zevk alıyorum.", score: 0 }, { text: "Eskisi kadar zevk alamıyorum.", score: 1 }, { text: "Zevk aldığım şeyler çok azaldı.", score: 2 }, { text: "Hiçbir şeyden zevk alamıyorum.", score: 3 }] },
    { id: 5, text: "Suçluluk", options: [{ text: "Suçlu hissetmiyorum.", score: 0 }, { text: "Zaman zaman suçlu hissediyorum.", score: 1 }, { text: "Çoğu zaman suçlu hissediyorum.", score: 2 }, { text: "Kendimi her zaman suçlu hissediyorum.", score: 3 }] },
    { id: 6, text: "Ceza Duygusu", options: [{ text: "Cezalandırılacağım duygusunu taşımıyorum.", score: 0 }, { text: "Cezalandırılabileceğimi düşünüyorum.", score: 1 }, { text: "Cezalandırılmayı bekliyorum.", score: 2 }, { text: "Cezalandırıldığımı hissediyorum.", score: 3 }] },
    { id: 7, text: "Kendinden Hoşnutsuzluk", options: [{ text: "Kendimden hoşnutum.", score: 0 }, { text: "Kendimden pek hoşnut değilim.", score: 1 }, { text: "Kendimden hoşlanmıyorum.", score: 2 }, { text: "Kendimden nefret ediyorum.", score: 3 }] },
    { id: 8, text: "Öz-Eleştiri", options: [{ text: "Kendimi diğerlerinden daha kötü biri olarak görmüyorum.", score: 0 }, { text: "Zayıf yönlerime ve hatalarıma eleştiriyorum.", score: 1 }, { text: "Hatalarımdan dolayı kendimi suçluyorum.", score: 2 }, { text: "Her şey kötü gittiğinde hep kendimi kabahat buluyorum.", score: 3 }] },
    { id: 9, text: "İntihar Düşünceleri", options: [{ text: "Kendime zarar verme düşüncem yok.", score: 0 }, { text: "Kendime zarar vermeyi düşünüyorum ama yapmam.", score: 1 }, { text: "Kendimi öldürmek isterdim.", score: 2 }, { text: "Fırsat bulsam kendimi öldürürdüm.", score: 3 }] },
    { id: 10, text: "Ağlama", options: [{ text: "Her zamankisi kadar ağlıyorum.", score: 0 }, { text: "Eskisinden daha fazla ağlıyorum.", score: 1 }, { text: "Her şey için ağlıyorum.", score: 2 }, { text: "Ağlamak istiyorum ama artık ağlayamıyorum.", score: 3 }] },
    { id: 11, text: "Huzursuzluk", options: [{ text: "Her zamankisi kadar sakinim.", score: 0 }, { text: "Her zamankisinden daha huzursuzum.", score: 1 }, { text: "Çok gergin ve huzursuzum.", score: 2 }, { text: "O kadar gerginim ki yerimde duramıyorum.", score: 3 }] },
    { id: 12, text: "İlgi Kaybı", options: [{ text: "İnsanlara ve dış dünyaya ilgim devam ediyor.", score: 0 }, { text: "İnsanlara eskisinden daha az ilgi duyuyorum.", score: 1 }, { text: "İnsanlara ilgimin büyük kısmını kaybettim.", score: 2 }, { text: "İnsanlara hiç ilgim kalmadı.", score: 3 }] },
    { id: 13, text: "Kararsızlık", options: [{ text: "Her zamankisi kadar iyi karar veriyorum.", score: 0 }, { text: "Eskisine göre karar vermekte güçlük çekiyorum.", score: 1 }, { text: "Karar vermek artık çok zor.", score: 2 }, { text: "Artık hiçbir konuda karar veremiyorum.", score: 3 }] },
    { id: 14, text: "Değersizlik", options: [{ text: "Değersiz biri olduğumu hissetmiyorum.", score: 0 }, { text: "Eskisi kadar değerli olmadığımı düşünüyorum.", score: 1 }, { text: "Diğer insanlarla kıyaslandığımda değersiz hissediyorum.", score: 2 }, { text: "Tamamen değersiz olduğumu hissediyorum.", score: 3 }] },
    { id: 15, text: "Enerji Kaybı", options: [{ text: "Enerji doluyum.", score: 0 }, { text: "Eskisine göre enerjim daha az.", score: 1 }, { text: "Pek çok şeyi yapmak için yeterli enerjim yok.", score: 2 }, { text: "Hiçbir şey yapacak enerjim yok.", score: 3 }] },
    { id: 16, text: "Uyku Değişimi", options: [{ text: "Uyku düzenim değişmedi.", score: 0 }, { text: "Eskisinden biraz daha fazla/az uyuyorum.", score: 1 }, { text: "Eskisinden çok daha fazla/az uyuyorum.", score: 2 }, { text: "Gün boyunca uyuyorum ya da hiç uyuyamıyorum.", score: 3 }] },
    { id: 17, text: "Sinirlilik", options: [{ text: "Her zamankisinden daha sinirli değilim.", score: 0 }, { text: "Her zamankisinden biraz daha sinirleniyorum.", score: 1 }, { text: "Her zamankisinden çok daha sinirleniyorum.", score: 2 }, { text: "Sürekli sinirliyim.", score: 3 }] },
    { id: 18, text: "İştah Değişimi", options: [{ text: "İştahım değişmedi.", score: 0 }, { text: "İştahım eskisinden biraz daha az/fazla.", score: 1 }, { text: "İştahım eskisinden çok daha az/fazla.", score: 2 }, { text: "Hiç iştahım yok ya da sürekli yemek istiyorum.", score: 3 }] },
    { id: 19, text: "Konsantrasyon Güçlüğü", options: [{ text: "Her zamankisi kadar iyi odaklanabiliyorum.", score: 0 }, { text: "Her zamankisi kadar iyi odaklanamıyorum.", score: 1 }, { text: "Uzun süre bir şeye odaklanmak çok zor.", score: 2 }, { text: "Hiçbir şeye odaklanamıyorum.", score: 3 }] },
    { id: 20, text: "Yorgunluk", options: [{ text: "Her zamankisi kadar yoruluyorum.", score: 0 }, { text: "Her zamankisinden çabuk yoruluyorum.", score: 1 }, { text: "Pek çok şeyi yapmak için çok yorgunum.", score: 2 }, { text: "Hiçbir şey yapacak kadar yorgunum.", score: 3 }] },
    { id: 21, text: "Cinselliğe İlgi Kaybı", options: [{ text: "Cinselliğe ilgimde son zamanlarda belirgin bir değişme yok.", score: 0 }, { text: "Cinselliğe eskisinden daha az ilgiliyim.", score: 1 }, { text: "Cinselliğe şimdi çok daha az ilgiliyim.", score: 2 }, { text: "Cinselliğe olan ilgimi tamamen yitirdim.", score: 3 }] },
  ],
  scoreRanges: [
    { min: 0, max: 13, label: "Minimal ya da Depresyon Yok", color: "green", description: "Depresyon belirtileri minimal düzeyde ya da yok.", recommendation: "Ruh sağlığınız iyi görünüyor. Kendinize bakmaya devam edin." },
    { min: 14, max: 19, label: "Hafif Depresyon", color: "yellow", description: "Hafif düzeyde depresyon belirtileri mevcut.", recommendation: "Bir psikologla görüşmek faydalı olabilir. Yaşam alışkanlıklarınızı gözden geçirin." },
    { min: 20, max: 28, label: "Orta Düzey Depresyon", color: "orange", description: "Orta düzeyde depresyon belirtileri mevcut. Profesyonel destek önerilir.", recommendation: "Bir ruh sağlığı uzmanıyla görüşmenizi şiddetle öneririz." },
    { min: 29, max: 63, label: "Ciddi Depresyon", color: "red", description: "Ciddi düzeyde depresyon belirtileri mevcut. Acil profesyonel yardım alın.", recommendation: "Lütfen bir psikolog veya psikiyatrist ile en kısa sürede görüşün." },
  ],
};

// ─── 2. Anksiyete Testi (GAD-7) ───────────────────────────────────────────────

const ANKSIYETE: TestDefinition = {
  slug: "anksiyete-testi",
  title: "Anksiyete (Kaygı) Testi",
  shortTitle: "Anksiyete",
  category: "Kaygı",
  description: "Son iki haftada ne sıklıkla anksiyete belirtileri yaşadığınızı ölçen GAD-7 ölçeği.",
  instructions: "Son iki hafta içinde aşağıdaki sorunlardan ne kadar sıklıkla rahatsız oldunuz?",
  duration: "3-5 dk",
  maxScore: 21,
  reference: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. (2006). A brief measure for assessing GAD. Arch Intern Med.",
  questions: [
    { id: 1, text: "Sinirli, endişeli veya gergin hissettim", options: FREQUENCY_OPTIONS },
    { id: 2, text: "Kaygılanmayı durduramadım veya kontrol edemedim", options: FREQUENCY_OPTIONS },
    { id: 3, text: "Farklı konular hakkında çok fazla endişelendim", options: FREQUENCY_OPTIONS },
    { id: 4, text: "Rahatlamakta güçlük çektim", options: FREQUENCY_OPTIONS },
    { id: 5, text: "O kadar huzursuz oldum ki duramadım", options: FREQUENCY_OPTIONS },
    { id: 6, text: "Kolay kızdım veya sinirli oldum", options: FREQUENCY_OPTIONS },
    { id: 7, text: "Kötü bir şey olacakmış gibi korktum", options: FREQUENCY_OPTIONS },
  ],
  scoreRanges: [
    { min: 0, max: 4, label: "Minimal Anksiyete", color: "green", description: "Anksiyete belirtileri minimal düzeyde.", recommendation: "Genel ruh sağlığınız iyi görünüyor." },
    { min: 5, max: 9, label: "Hafif Anksiyete", color: "yellow", description: "Hafif düzeyde kaygı belirtileri var.", recommendation: "Stres yönetimi teknikleri ve nefes egzersizleri faydalı olabilir." },
    { min: 10, max: 14, label: "Orta Düzey Anksiyete", color: "orange", description: "Orta düzeyde anksiyete belirtileri mevcut.", recommendation: "Bir ruh sağlığı uzmanıyla görüşmenizi öneririz." },
    { min: 15, max: 21, label: "Şiddetli Anksiyete", color: "red", description: "Şiddetli anksiyete belirtileri mevcut. Profesyonel destek alın.", recommendation: "Lütfen bir psikolog veya psikiyatrist ile görüşün." },
  ],
};

// ─── 3. Stres Testi (PSS-10) ─────────────────────────────────────────────────

const STRES: TestDefinition = {
  slug: "stres-testi",
  title: "Stres Testi",
  shortTitle: "Stres",
  category: "Stres",
  description: "Son bir aydaki algılanan stres düzeyinizi ölçen PSS-10 ölçeği.",
  instructions: "Son bir ay içinde aşağıdaki duygulardan ne sıklıkla etkilendiniz?",
  duration: "3-5 dk",
  maxScore: 40,
  reference: "Cohen S, Kamarck T, Mermelstein R. (1983). A global measure of perceived stress. Journal of Health & Social Behavior.",
  questions: [
    { id: 1, text: "Beklenmedik bir şeyin olması sizi ne sıklıkla rahatsız etti?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 2, text: "Hayatınızdaki önemli şeyleri ne sıklıkla kontrol edemediğinizi hissettiniz?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 3, text: "Ne sıklıkla sinirli ve stresli hissettiniz?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 4, text: "Kişisel sorunlarınızla ne sıklıkla başa çıkabildiniz? (Ters puanlı)", options: [{ text: "Hiç", score: 4 }, { text: "Nadiren", score: 3 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 1 }, { text: "Çok sık", score: 0 }] },
    { id: 5, text: "İşlerin istediğiniz gibi gittiğini ne sıklıkla hissettiniz? (Ters puanlı)", options: [{ text: "Hiç", score: 4 }, { text: "Nadiren", score: 3 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 1 }, { text: "Çok sık", score: 0 }] },
    { id: 6, text: "Üstesinden gelmek zorunda olduğunuz şeylerin biriktiğini ne sıklıkla hissettiniz?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 7, text: "Yaşamınızdaki sıkıntıları ne sıklıkla kontrol edebildiniz? (Ters puanlı)", options: [{ text: "Hiç", score: 4 }, { text: "Nadiren", score: 3 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 1 }, { text: "Çok sık", score: 0 }] },
    { id: 8, text: "Ne sıklıkla her şeyin üstesinden gelebildiniz? (Ters puanlı)", options: [{ text: "Hiç", score: 4 }, { text: "Nadiren", score: 3 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 1 }, { text: "Çok sık", score: 0 }] },
    { id: 9, text: "Kontrolünüz dışındaki şeyler yüzünden sinirlendiniz mi?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 10, text: "Sorunların öyle biriktiğini hissettiniz ki üstesinden gelemezsiniz?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Oldukça sık", score: 3 }, { text: "Çok sık", score: 4 }] },
  ],
  scoreRanges: [
    { min: 0, max: 13, label: "Düşük Stres", color: "green", description: "Stres düzeyiniz düşük, iyi başa çıkıyorsunuz.", recommendation: "Mevcut başa çıkma stratejilerinizi sürdürün." },
    { min: 14, max: 26, label: "Orta Düzey Stres", color: "yellow", description: "Orta düzeyde stres yaşıyorsunuz.", recommendation: "Stres yönetimi teknikleri ve düzenli egzersiz faydalı olabilir." },
    { min: 27, max: 40, label: "Yüksek Stres", color: "red", description: "Yüksek stres düzeyi yaşıyorsunuz. Destek alın.", recommendation: "Bir uzmanla görüşmenizi ve yaşam tarzı değişiklikleri yapmanızı öneririz." },
  ],
};

// ─── 4. OKB Testi ────────────────────────────────────────────────────────────

const OKB: TestDefinition = {
  slug: "okb-testi",
  title: "Takıntı (OKB) Testi",
  shortTitle: "OKB",
  category: "Kaygı",
  description: "Obsesif-kompulsif bozukluğa ilişkin belirtileri taramaya yönelik ölçek.",
  instructions: "Son bir ay içinde aşağıdaki durumları ne sıklıkla yaşadınız?",
  duration: "5-7 dk",
  maxScore: 40,
  questions: [
    { id: 1, text: "Aklıma istemeden gelen, rahatsız edici düşünceler geldi", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 2, text: "Kapının kilitli olup olmadığını veya ocağın kapalı olup olmadığını tekrar tekrar kontrol ettim", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 3, text: "Elleri yıkama, temizlenme gibi davranışları tekrar tekrar yapmak zorunda hissettim", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 4, text: "Düzen ve simetri konusunda aşırı hassastım; eşyaların tam yerinde durması gerektiğini düşündüm", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 5, text: "Birine zarar verebileceğim düşüncesi aklıma geldi (istemeden)", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 6, text: "Eşyaları atmakta zorluk çektim; işe yaramayan şeyleri bile sakladım", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 7, text: "Belirli ritüelleri (sayma, dokunma, tekrarlama) yapmadan işe devam edemedim", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 8, text: "Takıntılarım ve/veya zorunlu davranışlarım günlük yaşantımı olumsuz etkiledi", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 9, text: "Bir şeyi yapıp yapmadığımı sık sık kontrol etmek zorunda hissettim", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 10, text: "İstemediğim halde aynı düşünce tekrar tekrar aklıma geldi", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
  ],
  scoreRanges: [
    { min: 0, max: 7, label: "OKB Belirtisi Yok ya da Minimal", color: "green", description: "Obsesif-kompulsif belirtiler minimal düzeyde.", recommendation: "Belirtiler önemli düzeyde değil." },
    { min: 8, max: 15, label: "Hafif OKB Belirtileri", color: "yellow", description: "Hafif düzeyde OKB belirtileri mevcut.", recommendation: "Bir uzmanla konuşmak faydalı olabilir." },
    { min: 16, max: 23, label: "Orta Düzey OKB Belirtileri", color: "orange", description: "Orta düzeyde OKB belirtileri var.", recommendation: "Profesyonel değerlendirme ve CBT terapi önerilir." },
    { min: 24, max: 40, label: "Ciddi OKB Belirtileri", color: "red", description: "Ciddi OKB belirtileri mevcut. Profesyonel yardım alın.", recommendation: "Lütfen bir psikolog veya psikiyatrist ile görüşün." },
  ],
};

// ─── 5. DEHB/ADHD Tarama (ASRS-v1.1 kısaltılmış) ────────────────────────────

const ADHD: TestDefinition = {
  slug: "adhd-testi",
  title: "DEHB / Dikkat Eksikliği Testi",
  shortTitle: "DEHB",
  category: "Dikkat",
  description: "Yetişkinlerde dikkat eksikliği ve hiperaktivite belirtilerini tarayan ASRS ölçeği.",
  instructions: "Son 6 ay içinde aşağıdaki durumları ne sıklıkla yaşadınız?",
  duration: "5-7 dk",
  maxScore: 24,
  reference: "Kessler RC et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS-v1.1). Psychol Med.",
  questions: [
    { id: 1, text: "Bir görevi tamamlamak için gereken son rötuşları yapmakta ne sıklıkla zorlandınız?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 2, text: "Düzenleme gerektiren görevlerde ne sıklıkla zorluk yaşadınız?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 3, text: "Randevuları veya yükümlülükleri ne sıklıkla hatırlamakta zorlandınız?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 4, text: "Düşünce gerektiren bir işten kaçınmayı ne sıklıkla ertelediniz?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 5, text: "Uzun süre oturmanız gereken durumlarda ne sıklıkla kıpırdandınız ya da ayağa kalktınız?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
    { id: 6, text: "Konuşmacının bitimine beklemeden konuşmayı tamamladığınız ne sıklıkla oldu?", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }, { text: "Çok sık", score: 4 }] },
  ],
  scoreRanges: [
    { min: 0, max: 8, label: "DEHB Belirtisi Düşük", color: "green", description: "Anlamlı DEHB belirtisi görünmüyor.", recommendation: "Belirtileriniz klinik öneme sahip değil." },
    { min: 9, max: 16, label: "Orta Düzey DEHB Belirtileri", color: "yellow", description: "Bazı DEHB belirtileri mevcut.", recommendation: "Bir uzman değerlendirmesi faydalı olabilir." },
    { min: 17, max: 24, label: "Yüksek DEHB Belirtileri", color: "red", description: "Belirgin DEHB belirtileri mevcut. Değerlendirme önerilir.", recommendation: "Bir psikolog veya psikiyatrist ile görüşün." },
  ],
};

// ─── 6. Sosyal Anksiyete Testi (Mini-SPIN) ───────────────────────────────────

const SOSYAL_ANKSIYETE: TestDefinition = {
  slug: "sosyal-anksiyete-testi",
  title: "Sosyal Anksiyete Testi",
  shortTitle: "Sosyal Anksiyete",
  category: "Kaygı",
  description: "Sosyal ortamlarda yaşanan kaygı ve korkuyu ölçen kısa sosyal fobi ölçeği.",
  instructions: "Son hafta içinde aşağıdaki durumlar sizi ne kadar rahatsız etti?",
  duration: "2-3 dk",
  maxScore: 12,
  reference: "Connor KM et al. (2001). Psychometric properties of the Social Phobia Inventory (SPIN). Br J Psychiatry.",
  questions: [
    { id: 1, text: "Utanç verici görünmekten korktum", options: [{ text: "Hiç", score: 0 }, { text: "Biraz", score: 1 }, { text: "Oldukça", score: 2 }, { text: "Çok fazla", score: 3 }, { text: "Son derece fazla", score: 4 }] },
    { id: 2, text: "Sosyal durumlarda birileriyle karşılaşmaktan kaçındım", options: [{ text: "Hiç", score: 0 }, { text: "Biraz", score: 1 }, { text: "Oldukça", score: 2 }, { text: "Çok fazla", score: 3 }, { text: "Son derece fazla", score: 4 }] },
    { id: 3, text: "Dikkat odağı olmak beni rahatsız etti", options: [{ text: "Hiç", score: 0 }, { text: "Biraz", score: 1 }, { text: "Oldukça", score: 2 }, { text: "Çok fazla", score: 3 }, { text: "Son derece fazla", score: 4 }] },
  ],
  scoreRanges: [
    { min: 0, max: 5, label: "Sosyal Anksiyete Yok ya da Hafif", color: "green", description: "Sosyal anksiyete belirtileri minimal düzeyde.", recommendation: "Sosyal etkileşimleriniz sağlıklı görünüyor." },
    { min: 6, max: 12, label: "Olası Sosyal Anksiyete Bozukluğu", color: "orange", description: "Sosyal anksiyete bozukluğu belirtileri mevcut olabilir.", recommendation: "Bir uzmanla görüşmenizi öneririz." },
  ],
};

// ─── 7. Panik Bozukluğu Testi ────────────────────────────────────────────────

const PANIK: TestDefinition = {
  slug: "panik-atak-testi",
  title: "Panik Bozukluğu Testi",
  shortTitle: "Panik",
  category: "Kaygı",
  description: "Panik atak ve panik bozukluğuna ilişkin belirtileri tarama ölçeği.",
  instructions: "Son bir ay içinde aşağıdaki deneyimleri ne sıklıkla yaşadınız?",
  duration: "3-5 dk",
  maxScore: 20,
  questions: [
    { id: 1, text: "Aniden yoğun korku veya rahatsızlık hissettim", options: [{ text: "Hiç", score: 0 }, { text: "1-2 kez", score: 1 }, { text: "Haftada 1", score: 2 }, { text: "Birkaç kez", score: 3 }, { text: "Günlük", score: 4 }] },
    { id: 2, text: "Çarpıntı, hızlı kalp atışı yaşadım", options: [{ text: "Hiç", score: 0 }, { text: "1-2 kez", score: 1 }, { text: "Haftada 1", score: 2 }, { text: "Birkaç kez", score: 3 }, { text: "Günlük", score: 4 }] },
    { id: 3, text: "Nefes alamıyormuş gibi hissettim", options: [{ text: "Hiç", score: 0 }, { text: "1-2 kez", score: 1 }, { text: "Haftada 1", score: 2 }, { text: "Birkaç kez", score: 3 }, { text: "Günlük", score: 4 }] },
    { id: 4, text: "Baş dönmesi veya sersemlik hissettim", options: [{ text: "Hiç", score: 0 }, { text: "1-2 kez", score: 1 }, { text: "Haftada 1", score: 2 }, { text: "Birkaç kez", score: 3 }, { text: "Günlük", score: 4 }] },
    { id: 5, text: "Tekrar panik yaşayacağım korkusuyla bazı yerlerden kaçındım", options: [{ text: "Hiç", score: 0 }, { text: "1-2 kez", score: 1 }, { text: "Haftada 1", score: 2 }, { text: "Birkaç kez", score: 3 }, { text: "Günlük", score: 4 }] },
  ],
  scoreRanges: [
    { min: 0, max: 4, label: "Panik Belirtisi Yok", color: "green", description: "Panik bozukluğu belirtisi yok.", recommendation: "Belirtileriniz klinik öneme sahip değil." },
    { min: 5, max: 9, label: "Hafif Panik Belirtileri", color: "yellow", description: "Hafif düzeyde panik belirtileri mevcut.", recommendation: "Nefes teknikleri ve gevşeme egzersizleri deneyin." },
    { min: 10, max: 14, label: "Orta Düzey Panik", color: "orange", description: "Orta düzeyde panik bozukluğu belirtileri var.", recommendation: "Bir uzmanla görüşmenizi öneririz." },
    { min: 15, max: 20, label: "Ciddi Panik Bozukluğu Belirtileri", color: "red", description: "Ciddi panik bozukluğu belirtileri mevcut.", recommendation: "Lütfen bir psikolog veya psikiyatrist ile görüşün." },
  ],
};

// ─── 8. Psikolojik Check-Up (Genel Tarama) ──────────────────────────────────

const CHECKUP: TestDefinition = {
  slug: "psikolojik-checkup",
  title: "Psikolojik Check-Up",
  shortTitle: "Check-Up",
  category: "Genel",
  description: "Ruh sağlığını genel olarak tarayan, birden fazla alanı kapsayan kapsamlı değerlendirme.",
  instructions: "Son iki haftada aşağıdakileri ne sıklıkla yaşadınız?",
  duration: "8-12 dk",
  maxScore: 36,
  questions: [
    { id: 1, text: "Günlük işlerimi tamamlamakta güçlük çektim", options: FREQUENCY_OPTIONS },
    { id: 2, text: "Kendimi değersiz ya da başarısız hissettim", options: FREQUENCY_OPTIONS },
    { id: 3, text: "Uyku sorunları yaşadım (uyuyamama veya çok uyuma)", options: FREQUENCY_OPTIONS },
    { id: 4, text: "İştah değişimi fark ettim", options: FREQUENCY_OPTIONS },
    { id: 5, text: "Kaygılı veya gergin hissettim", options: FREQUENCY_OPTIONS },
    { id: 6, text: "Sosyal ortamlardan uzak durdum", options: FREQUENCY_OPTIONS },
    { id: 7, text: "Dikkatimi toplamakta güçlük çektim", options: FREQUENCY_OPTIONS },
    { id: 8, text: "Enerji düşüklüğü veya bitkinlik hissettim", options: FREQUENCY_OPTIONS },
    { id: 9, text: "Kendime zarar verme ya da hayatıma son verme düşünceleri geldi", options: [{ text: "Hiç", score: 0 }, { text: "Nadiren", score: 1 }, { text: "Bazen", score: 2 }, { text: "Sık sık", score: 3 }] },
  ],
  scoreRanges: [
    { min: 0, max: 8, label: "İyi Ruh Sağlığı", color: "green", description: "Genel ruh sağlığınız iyi görünüyor.", recommendation: "Sağlıklı yaşam alışkanlıklarınızı sürdürün." },
    { min: 9, max: 17, label: "Orta Düzey Belirtiler", color: "yellow", description: "Bazı ruh sağlığı belirtileri mevcut.", recommendation: "Bir uzmanla görüşmek faydalı olabilir." },
    { min: 18, max: 27, label: "Belirgin Belirtiler", color: "orange", description: "Belirgin ruh sağlığı belirtileri mevcut.", recommendation: "Profesyonel destek almanızı öneririz." },
    { min: 28, max: 36, label: "Yüksek Risk", color: "red", description: "Yüksek düzeyde ruh sağlığı belirtileri mevcut.", recommendation: "Lütfen en kısa sürede bir uzmanla görüşün." },
  ],
};

// ─── Tüm testler ─────────────────────────────────────────────────────────────

export const TESTS: Record<string, TestDefinition> = {
  "depresyon-testi": DEPRESYON,
  "anksiyete-testi": ANKSIYETE,
  "stres-testi": STRES,
  "okb-testi": OKB,
  "adhd-testi": ADHD,
  "sosyal-anksiyete-testi": SOSYAL_ANKSIYETE,
  "panik-atak-testi": PANIK,
  "psikolojik-checkup": CHECKUP,
};

export type { TestDefinition as default };
