import { apiError, readJson, str } from "@/lib/rental/api";
import { hashPassword } from "@/lib/rental/crypto";
import { key, kv } from "@/lib/rental/kv";
import { consumeResetToken } from "@/lib/rental/passwordReset";
import { getUser, normalizeEmail, saveUser, sessionCookieHeader } from "@/lib/rental/users";

/** Sets the new password from a reset link and signs the user in. */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  const email = normalizeEmail(str(body.email));
  const token = str(body.token, 100);
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < 8 || password.length > 200) return apiError("weak_password", 400);

  const user = await getUser(email);
  if (!user || !(await consumeResetToken(email, token))) return apiError("reset_invalid", 400);

  user.passwordHash = await hashPassword(password);
  await saveUser(user);
  await kv(["DEL", key("loginfail", email)]);
  return Response.json(
    { success: true, isAdmin: Boolean(user.admin) },
    { headers: { "Set-Cookie": await sessionCookieHeader(user.email) } }
  );
}
