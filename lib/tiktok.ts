import { getJson, kv, siteKey } from "@/lib/rental/kv";

/* TikTok connection for the shop's own account (Login Kit + Content Posting
 * API). The admin connects once at /ucet/admin/tiktok; the tokens live in
 * the site database and are refreshed here, never sent to the browser.
 *
 * Env: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET (from developers.tiktok.com),
 * optional TIKTOK_REDIRECT_URI (must match the app's Redirect URI exactly). */

const API = "https://open.tiktokapis.com";
const SITE = "https://www.marosko.sk";

export const TIKTOK_SCOPES = "user.info.basic,video.upload,video.publish";
export const TIKTOK_STATE_COOKIE = "marosko_tiktok_state";

export function redirectUri(): string {
  return process.env.TIKTOK_REDIRECT_URI ?? `${SITE}/api/tiktok/callback`;
}

function credentials() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    throw new Error("Chýbajú env premenné TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET");
  }
  return { clientKey, clientSecret };
}

export function isConfigured(): boolean {
  return Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET);
}

export function authorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_key: credentials().clientKey,
    scope: TIKTOK_SCOPES,
    response_type: "code",
    redirect_uri: redirectUri(),
    state,
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
}

/* Tokens */

type StoredToken = {
  accessToken: string;
  refreshToken: string;
  openId: string;
  scope: string;
  /** ms since epoch */
  expiresAt: number;
  refreshExpiresAt: number;
  connectedAt: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  open_id?: string;
  scope?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  error?: string;
  error_description?: string;
};

const TOKEN_KEY = () => siteKey("tiktok", "token");

async function tokenRequest(params: Record<string, string>): Promise<StoredToken> {
  const { clientKey, clientSecret } = credentials();
  const res = await fetch(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, ...params }),
    cache: "no-store",
  });
  const data = (await res.json()) as TokenResponse;
  if (!res.ok || data.error || !data.access_token || !data.refresh_token) {
    throw new TikTokError(data.error ?? `http_${res.status}`, data.error_description ?? "");
  }
  const now = Date.now();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    openId: data.open_id ?? "",
    scope: data.scope ?? "",
    expiresAt: now + (data.expires_in ?? 0) * 1000,
    refreshExpiresAt: now + (data.refresh_expires_in ?? 0) * 1000,
    connectedAt: new Date(now).toISOString(),
  };
}

async function saveToken(token: StoredToken): Promise<void> {
  await kv(["SET", TOKEN_KEY(), JSON.stringify(token)]);
}

export async function connectWithCode(code: string): Promise<void> {
  await saveToken(
    await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: redirectUri() })
  );
}

/** A valid access token, refreshed when it is about to expire; null when
 * the account is not connected (or the refresh token ran out). */
async function accessToken(): Promise<string | null> {
  const token = await getJson<StoredToken>(TOKEN_KEY());
  if (!token) return null;
  if (token.expiresAt - Date.now() > 5 * 60 * 1000) return token.accessToken;
  if (token.refreshExpiresAt < Date.now()) return null;
  const fresh = await tokenRequest({ grant_type: "refresh_token", refresh_token: token.refreshToken });
  await saveToken({ ...fresh, connectedAt: token.connectedAt });
  return fresh.accessToken;
}

