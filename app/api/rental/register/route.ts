import { apiError, EMAIL_RE, locale, readJson, str } from "@/lib/rental/api";
import { hashPassword } from "@/lib/rental/crypto";
import { createUser, normalizeEmail, sessionCookieHeader } from "@/lib/rental/users";

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

  // Sign the session first: if that fails, no account is left behind that
  // the customer doesn't know was created.
  const sessionCookie = await sessionCookieHeader(email);
  const created = await createUser({
    email,
    name,
    phone,
    passwordHash: await hashPassword(password),
    locale: locale(body.locale),
    createdAt: new Date().toISOString(),
  });
  if (!created) return apiError("email_taken", 409);

  return Response.json({ success: true }, { headers: { "Set-Cookie": sessionCookie } });
}
