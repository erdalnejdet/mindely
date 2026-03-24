const TOKEN_KEY = "mindely_token";
const USER_KEY = "mindely_user";
const EXPIRY_KEY = "mindely_token_expiry";
const TOKEN_DURATION_MS = 8 * 60 * 60 * 1000; // 8 saat

const storage = typeof window !== "undefined" ? sessionStorage : null;

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

function clearAuth() {
  if (storage) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(EXPIRY_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  if (isTokenExpired()) {
    clearAuth();
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
    clearAuth();
    return null;
  }
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
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

export function logout() {
  clearAuth();
}
