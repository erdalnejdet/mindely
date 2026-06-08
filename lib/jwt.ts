import { jwtVerify } from "jose";

export type UserRole = "admin" | "psychologist" | "user";

export type AccessJwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
  /** Absent in legacy tokens; verifyAccessJwt treats as verified unless explicitly false. */
  emailVerified: boolean;
};

function isRole(v: unknown): v is UserRole {
  return v === "admin" || v === "psychologist" || v === "user";
}

/** Same signing key as backend `JWT_ACCESS_SECRET` (fallback: `JWT_SECRET`). */
export function getAccessJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET or JWT_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyAccessJwt(token: string): Promise<AccessJwtPayload> {
  const { payload } = await jwtVerify(token, getAccessJwtSecretKey(), {
    algorithms: ["HS256"],
  });
  const p = payload as Record<string, unknown>;
  if (p.typ !== undefined && p.typ !== "access") {
    throw new Error("INVALID_ACCESS_TOKEN");
  }
  const { sub, role, email, name } = p;
  if (typeof sub !== "string" || !isRole(role) || typeof email !== "string") {
    throw new Error("INVALID_ACCESS_TOKEN");
  }
  const displayName =
    typeof name === "string" && name.length > 0 ? name : email.split("@")[0] ?? "Kullanıcı";
  const emailVerifiedRaw = p.emailVerified;
  const emailVerified = emailVerifiedRaw === false ? false : true;
  return { sub, role, email, name: displayName, emailVerified };
}

function requireRefreshSecret(): Uint8Array {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

/** Legacy / bridge only: API uses opaque refresh tokens; this verifies JWT-shaped refresh if used. */
export async function verifyRefreshJwt(
  token: string,
): Promise<{ sub: string; role: UserRole; typ: string }> {
  const { payload } = await jwtVerify(token, requireRefreshSecret(), {
    algorithms: ["HS256"],
  });
  const { sub, role, typ } = payload as Record<string, unknown>;
  if (typ !== "refresh" || typeof sub !== "string" || !isRole(role)) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
  return { sub, role, typ: "refresh" };
}
