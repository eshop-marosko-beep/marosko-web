import { apiError, readJson } from "@/lib/rental/api";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { tiktokAction, tiktokOverview } from "@/lib/tiktokHandlers";

/* The same TikTok actions for Claude (or another script), authorized by
 * "Authorization: Bearer <TIKTOK_AGENT_TOKEN>" instead of an admin login.
 * It can post and check status, but not disconnect the account; without
 * the env variable the endpoint is off.
 *
 *   GET  /api/tiktok/agent                         → account + site videos
 *   POST /api/tiktok/agent {action:"post", ...}    → { publishId }
 *   POST /api/tiktok/agent {action:"products", q}           → eshop products
 *   POST /api/tiktok/agent {action:"photo", productId?, photoUrls?, ...}
 *   POST /api/tiktok/agent {action:"status", publishId} */

const encoder = new TextEncoder();

async function authorized(request: Request): Promise<boolean> {
  const expected = process.env.TIKTOK_AGENT_TOKEN;
  if (isPreviewDeployment() || !expected || expected.length < 32) return false;
  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Compare hashes so the check takes the same time whatever was sent.
  const [a, b] = await Promise.all(
    [given, expected].map(async (v) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(v))))
  );
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function GET(request: Request) {
  if (!(await authorized(request))) return apiError("unauthorized", 401);
  return tiktokOverview();
}

export async function POST(request: Request) {
  if (!(await authorized(request))) return apiError("unauthorized", 401);
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  return tiktokAction(body, { allowDisconnect: false });
}
