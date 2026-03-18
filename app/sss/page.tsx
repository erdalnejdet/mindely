import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { FAQAccordion } from "@/components/faq/FAQAccordion";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Mindely hakkında sıkça sorulan sorular. Online terapi, randevu alma ve platform kullanımı hakkında merak ettikleriniz.",
};

const faqItems = [
  {
    question: "Online terapi nasıl çalışır?",
    answer:
      "Online terapi, video görüşme üzerinden gerçekleşir. Randevu aldıktan sonra, belirlediğiniz saatte uzmanınızla güvenli görüşme odasına katılırsınız. Evinizin konforunda, gizlilik içinde seansınızı tamamlayabilirsiniz.",
  },
  {
    question: "Randevu nasıl alınır?",
    answer:
      "Uzmanlar sayfamızdan size uygun uzmanı seçin, 'Randevu Al' butonuna tıklayın. Tarih ve saat seçerek iletişim bilgilerinizi girin. Onay sonrası randevunuz oluşturulur ve e-posta ile bildirilirsiniz.",
  },
  {
    question: "Ücretsiz ön görüşme nedir?",
    answer:
      "Bazı uzmanlarımız ilk görüşmeyi ücretsiz sunmaktadır. Bu sayede uzmanı tanıyabilir, terapi yaklaşımını öğrenebilir ve size uygun olup olmadığına karar verebilirsiniz.",
  },
  {
    question: "Ödeme nasıl yapılır?",
    answer:
      "Randevu oluşturma sırasında veya uzmanınızla iletişime geçerek ödeme seçeneklerini öğrenebilirsiniz. Kredi kartı, havale ve platform üzerinden güvenli ödeme imkanları sunulmaktadır.",
  },
  {
    question: "Randevumu iptal edebilir miyim?",
    answer:
      "Evet. Randevunuzdan en az 24 saat önce iptal edebilirsiniz. Panel üzerinden veya destek hattımız üzerinden iptal talebinde bulunabilirsiniz.",
  },
  {
    question: "Gizlilik nasıl sağlanıyor?",
    answer:
      "Tüm görüşmeler şifreli kanallar üzerinden yapılır. Uzmanlarımız mesleki gizlilik ilkelerine bağlıdır. Verileriniz KVKK kapsamında korunmaktadır.",
  },
  {
    question: "Hangi uzmanlık alanları mevcut?",
    answer:
      "Anksiyete, depresyon, çift terapisi, stres yönetimi, travma, panik atak, ilişki sorunları, aile danışmanlığı ve daha birçok alanda uzmanlarımız hizmet vermektedir.",
  },
  {
    question: "Psikolojik testler ücretsiz mi?",
    answer:
      "Evet, platformumuzdaki psikolojik testler ücretsiz olarak çözülebilir. Sonuçlarınız size özel olarak sunulur ve bir uzmanla paylaşmak isterseniz randevu alabilirsiniz.",
  },
];

export default function FAQPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Sıkça Sorulan Sorular
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Mindely hakkında merak ettiklerinizin cevapları.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <FAQAccordion items={faqItems} />
      </div>
    </PageLayout>
  );
}
