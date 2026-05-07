"use client";

import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { psikologlar } from "@/lib/data/psikologlar";
import {
  formStateToJsonPayload,
  mockPanelStateFromPsikolog,
} from "@/lib/panel-profile";
import {
  HAFTA_GUNLERI,
  PsikologPanelDanisanlarimTab,
  PsikologPanelGenelAyarlarTab,
  PsikologPanelHero,
  PsikologPanelProfilTab,
  PsikologPanelRandevularimTab,
  PsikologPanelSaatKapatmaTab,
  PsikologPanelTabTriggers,
  type KapaliSaatAraligi,
} from "@/components/dashboard/psikolog-panel";

type Psikolog = (typeof psikologlar)[number];

type PsikologDashboardViewProps = {
  psikolog: Psikolog;
};

export function PsikologDashboardView({ psikolog }: PsikologDashboardViewProps) {
  const [form, setForm] = React.useState(() => mockPanelStateFromPsikolog(psikolog));
  const [jsonPreview, setJsonPreview] = React.useState<string | null>(null);

  const [kapaliAraliklar, setKapaliAraliklar] = React.useState<KapaliSaatAraligi[]>(() => [
    { id: "ornek-1", gun: "Çarşamba", baslangic: "12:00", bitis: "13:00" },
  ]);
  const [kapaliModalOpen, setKapaliModalOpen] = React.useState(false);
  const [kapaliGun, setKapaliGun] = React.useState<string>(HAFTA_GUNLERI[0]);
  const [kapaliBas, setKapaliBas] = React.useState("09:00");
  const [kapaliBit, setKapaliBit] = React.useState("10:00");
  const [saatJsonPreview, setSaatJsonPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(mockPanelStateFromPsikolog(psikolog));
    setJsonPreview(null);
    setKapaliAraliklar([
      { id: `ornek-${psikolog.id}`, gun: "Çarşamba", baslangic: "12:00", bitis: "13:00" },
    ]);
    setSaatJsonPreview(null);
  }, [psikolog]);

  const handleMockSave = () => {
    const payload = formStateToJsonPayload(form);
    const pretty = JSON.stringify(payload, null, 2);
    setJsonPreview(pretty);
    console.info("[Mindely panel mock]", payload);
  };

  const handleSaatKapatmaMockSave = () => {
    const payload = {
      kapaliSaatAraliklari: kapaliAraliklar.map(({ gun, baslangic, bitis }) => ({
        gun,
        baslangic,
        bitis,
      })),
    };
    const pretty = JSON.stringify(payload, null, 2);
    setSaatJsonPreview(pretty);
    console.info("[Mindely saat kapatma mock]", payload);
  };

  const openKapaliModal = () => {
    setKapaliGun(HAFTA_GUNLERI[0]);
    setKapaliBas("09:00");
    setKapaliBit("10:00");
    setKapaliModalOpen(true);
  };

  const confirmKapaliAralik = () => {
    if (!kapaliBas || !kapaliBit || kapaliBit <= kapaliBas) return;
    setKapaliAraliklar((rows) => [
      ...rows,
      {
        id: `k-${Date.now()}`,
        gun: kapaliGun,
        baslangic: kapaliBas,
        bitis: kapaliBit,
      },
    ]);
    setKapaliModalOpen(false);
  };

  const removeKapaliAralik = (id: string) => {
    setKapaliAraliklar((rows) => rows.filter((r) => r.id !== id));
  };

  return (
    <PageLayout>
      <div className="bg-[#f4fafd] py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <PsikologPanelHero
            form={form}
            psikolog={psikolog}
            onMockSave={handleMockSave}
            jsonPreview={jsonPreview}
          />

          <Tabs defaultValue="profil" className="w-full gap-6">
            <PsikologPanelTabTriggers />

            <TabsContent value="profil" className="mt-0 space-y-8">
              <PsikologPanelProfilTab
                key={psikolog.id}
                form={form}
                setForm={setForm}
                onMockSave={handleMockSave}
                jsonPreview={jsonPreview}
              />
            </TabsContent>

            <TabsContent value="genel-ayarlar" className="mt-0 space-y-6">
              <PsikologPanelGenelAyarlarTab form={form} setForm={setForm} />
            </TabsContent>

            <TabsContent value="saat-kapatma" className="mt-0 space-y-6">
              <PsikologPanelSaatKapatmaTab
                kapaliAraliklar={kapaliAraliklar}
                onRemoveKapali={removeKapaliAralik}
                onOpenAddModal={openKapaliModal}
                kapaliModalOpen={kapaliModalOpen}
                onKapaliModalOpenChange={setKapaliModalOpen}
                kapaliGun={kapaliGun}
                onKapaliGunChange={setKapaliGun}
                kapaliBas={kapaliBas}
                onKapaliBasChange={setKapaliBas}
                kapaliBit={kapaliBit}
                onKapaliBitChange={setKapaliBit}
                onConfirmKapali={confirmKapaliAralik}
                saatJsonPreview={saatJsonPreview}
                onMockSave={handleSaatKapatmaMockSave}
              />
            </TabsContent>

            <TabsContent value="randevularim" className="mt-0 space-y-6">
              <PsikologPanelRandevularimTab />
            </TabsContent>

            <TabsContent value="danisanlarim" className="mt-0 space-y-6">
              <PsikologPanelDanisanlarimTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
