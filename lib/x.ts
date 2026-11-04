import { getJson, kv, siteKey } from "@/lib/rental/kv";

/* X (Twitter) connection for the shop's own account: OAuth 2.0 with PKCE
 * and the X API v2. The admin connects once at /ucet/admin/x; the tokens
 * live in the site database and are refreshed here, never sent to the
 * browser.
 *
 * Env: X_CLIENT_ID, X_CLIENT_SECRET (developer.x.com → app → Keys and tokens
 * → OAuth 2.0 Client ID and Client Secret; the app type must be "Web App"
 * = confidential client), optional X_REDIRECT_URI (must match the app's
 * Callback URI exactly). */

const API = "https://api.x.com";
const SITE = "https://www.marosko.sk";

export const X_SCOPES = "tweet.read tweet.write users.read media.write offline.access";
export const X_STATE_COOKIE = "marosko_x_state";

/** Photos per post (X limit). */
export const MAX_PHOTOS = 4;
/** Longest text sent; X itself decides (280 weighted characters for a
 * normal account, more with Premium). */
export const TEXT_MAX = 25000;

export function redirectUri(): string {
  return process.env.X_REDIRECT_URI ?? `${SITE}/api/x/callback`;
}

function credentials() {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Chýbajú env premenné X_CLIENT_ID / X_CLIENT_SECRET");
  }
  return { clientId, clientSecret };
}

export function isConfigured(): boolean {
  return Boolean(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET);
}

async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return Buffer.from(digest).toString("base64url");
}

export async function authorizeUrl(state: string, verifier: string): Promise<string> {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: credentials().clientId,
    redirect_uri: redirectUri(),
    scope: X_SCOPES,
    state,
    code_challenge: await codeChallenge(verifier),
    code_challenge_method: "S256",
  });
  return `https://x.com/i/oauth2/authorize?${params}`;
}

/* Tokens */

type StoredToken = {
  accessToken: string;
  refreshToken: string;
  scope: string;
  /** ms since epoch */
  expiresAt: number;
  connectedAt: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

const TOKEN_KEY = () => siteKey("x", "token");

function basicAuth(): string {
  const { clientId, clientSecret } = credentials();
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function tokenRequest(params: Record<string, string>): Promise<StoredToken> {
  const res = await fetch(`${API}/2/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuth() },
    body: new URLSearchParams({ client_id: credentials().clientId, ...params }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || data.error || !data.access_token || !data.refresh_token) {
    throw new XError(data.error ?? `http_${res.status}`, data.error_description ?? "");
  }
  const now = Date.now();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope ?? "",
    expiresAt: now + (data.expires_in ?? 7200) * 1000,
    connectedAt: new Date(now).toISOString(),
  };
}

async function saveToken(token: StoredToken): Promise<void> {
  await kv(["SET", TOKEN_KEY(), JSON.stringify(token)]);
}

export async function connectWithCode(code: string, verifier: string): Promise<void> {
  await saveToken(
    await tokenRequest({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    })
  );
}

/** A valid access token (they last 2 hours), refreshed when it is about to
 * expire; null when the account is not connected. X refresh tokens are
 * single use, so the new one is saved right away. */
async function accessToken(): Promise<string | null> {
  const token = await getJson<StoredToken>(TOKEN_KEY());
  if (!token) return null;
  if (token.expiresAt - Date.now() > 5 * 60 * 1000) return token.accessToken;
  let fresh: StoredToken;
  try {
    fresh = await tokenRequest({ grant_type: "refresh_token", refresh_token: token.refreshToken });
  } catch (error) {
    // A refresh token that was revoked or already used cannot recover.
    if (error instanceof XError && error.code === "invalid_request") return null;
    throw error;
  }
  await saveToken({ ...fresh, connectedAt: token.connectedAt });
  return fresh.accessToken;
}

export async function disconnect(): Promise<void> {
  const token = await getJson<StoredToken>(TOKEN_KEY());
  if (token) {
    // Best effort: the local copy goes either way.
    for (const [value, hint] of [
      [token.refreshToken, "refresh_token"],
      [token.accessToken, "access_token"],
    ]) {
      await fetch(`${API}/2/oauth2/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuth() },
        body: new URLSearchParams({ token: value, token_type_hint: hint, client_id: credentials().clientId }),
        cache: "no-store",
      }).catch(() => undefined);
    }
  }
  await kv(["DEL", TOKEN_KEY()]);
}

