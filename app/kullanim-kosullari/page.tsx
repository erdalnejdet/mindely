import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "Mindely kullanım koşulları. Platformu kullanırken uymanız gereken şartlar ve koşullar.",
};

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Kullanım Koşulları
          </h1>
          <p className="mt-4 text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-emerald max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Genel Hükümler
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mindely platformunu kullanarak bu kullanım koşullarını kabul etmiş
              sayılırsınız. Platform, mental sağlık ve yaşam sağlığı uzmanları
              ile danışanları buluşturan bir aracı hizmet sunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Hizmet Tanımı
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mindely, randevu yönetimi, uzman listeleme ve online görüşme
              altyapısı sağlamaktadır. Platform doğrudan tıbbi veya psikolojik
              tanı koymaz; uzmanlar bağımsız çalışır ve kendi sorumlulukları
              altında hizmet verir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Kullanıcı Yükümlülükleri
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Platformu kullanırken doğru ve güncel bilgi sağlamak, başkalarının
              haklarına saygı göstermek ve platformu kötüye kullanmamakla
              yükümlüsünüz. Acil durumlarda 112&apos;i arayınız.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Ödeme ve İptal
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Randevu ödemeleri ve iptal koşulları, ilgili uzmanın belirlediği
              politikalar çerçevesinde uygulanır. Mindely, ödeme işlemlerinde
              güvenli ödeme altyapısı sunar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Fikri Mülkiyet
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Platformdaki tüm içerik, logo ve tasarımlar Mindely&apos;e aittir.
              İzinsiz kopyalama, dağıtma veya ticari kullanım yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Sorumluluk Sınırlaması
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mindely, uzmanların verdiği hizmetlerden veya danışan-uzman
              ilişkisinden kaynaklanan sorunlardan dolayı sorumlu tutulamaz.
              Platform aracı konumundadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Değişiklikler
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mindely, bu koşulları önceden bildirimde bulunmaksızın
              güncelleyebilir. Güncellemeler bu sayfada yayınlanacaktır.
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              Sorularınız için{" "}
              <a href="/iletisim" className="text-primary hover:underline">
                iletişim sayfamızdan
              </a>{" "}
              bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
