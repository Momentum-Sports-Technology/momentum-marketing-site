import { createHmac, timingSafeEqual } from "crypto";

// Stateless admin sessions: an expiry timestamp signed with HMAC-SHA256.
// Nothing is stored server-side, so the token is valid across route bundles,
// processes, and restarts. Rotating ADMIN_PASSWORD (or SESSION_SECRET)
// invalidates every session.

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD (or SESSION_SECRET) is not set");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSession(): string {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

/** Tokens are stateless, so sign-out is client-side only. Kept for symmetry. */
export function destroySession(_id: string): void {}

export function isValidSession(token: string | null | undefined): boolean {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;
  let expected: Buffer;
  try {
    expected = Buffer.from(sign(expiresAt));
  } catch {
    return false;
  }
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Reads the session token from the Authorization: Bearer header. */
export function sessionFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1] : null;
}
