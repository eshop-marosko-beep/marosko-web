import { apiError, readJson, str } from "@/lib/rental/api";
import { verifyPassword } from "@/lib/rental/crypto";
import { key, kv, kvPipeline } from "@/lib/rental/kv";
import { getUser, normalizeEmail, sessionCookieHeader } from "@/lib/rental/users";

/** After this many wrong passwords for one email, logins for it are refused
 * for LOCK_SECONDS, to slow down password guessing. */
const MAX_FAILURES = 8;
const LOCK_SECONDS = 15 * 60;

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);

  const email = normalizeEmail(str(body.email));
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return apiError("invalid_login", 401);

  const failKey = key("loginfail", email);
  const failures = Number((await kv<string | null>(["GET", failKey])) ?? 0);
  if (failures >= MAX_FAILURES) return apiError("too_many_attempts", 429);

  const user = await getUser(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    await kvPipeline([
      ["INCR", failKey],
      ["EXPIRE", failKey, LOCK_SECONDS],
    ]);
    return apiError("invalid_login", 401);
  }

  await kv(["DEL", failKey]);
  return Response.json(
    { success: true, isAdmin: Boolean(user.admin) },
    { headers: { "Set-Cookie": await sessionCookieHeader(user.email) } }
  );
}