/* API calls */

export class XError extends Error {
  constructor(public code: string, message: string) {
    super(message || code);
  }
}

type ApiError = { title?: string; detail?: string; type?: string; status?: number; errors?: { message?: string }[] };

async function call<T>(path: string, init: { method: "GET" | "POST" | "DELETE"; body?: unknown; form?: FormData }): Promise<T> {
  const token = await accessToken();
  if (!token) throw new XError("not_connected", "X nie je prepojený.");
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.form ?? (init.body ? JSON.stringify(init.body) : undefined),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { data?: T } & ApiError;
  if (!res.ok) {
    const code =
      res.status === 401 ? "unauthorized" :
      res.status === 402 ? "payment_required" :
      res.status === 403 ? "x_forbidden" :
      res.status === 429 ? "rate_limited" :
      `http_${res.status}`;
    throw new XError(code, data.detail ?? data.title ?? data.errors?.[0]?.message ?? "");
  }
  return data.data as T;
}

export type XUser = { id: string; name: string; username: string; profile_image_url?: string };

export async function me(): Promise<XUser> {
  return call<XUser>("/2/users/me?user.fields=profile_image_url", { method: "GET" });
}

/* Photos */

const ESHOP_FILES = /^https:\/\/eshop\.marosko\.sk\/(?:resize\/[a-z]\/\d+\/\d+\/)?files\/(.+\.(?:jpe?g|png|webp))$/i;
const PHOTO_PROXY = /^https:\/\/www\.marosko\.sk\/tiktok-foto\/.+\.jpg$/;

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Where to fetch an eshop photo from: the site's converter at
 * www.marosko.sk/tiktok-foto/ (JPEG, at most 1080 px, transparency on
 * white); null for anything that is not an eshop photo. */
export function photoSourceUrl(url: string): string | null {
  const clean = url.trim().split(/[?#]/)[0];
  if (PHOTO_PROXY.test(clean)) return clean;
  const match = ESHOP_FILES.exec(clean);
  if (!match) return null;
  const path = match[1].split("/").map((p) => encodeURIComponent(decodeSafe(p))).join("/");
  return `${SITE}/tiktok-foto/${path}.jpg`;
}

/** Uploads one photo (already a converted JPEG URL) and returns its media id. */
async function uploadPhoto(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new XError("photo_fetch_failed", `Fotku sa nepodarilo načítať: ${url}`);
  const form = new FormData();
  form.append("media", new Blob([await res.arrayBuffer()], { type: "image/jpeg" }), "photo.jpg");
  form.append("media_category", "tweet_image");
  form.append("media_type", "image/jpeg");
  const data = await call<{ id: string }>("/2/media/upload", { method: "POST", form });
  return data.id;
}

/* Posts */

export type PostInput = {
  text: string;
  photoUrls: string[];
  /** Post id to reply to (for threads). */
  replyTo?: string;
};

export type PostResult = { id: string; url: string; text: string };

export async function createPost(input: PostInput, username: string): Promise<PostResult> {
  const mediaIds: string[] = [];
  for (const url of input.photoUrls) mediaIds.push(await uploadPhoto(url));
  const data = await call<{ id: string; text: string }>("/2/tweets", {
    method: "POST",
    body: {
      ...(input.text ? { text: input.text } : {}),
      ...(mediaIds.length ? { media: { media_ids: mediaIds } } : {}),
      ...(input.replyTo ? { reply: { in_reply_to_tweet_id: input.replyTo } } : {}),
    },
  });
  return { id: data.id, text: data.text, url: `https://x.com/${username || "i"}/status/${data.id}` };
}

export async function deletePost(id: string): Promise<boolean> {
  const data = await call<{ deleted: boolean }>(`/2/tweets/${encodeURIComponent(id)}`, { method: "DELETE" });
  return data.deleted;
}
