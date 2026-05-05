import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Profil Ayarları",
  description: "Hesap ve profil ayarlarınızı yönetin.",
};

export default function DashboardSettingsPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Profil Ayarları</h1>
        <p className="mt-2 text-muted-foreground">
          Bu alan yakında detaylandırılacaktır. Şimdilik temel ayarlar için uzman panelini kullanabilirsiniz.
        </p>
      </div>
    </PageLayout>
  );
}
