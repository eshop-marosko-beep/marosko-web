import { randomId } from "@/lib/rental/crypto";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { authorizeUrl, isConfigured, TIKTOK_STATE_COOKIE } from "@/lib/tiktok";

/** Starts "Log in with TikTok" for the shop account. Admins only. */
export async function GET(request: Request) {
  const back = new URL("/ucet/admin/tiktok", request.url);
  const user = isPreviewDeployment() ? null : await getCurrentUser();
  if (!user?.isAdmin) return Response.redirect(new URL("/ucet/prihlasenie?next=/ucet/admin/tiktok", request.url), 302);
  if (!isConfigured()) {
    back.searchParams.set("error", "not_configured");
    return Response.redirect(back, 302);
  }

  const state = randomId(16);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl(state),
      "Set-Cookie": `${TIKTOK_STATE_COOKIE}=${state}; Path=/api/tiktok; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
