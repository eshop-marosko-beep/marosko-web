import { apiError, readJson } from "@/lib/rental/api";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { xAction, xOverview } from "@/lib/xHandlers";

/* The same X actions for Claude (or another script), authorized by
 * "Authorization: Bearer <token>" instead of an admin login, where the token
 * is X_AGENT_TOKEN or TIKTOK_AGENT_TOKEN (the one Claude's sessions already
 * send for www.marosko.sk). It can post and delete posts, but not
 * disconnect the account; without either env variable the endpoint is off.
 *
 *   GET  /api/x/agent                                   → connected account
 *   POST /api/x/agent {action:"products", q}            → eshop products
 *   POST /api/x/agent {action:"post", text, productId?, addLink?,
 *                      productPhotos?, photoUrls?, replyTo?} → { id, url }
 *   POST /api/x/agent {action:"delete", id} */

const encoder = new TextEncoder();

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function authorized(request: Request): Promise<boolean> {
  if (isPreviewDeployment()) return false;
  const tokens = [process.env.X_AGENT_TOKEN, process.env.TIKTOK_AGENT_TOKEN].filter(
    (t): t is string => Boolean(t && t.length >= 32)
  );
  if (!tokens.length) return false;
  const header = request.headers.get("authorization") ?? "";
  const given = await sha256(header.startsWith("Bearer ") ? header.slice(7) : "");
  // Compare hashes so the check takes the same time whatever was sent.
  let ok = false;
  for (const token of tokens) {
    const expected = await sha256(token);
    let diff = 0;
    for (let i = 0; i < given.length; i++) diff |= given[i] ^ expected[i];
    ok = ok || diff === 0;
  }
  return ok;
}

export async function GET(request: Request) {
  if (!(await authorized(request))) return apiError("unauthorized", 401);
  return xOverview();
}

export async function POST(request: Request) {
  if (!(await authorized(request))) return apiError("unauthorized", 401);
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  return xAction(body, { allowDisconnect: false });
}
