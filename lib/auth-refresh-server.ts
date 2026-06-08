import { backendApiUrl } from "@/lib/api-url";

export type TokenPair = { accessToken: string; refreshToken: string };

export async function refreshTokensFromApi(refreshToken: string): Promise<TokenPair | null> {
  const r = await fetch(`${backendApiUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!r.ok) return null;
  const data = (await r.json()) as Partial<TokenPair>;
  if (typeof data.accessToken !== "string" || typeof data.refreshToken !== "string") {
    return null;
  }
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}
