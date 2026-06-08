import { apiUrl } from "@/lib/api-client";
import type { UserRole } from "@/lib/jwt";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified?: boolean;
};

const TOKEN_KEY = "mindely_token";
const USER_KEY = "mindely_user";
const EXPIRY_KEY = "mindely_token_expiry";
const TOKEN_DURATION_MS = 8 * 60 * 60 * 1000;

const storage = typeof window !== "undefined" ? sessionStorage : null;

function clearSessionStorageAuth() {
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
  storage.removeItem(EXPIRY_KEY);
}

// ── Bellek cache (30 sn) ─────────────────────────────────────────────────────
let _sessionCache: { user: SessionUser | null; expiresAt: number } | null = null;

/**
 * Sunucu oturumu: `/api/auth/session` httpOnly cookie'lerden okunan kullanıcı.
 * 30 saniye boyunca önbelleğe alınır; her sayfada tekrar tekrar istek atmaz.
 */
export async function fetchSession(force = false): Promise<SessionUser | null> {
  if (typeof window === "undefined") return null;
  if (!force && _sessionCache && Date.now() < _sessionCache.expiresAt) {
    return _sessionCache.user;
  }
  const res = await fetch(apiUrl("/api/auth/session"), { credentials: "include" });
  const user: SessionUser | null = res.ok
    ? ((await res.json().catch(() => ({}))) as { user?: SessionUser | null }).user ?? null
    : null;
  _sessionCache = { user, expiresAt: Date.now() + 30_000 };
  return user;
}

/** Oturum cache'ini sıfırla (logout sonrası çağır). */
export function clearSessionCache() {
  _sessionCache = null;
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" }).catch(() => {});
  clearSessionStorageAuth();
  clearSessionCache();
}

function isTokenExpired(): boolean {
  if (!storage) return true;
  const expiry = storage.getItem(EXPIRY_KEY);
  if (!expiry) return true;
  try {
    return Date.now() >= parseInt(expiry, 10);
  } catch {
    return true;
  }
}

/* --- Eski OAuth callback (`/auth/callback`) URL parametreleri --- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  if (isTokenExpired()) {
    clearSessionStorageAuth();
    return null;
  }
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  const expiry = Date.now() + TOKEN_DURATION_MS;
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EXPIRY_KEY, expiry.toString());
}

export function removeToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRY_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  if (isTokenExpired()) {
    clearSessionStorageAuth();
    return null;
  }
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function setUser(user: {
  uuid?: string;
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
}) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(USER_KEY);
}
