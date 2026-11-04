import { apiError, readJson } from "@/lib/rental/api";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { xAction, xOverview } from "@/lib/xHandlers";

/* The same X actions for Claude (or another script), authorized by
 * "Authorization: Bearer <X_AGENT_TOKEN>" instead of an admin login. It can
 * post and delete posts, but not disconnect the account; without the env
 * variable the endpoint is off.
 *
 *   GET  /api/x/agent                                   → connected account
 *   POST /api/x/agent {action:"products", q}            → eshop products
 *   POST /api/x/agent {action:"post", text, productId?, addLink?,
 *                      productPhotos?, photoUrls?, replyTo?} → { id, url }
 *   POST /api/x/agent {action:"delete", id} */

const encoder = new TextEncoder();

async function authorized(request: Request): Promise<boolean> {
  const expected = process.env.X_AGENT_TOKEN;
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
  return xOverview();
}

export async function POST(request: Request) {
  if (!(await authorized(request))) return apiError("unauthorized", 401);
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  return xAction(body, { allowDisconnect: false });
}
