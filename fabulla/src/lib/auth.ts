/**
 * Admin authentication.
 *
 * Passwords are scrypt-hashed with a per-user salt. Sessions are a signed
 * token in an httpOnly cookie — HMAC-SHA256 over a small JSON payload via Web
 * Crypto, so the same code verifies it in the edge proxy and in Node route
 * handlers without a dependency.
 *
 * First run: when the admins collection is empty and ADMIN_EMAIL +
 * ADMIN_PASSWORD are set, the first login with exactly those credentials
 * creates the owner account. After that the env vars are ignored and the
 * Team page in the admin manages accounts.
 */

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "fabulla_admin";
const SESSION_DAYS = 7;

export type Session = { sub: string; email: string; name: string; exp: number };

/* ------------------------------------------------------------------------ */
/* Passwords (Node only)                                                     */
/* ------------------------------------------------------------------------ */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/* ------------------------------------------------------------------------ */
/* Session tokens (Web Crypto: Node and edge)                                */
/* ------------------------------------------------------------------------ */

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set (16+ characters) in production.");
  }
  // Development only. Sessions do not survive a change of this string.
  return "fabulla-dev-session-secret-not-for-production";
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(text: string): Uint8Array<ArrayBuffer> {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
  const s = atob(padded);
  // Explicit ArrayBuffer so the result satisfies BufferSource for Web Crypto.
  const out = new Uint8Array(new ArrayBuffer(s.length));
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(payload: Omit<Session, "exp">): Promise<string> {
  const session: Session = { ...payload, exp: Date.now() + SESSION_DAYS * 86_400_000 };
  const body = b64url(new TextEncoder().encode(JSON.stringify(session)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), new TextEncoder().encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromB64url(sig),
      new TextEncoder().encode(body)
    );
    if (!ok) return null;
    const session = JSON.parse(new TextDecoder().decode(fromB64url(body))) as Session;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  };
}
