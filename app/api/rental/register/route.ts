import { apiError, EMAIL_RE, locale, readJson, str } from "@/lib/rental/api";
import { hashPassword } from "@/lib/rental/crypto";
import { DEFAULT_GROUP_ID } from "@/lib/rental/groups";
import { key, kv } from "@/lib/rental/kv";
import { sendAdminVerification } from "@/lib/rental/notify";
import {
  createUser,
  isAdminEmail,
  normalizeEmail,
  savePendingAdmin,
  sessionCookieHeader,
  type RentalUser,
} from "@/lib/rental/users";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);

  const name = str(body.name);
  const email = normalizeEmail(str(body.email));
  const phone = str(body.phone, 40);
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !EMAIL_RE.test(email) || phone.length < 6) return apiError("invalid_fields", 400);
  if (password.length < 8 || password.length > 200) return apiError("weak_password", 400);
  if (body.consent !== true) return apiError("consent_required", 400);

  const user: RentalUser = {
    email,
    name,
    phone,
    passwordHash: await hashPassword(password),
    locale: locale(body.locale),
    createdAt: new Date().toISOString(),
    groupId: DEFAULT_GROUP_ID,
  };

  // An admin address only becomes an account once the link sent to that
  // mailbox is opened, so nobody can make themselves admin by typing it in.
  if (isAdminEmail(email)) {
    // At most one confirmation email per 5 minutes, so the form can't be
    // used to flood the admin mailbox.
    const allowed = await kv<string | null>(["SET", key("adminmail", email), "1", "NX", "EX", 300]);
    if (allowed === "OK") {
      const nonce = await savePendingAdmin(user);
      await sendAdminVerification(user, nonce, new URL(request.url).origin);
    }
    return Response.json({ success: true, verifyEmail: true });
  }

  // Sign the session first: if that fails, no account is left behind that
  // the customer doesn't know was created.
  const sessionCookie = await sessionCookieHeader(email);
  if (!(await createUser(user))) return apiError("email_taken", 409);

  return Response.json({ success: true }, { headers: { "Set-Cookie": sessionCookie } });
}
