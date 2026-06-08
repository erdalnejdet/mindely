import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-cookies";
import { verifyAccessJwt } from "@/lib/jwt";
import { backendApiUrl } from "@/lib/api-url";
import { PsikologDashboardView } from "@/components/dashboard/PsikologDashboardView";
import type { PsychologistAccountInfo } from "@/lib/psychologist-account";

async function fetchPsychologistAccountInfo(): Promise<PsychologistAccountInfo | null> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (!access) return null;
  try {
    const res = await fetch(`${backendApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      user?: PsychologistAccountInfo & { role?: string };
    };
    if (data.user?.role !== "psychologist") return null;
    return data.user;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Panel | Mindely",
  description: "Psikolog paneli — profil özeti ve randevular.",
};

export default async function DashboardPage() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  let claims = null;
  if (access) {
    try {
      claims = await verifyAccessJwt(access);
    } catch {
      claims = null;
    }
  }
  if (!claims) {
    if (jar.get(REFRESH_COOKIE)?.value) {
      redirect(`/api/auth/reconcile?next=${encodeURIComponent("/dashboard")}`);
    }
    redirect("/auth/login?next=%2Fdashboard");
  }
  if (claims.role !== "psychologist" && claims.role !== "admin") {
    redirect("/");
  }

  const therapistAccount = await fetchPsychologistAccountInfo();
  return <PsikologDashboardView therapistAccount={therapistAccount} />;
}
