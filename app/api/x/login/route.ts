import { randomId } from "@/lib/rental/crypto";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { authorizeUrl, isConfigured, X_STATE_COOKIE } from "@/lib/x";

/** Starts "Log in with X" (OAuth 2.0 + PKCE) for the shop account. Admins
 * only. The state and the PKCE verifier wait in a short-lived cookie. */
export async function GET(request: Request) {
  const back = new URL("/ucet/admin/x", request.url);
  const user = isPreviewDeployment() ? null : await getCurrentUser();
  if (!user?.isAdmin) return Response.redirect(new URL("/ucet/prihlasenie?next=/ucet/admin/x", request.url), 302);
  if (!isConfigured()) {
    back.searchParams.set("error", "not_configured");
    return Response.redirect(back, 302);
  }

  const state = randomId(16);
  const verifier = randomId(48);
  return new Response(null, {
    status: 302,
    headers: {
      Location: await authorizeUrl(state, verifier),
      "Set-Cookie": `${X_STATE_COOKIE}=${state}.${verifier}; Path=/api/x; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
