import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Mindely gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Gizlilik Politikası
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
              1. Toplanan Bilgiler
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mindely olarak hizmetlerimizi sunabilmek için ad, soyad, e-posta
              adresi, telefon numarası ve randevu bilgileri gibi kişisel
              verilerinizi topluyoruz. Bu veriler yalnızca belirtilen amaçlar
              doğrultusunda kullanılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Verilerin Kullanım Amacı
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Topladığımız veriler; randevu yönetimi, uzman-danışan eşleştirmesi,
              ödeme işlemleri, müşteri hizmetleri ve yasal yükümlülüklerimizin
              yerine getirilmesi amacıyla kullanılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Veri Güvenliği
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kişisel verilerinizin güvenliğini sağlamak için endüstri
              standartlarında şifreleme ve güvenlik önlemleri uyguluyoruz.
              Verileriniz yetkisiz erişime karşı korunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Verilerin Paylaşımı
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kişisel verileriniz, yalnızca randevu aldığınız uzman ile
              paylaşılmakta ve yasal zorunluluklar dışında üçüncü taraflarla
              paylaşılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Haklarınız
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              KVKK kapsamında verilerinize erişim, düzeltme, silme ve işleme
              itiraz etme haklarınız bulunmaktadır. Bu talepleriniz için
              info@mindely.com adresinden bize ulaşabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Çerezler
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler
              kullanmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi
              yönetebilirsiniz.
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              Bu politika hakkında sorularınız için{" "}
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
