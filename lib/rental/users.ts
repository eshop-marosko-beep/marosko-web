import { cookies } from "next/headers";
import { getJson, key, kv } from "@/lib/rental/kv";
import { randomId, sign, verifySignature } from "@/lib/rental/crypto";
import { DEFAULT_GROUP_ID } from "@/lib/rental/groups";

export type RentalUser = {
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  locale: string;
  createdAt: string;
  /** Customer group id (lib/rental/groups.ts); missing = default group. */
  groupId?: string;
  /** Blocked customers can sign in but can't see prices or book. */
  blocked?: boolean;
  /** Set only by the emailed admin confirmation link, never by a form. */
  admin?: boolean;
};

/** What pages and API responses may see — never the password hash. */
export type PublicUser = Pick<RentalUser, "email" | "name" | "phone"> & {
  groupId: string;
  blocked: boolean;
  isAdmin: boolean;
};

export const SESSION_COOKIE = "marosko_rental_session";
const SESSION_DAYS = 30;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Emails that may become admins (after confirming via a link sent to that
 * mailbox). Comma-separated in RENTAL_ADMIN_EMAILS. */
export function isAdminEmail(email: string): boolean {
  const list = (process.env.RENTAL_ADMIN_EMAILS ?? "eshop.marosko@gmail.com")
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
  return list.includes(normalizeEmail(email));
}

export function toPublicUser(user: RentalUser): PublicUser {
  return {
    email: user.email,
    name: user.name,
    phone: user.phone,
    groupId: user.groupId ?? DEFAULT_GROUP_ID,
    blocked: user.blocked === true,
    // Both conditions: removing an email from RENTAL_ADMIN_EMAILS revokes it.
    isAdmin: user.admin === true && isAdminEmail(user.email),
  };
}

export async function getUser(email: string): Promise<RentalUser | null> {
  return getJson<RentalUser>(key("user", normalizeEmail(email)));
}

/** Returns false when an account with this email already exists. */
export async function createUser(user: RentalUser): Promise<boolean> {
  const result = await kv<string | null>(["SET", key("user", user.email), JSON.stringify(user), "NX"]);
  return result === "OK";
}

export async function saveUser(user: RentalUser): Promise<void> {
  await kv(["SET", key("user", user.email), JSON.stringify(user)]);
}

/** All customer accounts, for the admin panel. */
export async function listUsers(): Promise<RentalUser[]> {
  const prefix = key("user", "");
  const keys: string[] = [];
  let cursor = "0";
  do {
    const [next, batch] = await kv<[string, string[]]>(["SCAN", cursor, "MATCH", `${prefix}*`, "COUNT", 500]);
    keys.push(...batch);
    cursor = next;
  } while (cursor !== "0" && keys.length < 5000);
  if (keys.length === 0) return [];
  const raw = await kv<(string | null)[]>(["MGET", ...keys]);
  return raw
    .filter((value): value is string => Boolean(value))
    .map((value) => JSON.parse(value) as RentalUser)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  return user ? toPublicUser(user) : null;
}

/* Admin accounts. Registering with an admin email doesn't create the
 * account directly: the details wait (1 day) until the link emailed to that
 * address is opened. Whoever controls the mailbox becomes admin, and can
 * always take the address back even if someone registered it first. */

const PENDING_ADMIN_SECONDS = 24 * 60 * 60;

type PendingAdmin = { user: RentalUser; nonce: string };

/** Stores the registration and returns a one-time nonce the emailed link is
 * signed with, so only the newest link works and an old email can't
 * activate a later registration. */
export async function savePendingAdmin(user: RentalUser): Promise<string> {
  const nonce = randomId(12);
  const pending: PendingAdmin = { user, nonce };
  await kv(["SET", key("pendingadmin", user.email), JSON.stringify(pending), "EX", PENDING_ADMIN_SECONDS]);
  return nonce;
}

export async function getPendingAdmin(email: string): Promise<PendingAdmin | null> {
  return getJson<PendingAdmin>(key("pendingadmin", email));
}

export async function activatePendingAdmin(email: string, nonce: string): Promise<RentalUser | null> {
  const pending = await getPendingAdmin(email);
  if (!pending || pending.nonce !== nonce) return null;
  const existing = await getUser(email);
  const user: RentalUser = {
    ...existing,
    ...pending.user,
    admin: true,
    createdAt: existing?.createdAt ?? pending.user.createdAt,
  };
  await saveUser(user);
  await kv(["DEL", key("pendingadmin", email)]);
  return user;
}
