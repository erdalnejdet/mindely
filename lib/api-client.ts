/**
 * Browser / client components: Next.js BFF (`/api/*` on this app), not Express `backend/`.
 * Leave base empty for same-origin relative paths, or set `NEXT_PUBLIC_APP_URL` for absolute URLs.
 */
export function getAppApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "";
  return raw.replace(/\/$/, "");
}

/** Full URL for a BFF route. `path` must start with `/api/`. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!normalized.startsWith("/api/")) {
    throw new Error(`apiUrl: path must start with /api/, got "${path}"`);
  }
  const base = getAppApiBase();
  return base ? `${base}${normalized}` : normalized;
}
