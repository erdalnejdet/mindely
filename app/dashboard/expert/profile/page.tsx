import type { Metadata } from "next";
import { ExpertProfileEditor } from "@/components/dashboard/ExpertProfileEditor";

export const metadata: Metadata = {
  title: "Profil & CV",
  description: "Profil fotoğrafı, CV ve uzmanlık alanlarınızı düzenleyin.",
};

export default function ExpertProfilePage() {
  return <ExpertProfileEditor />;
}
