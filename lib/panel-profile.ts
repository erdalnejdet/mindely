import { psikologlar } from "@/lib/data/psikologlar";

type Psikolog = (typeof psikologlar)[number];

/** Formdaki genel ayarlar (saat metin kutusu) */
export type GenelAyarlarFormState = {
  aktifSeansAlma: boolean;
  minRezervasyonSaat: string;
};

/** API / mock JSON çıktısı */
export type GenelAyarlarPayload = {
  aktifSeansAlma: boolean;
  minRezervasyonSaat: number | null;
};

/** API / form gövdesi için hedef JSON şekli */
export type PsikologPanelJsonPayload = {
  name: string;
  specialization: string;
  bio: string;
  image: string;
  sessionPrice: number | null;
  specializations: string[];
  educationExperience: EducationExperienceItem[];
  genelAyarlar: GenelAyarlarPayload;
};

export type EducationExperienceItem = {
  title: string;
  subtitle: string;
};

/** Form state (inputlar string tutar) */
export type PsikologPanelFormState = {
  name: string;
  specialization: string;
  bio: string;
  image: string;
  sessionPrice: string;
  specializations: string[];
  educationExperience: EducationExperienceItem[];
  genelAyarlar: GenelAyarlarFormState;
};

export function mockPanelStateFromPsikolog(psikolog: Psikolog): PsikologPanelFormState {
  return {
    name: psikolog.name,
    specialization: psikolog.specialization,
    bio: psikolog.bio,
    image: psikolog.image,
    sessionPrice:
      psikolog.sessionPrice != null ? String(psikolog.sessionPrice) : "",
    specializations: [...psikolog.specializations],
    educationExperience: [
      {
        title: psikolog.education,
        subtitle: "Akademik uzmanlık eğitimi",
      },
      {
        title: psikolog.approach,
        subtitle: "Terapi yaklaşımı",
      },
    ],
    genelAyarlar: {
      aktifSeansAlma: true,
      minRezervasyonSaat: "24",
    },
  };
}

export function parseSessionPriceInput(raw: string): number | null {
  const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Minimum rezervasyon süresi (saat); boş veya 0 geçersiz */
export function parseMinRezervasyonSaatInput(raw: string): number | null {
  const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formStateToJsonPayload(
  form: PsikologPanelFormState,
): PsikologPanelJsonPayload {
  return {
    name: form.name.trim(),
    specialization: form.specialization.trim(),
    bio: form.bio.trim(),
    image: form.image.trim(),
    sessionPrice: parseSessionPriceInput(form.sessionPrice),
    specializations: form.specializations.map((s) => s.trim()).filter(Boolean),
    educationExperience: form.educationExperience
      .map((row) => ({
        title: row.title.trim(),
        subtitle: row.subtitle.trim(),
      }))
      .filter((row) => row.title || row.subtitle),
    genelAyarlar: {
      aktifSeansAlma: form.genelAyarlar.aktifSeansAlma,
      minRezervasyonSaat: parseMinRezervasyonSaatInput(form.genelAyarlar.minRezervasyonSaat),
    },
  };
}
