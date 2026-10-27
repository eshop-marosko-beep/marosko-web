import { apiError, EMAIL_RE, locale, readJson, str } from "@/lib/rental/api";
import { key, kv } from "@/lib/rental/kv";
import { sendPasswordReset } from "@/lib/rental/notify";
import { createResetToken } from "@/lib/rental/passwordReset";
import { getUser, normalizeEmail } from "@/lib/rental/users";

/** Sends a password reset link. The answer is the same whether or not an
 * account exists, so the form can't be used to find out who is registered. */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  const email = normalizeEmail(str(body.email));
  if (!EMAIL_RE.test(email)) return apiError("invalid_fields", 400);

  const user = await getUser(email);
  // At most one link per 5 minutes per address, so nobody can flood a mailbox.
  const allowed = user && (await kv<string | null>(["SET", key("resetmail", email), "1", "NX", "EX", 300])) === "OK";
  if (user && allowed) {
    const token = await createResetToken(email);
    const url = new URL(request.url);
    const prefix = user.locale && user.locale !== "sk" ? `/${user.locale}` : "";
    const link = `${url.origin}${prefix}/ucet/nove-heslo?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    try {
      await sendPasswordReset({ email, name: user.name, locale: locale(body.locale ?? user.locale) }, link);
    } catch (error) {
      console.error("Password reset email failed", error);
    }
  }
  return Response.json({ success: true });
}
