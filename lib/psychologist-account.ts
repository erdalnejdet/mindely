/** `/auth/me` yanıtından psikolog alanları (BFF veya doğrudan API). */
export type PsychologistAccountInfo = {
  id?: string;
  email?: string;
  name?: string | null;
  bio?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
  bookingEnabled?: boolean;
  minAdvanceBookingHours?: number | null;
  profileCompleted?: boolean;
  isListed?: boolean;
  visibilityStatus?: string;
  sessionDurationMinutes?: number | null;
};
