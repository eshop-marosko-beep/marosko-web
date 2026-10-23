import { cookies } from "next/headers";
import { getJson, key, kv } from "@/lib/rental/kv";
import { sign, verifySignature } from "@/lib/rental/crypto";

export type RentalUser = {
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  locale: string;
  createdAt: string;
};

/** What pages and API responses may see — never the password hash. */
export type PublicUser = Pick<RentalUser, "email" | "name" | "phone">;

export const SESSION_COOKIE = "marosko_rental_session";
const SESSION_DAYS = 30;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getUser(email: string): Promise<RentalUser | null> {
  return getJson<RentalUser>(key("user", normalizeEmail(email)));
}

/** Returns false when an account with this email already exists. */
export async function createUser(user: RentalUser): Promise<boolean> {
  const result = await kv<string | null>(["SET", key("user", user.email), JSON.stringify(user), "NX"]);
  return result === "OK";
}

/** Session cookie value: "<email>|<expiry ms>|<HMAC signature>". */
export async function sessionCookieHeader(email: string): Promise<string> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${email}|${expires}`;
  const value = `${payload}|${await sign(payload)}`;
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  ].join("; ");
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function emailFromSessionValue(raw: string | undefined): Promise<string | null> {
  if (!raw) return null;
  const parts = decodeURIComponent(raw).split("|");
  if (parts.length !== 3) return null;
  const [email, expires, signature] = parts;
  if (!email || Number(expires) < Date.now()) return null;
  return (await verifySignature(`${email}|${expires}`, signature)) ? email : null;
}

/** The signed-in customer, or null. Works in server components and route
 * handlers. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const email = await emailFromSessionValue(store.get(SESSION_COOKIE)?.value);
  if (!email) return null;
  const user = await getUser(email);
  return user ? { email: user.email, name: user.name, phone: user.phone } : null;
}
