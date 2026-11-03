import { cookies } from "next/headers";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { connectWithCode, TIKTOK_STATE_COOKIE, TikTokError } from "@/lib/tiktok";

/** TikTok sends the admin back here after login (the app's Redirect URI). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = new URL("/ucet/admin/tiktok", request.url);
  const done = (error?: string) => {
    if (error) back.searchParams.set("error", error);
    else back.searchParams.set("connected", "1");
    return new Response(null, {
      status: 302,
      headers: {
        Location: back.toString(),
        "Set-Cookie": `${TIKTOK_STATE_COOKIE}=; Path=/api/tiktok; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      },
    });
  };

  const user = isPreviewDeployment() ? null : await getCurrentUser();
  if (!user?.isAdmin) return done("forbidden");

  const expected = (await cookies()).get(TIKTOK_STATE_COOKIE)?.value;
  const state = url.searchParams.get("state");
  if (!expected || !state || expected !== state) return done("bad_state");

  const tiktokError = url.searchParams.get("error");
  if (tiktokError) return done(tiktokError === "access_denied" ? "access_denied" : "login_failed");

  const code = url.searchParams.get("code");
  if (!code) return done("login_failed");

  try {
    await connectWithCode(code);
  } catch (error) {
    console.error("TikTok token exchange failed", error instanceof TikTokError ? error.code : error);
    return done("token_failed");
  }
  return done();
}
