import type { Metadata } from "next";
import { psikologlar } from "@/lib/data/psikologlar";
import { PsikologDashboardView } from "@/components/dashboard/PsikologDashboardView";

export const metadata: Metadata = {
  title: "Panel | Mindely",
  description: "Psikolog paneli — profil özeti ve randevular.",
};

/** Önizleme: canlı ortamda oturumdaki uzman kaydına bağlanır. */
const DASHBOARD_DEMO_PSIKOLOG_ID = "1";

export default function DashboardPage() {
  const psikolog =
    psikologlar.find((p) => p.id === DASHBOARD_DEMO_PSIKOLOG_ID) ?? psikologlar[0];
  return <PsikologDashboardView psikolog={psikolog} />;
}
