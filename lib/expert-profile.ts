/**
 * Uzman profili — şimdilik tarayıcıda saklanır; API hazır olunca değiştirilebilir.
 */
export const EXPERT_PROFILE_STORAGE_KEY = "mindely_expert_profile";

export type ExpertProfile = {
  /** Görünen ad */
  displayName: string;
  /** Unvan (örn. Uzm. Psk.) */
  title: string;
  /** Kısa özet (listelerde) */
  summary: string;
  /** Detaylı CV / özgeçmiş metni */
  cvBody: string;
  /** Eğitim */
  education: string;
  /** Mesleki deneyim */
  experience: string;
  /** Uzmanlık alanları etiketleri */
  expertiseAreas: string[];
  /** Profil fotoğrafı (sıkıştırılmış data URL) */
  profileImageDataUrl: string | null;
  updatedAt: string;
};

export function defaultExpertProfile(): ExpertProfile {
  return {
    displayName: "",
    title: "",
    summary: "",
    cvBody: "",
    education: "",
    experience: "",
    expertiseAreas: [],
    profileImageDataUrl: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadExpertProfile(): ExpertProfile {
  if (typeof window === "undefined") return defaultExpertProfile();
  try {
    const raw = localStorage.getItem(EXPERT_PROFILE_STORAGE_KEY);
    if (!raw) return defaultExpertProfile();
    const parsed = JSON.parse(raw) as Partial<ExpertProfile>;
    return { ...defaultExpertProfile(), ...parsed };
  } catch {
    return defaultExpertProfile();
  }
}

export function saveExpertProfile(profile: ExpertProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    EXPERT_PROFILE_STORAGE_KEY,
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString(),
    })
  );
}
