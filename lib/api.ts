const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_V1 = "/api/v1";

export function getApiUrl(path: string) {
  return `${API_URL}${path}`;
}

export type ApiResponse<T> = { success: boolean; data: T; message?: string };

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(getApiUrl(path), { ...fetchOptions, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "Bir hata oluştu");
  }
  return json as T;
}

/** Backend (Therapify) API - dönen data alanını döndürür */
export async function apiAuth<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const response = await apiFetch<ApiResponse<T>>(`${API_V1}${path}`, options);
  return (response as ApiResponse<T>).data as T;
}