export async function disconnect(): Promise<void> {
  const token = await getJson<StoredToken>(TOKEN_KEY());
  if (token) {
    const { clientKey, clientSecret } = credentials();
    // Best effort: the local copy goes either way.
    await fetch(`${API}/v2/oauth/revoke/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, token: token.accessToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  await kv(["DEL", TOKEN_KEY()]);
}

/* API calls */

export class TikTokError extends Error {
  constructor(public code: string, message: string) {
    super(message || code);
  }
}

type ApiEnvelope<T> = { data?: T; error?: { code?: string; message?: string } };

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<T> {
  const token = await accessToken();
  if (!token) throw new TikTokError("not_connected", "TikTok nie je prepojený.");
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json; charset=UTF-8" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  const code = data.error?.code ?? (res.ok ? "ok" : `http_${res.status}`);
  if (code !== "ok") throw new TikTokError(code, data.error?.message ?? "");
  return data.data as T;
}

export type TikTokUser = { open_id: string; display_name: string; avatar_url: string };

export async function userInfo(): Promise<TikTokUser> {
  const data = await call<{ user: TikTokUser }>("/v2/user/info/?fields=open_id,display_name,avatar_url", {
    method: "GET",
  });
  return data.user;
}

export type CreatorInfo = {
  creator_avatar_url: string;
  creator_username: string;
  creator_nickname: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
};

export async function creatorInfo(): Promise<CreatorInfo> {
  return call<CreatorInfo>("/v2/post/publish/creator_info/query/", { method: "POST", body: {} });
}

export type PostInput = {
  videoUrl: string;
  title: string;
  privacyLevel: string;
  disableComment: boolean;
  disableDuet: boolean;
  disableStitch: boolean;
  brandContent: boolean;
  brandOrganic: boolean;
  /** true = straight to the profile (video.publish); false = draft in the
   * TikTok inbox to finish in the app (video.upload). */
  direct: boolean;
};

/** Video URLs must be on the domain verified in the TikTok app. */
export function isAllowedVideoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "marosko.sk" || u.hostname.endsWith(".marosko.sk"));
  } catch {
    return false;
  }
}

/** The same site video without its sound track (muted copies live in
 * public/videos/bez-zvuku/, made with `ffmpeg -an -c copy`); null when the
 * URL is not one of the site's own clips. */
export function mutedVideoUrl(url: string): string | null {
  const match = /^https:\/\/(?:www\.)?marosko\.sk\/videos\/([a-z0-9-]+\.mp4)$/.exec(url);
  return match ? `${SITE}/videos/bez-zvuku/${match[1]}` : null;
}

export async function startPost(input: PostInput): Promise<string> {
  const source_info = { source: "PULL_FROM_URL", video_url: input.videoUrl };
  const data = input.direct
    ? await call<{ publish_id: string }>("/v2/post/publish/video/init/", {
        method: "POST",
        body: {
          post_info: {
            title: input.title,
            privacy_level: input.privacyLevel,
            disable_comment: input.disableComment,
            disable_duet: input.disableDuet,
            disable_stitch: input.disableStitch,
            brand_content_toggle: input.brandContent,
            brand_organic_toggle: input.brandOrganic,
          },
          source_info,
        },
      })
    : await call<{ publish_id: string }>("/v2/post/publish/inbox/video/init/", {
        method: "POST",
        body: { source_info },
      });
  return data.publish_id;
}

/* Photo posts (carousel of 1–35 photos). Same scopes as video: direct posts
 * need video.publish, drafts sent to the app need video.upload. */

export const MAX_PHOTOS = 35;
export const PHOTO_TITLE_MAX = 90;
export const PHOTO_DESCRIPTION_MAX = 4000;

const ESHOP_FILES = /^https:\/\/eshop\.marosko\.sk\/(?:resize\/[a-z]\/\d+\/\d+\/)?files\/(.+\.(?:jpe?g|png|webp))$/i;
const PHOTO_PROXY = /^https:\/\/www\.marosko\.sk\/tiktok-foto\/.+\.jpg$/;

/** The URL TikTok should pull a photo from: eshop photos go through
 * www.marosko.sk/tiktok-foto/ (verified domain, converted to JPEG); null
 * for anything else. */
export function tiktokPhotoUrl(url: string): string | null {
  const clean = url.trim().split(/[?#]/)[0];
  if (PHOTO_PROXY.test(clean)) return clean;
  const match = ESHOP_FILES.exec(clean);
  if (!match) return null;
  const path = match[1].split("/").map((p) => encodeURIComponent(decodeURIComponentSafe(p))).join("/");
  return `${SITE}/tiktok-foto/${path}.jpg`;
}

function decodeURIComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export type PhotoPostInput = {
  photoUrls: string[];
  coverIndex: number;
  title: string;
  description: string;
  privacyLevel: string;
  disableComment: boolean;
  autoAddMusic: boolean;
  brandContent: boolean;
  brandOrganic: boolean;
  direct: boolean;
};

export async function startPhotoPost(input: PhotoPostInput): Promise<string> {
  const data = await call<{ publish_id: string }>("/v2/post/publish/content/init/", {
    method: "POST",
    body: {
      post_info: {
        title: input.title,
        description: input.description,
        ...(input.direct
          ? {
              privacy_level: input.privacyLevel,
              disable_comment: input.disableComment,
              auto_add_music: input.autoAddMusic,
              brand_content_toggle: input.brandContent,
              brand_organic_toggle: input.brandOrganic,
            }
          : {}),
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_cover_index: input.coverIndex,
        photo_images: input.photoUrls,
      },
      post_mode: input.direct ? "DIRECT_POST" : "MEDIA_UPLOAD",
      media_type: "PHOTO",
    },
  });
  return data.publish_id;
}

export type PostStatus = { status: string; fail_reason?: string; publicaly_available_post_id?: string[] };

export async function postStatus(publishId: string): Promise<PostStatus> {
  return call<PostStatus>("/v2/post/publish/status/fetch/", { method: "POST", body: { publish_id: publishId } });
}
