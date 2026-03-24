import type { Metadata } from "next";
import { ExpertDashboardShell } from "@/components/dashboard/ExpertDashboardShell";

export const metadata: Metadata = {
  title: "Uzman Paneli",
  description:
    "Profil, CV, randevular ve mesajlarınızı Mindely uzman panelinden yönetin.",
};

export default function ExpertDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExpertDashboardShell>{children}</ExpertDashboardShell>;
}
