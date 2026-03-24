import { redirect } from "next/navigation";

/** Eski ödeme akışı kaldırıldı; terapist üyeliği önce temel bilgilerle alınır. */
export default function OdemePageRedirect() {
  redirect("/terapist-islemleri");
}
