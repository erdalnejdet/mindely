export const ACCESS_COOKIE = "mindely_at";
export const REFRESH_COOKIE = "mindely_rt";

export function cookieDefaults(isProduction: boolean) {
  return {
    httpOnly: true as const,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/" as const,
  };
}

export function expiresInToMaxAge(expiresIn: string): number {
  const m = /^(\d+)(s|m|h|d)$/i.exec(expiresIn.trim());
  if (!m) return 15 * 60;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  const mult = u === "s" ? 1 : u === "m" ? 60 : u === "h" ? 3600 : 86400;
  return n * mult;
}
