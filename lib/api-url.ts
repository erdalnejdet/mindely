/**
 * Sunucu tarafı BFF’in Express `backend/`e gitmesi için taban URL.
 * Sıra: MINDELY_API_URL → BACKEND_API_URL → NEXT_PUBLIC_API_URL
 * (yalnızca `NEXT_PUBLIC_*` koymak, değer yanlışlıkla frontend origin olursa 404/HTML BAD_GATEWAY üretir.)
 */
function resolveBackendApiUrlRaw(): string | undefined {
  return (
    process.env.MINDELY_API_URL ??
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_API_URL
  )?.trim() || undefined;
}

/**
 * Same resolution as {@link backendApiUrl} but returns null if unset.
 * Use when upstream calls are best-effort (e.g. logout still clears cookies).
 */
export function backendApiUrlOrNull(): string | null {
  const url = resolveBackendApiUrlRaw();
  return url ? url.replace(/\/$/, "") : null;
}

/** Server-side base URL for the Express backend in `backend/` (BFF / Route Handlers only; prefer not to expose to the browser). */
export function backendApiUrl(): string {
  const url = backendApiUrlOrNull();
  if (!url) {
    throw new Error("MINDELY_API_URL, BACKEND_API_URL, or NEXT_PUBLIC_API_URL must be set");
  }
  return url;
}
