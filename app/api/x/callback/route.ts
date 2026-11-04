import { cookies } from "next/headers";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { connectWithCode, X_STATE_COOKIE, XError } from "@/lib/x";

/** X sends the admin back here after login (the app's Callback URI). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = new URL("/ucet/admin/x", request.url);
  const done = (error?: string) => {
    if (error) back.searchParams.set("error", error);
    else back.searchParams.set("connected", "1");
    return new Response(null, {
      status: 302,
      headers: {
        Location: back.toString(),
        "Set-Cookie": `${X_STATE_COOKIE}=; Path=/api/x; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      },
    });
  };

  const user = isPreviewDeployment() ? null : await getCurrentUser();
  if (!user?.isAdmin) return done("forbidden");

  const [expected, verifier] = ((await cookies()).get(X_STATE_COOKIE)?.value ?? "").split(".");
  const state = url.searchParams.get("state");
  if (!expected || !verifier || !state || expected !== state) return done("bad_state");

  const xError = url.searchParams.get("error");
  if (xError) return done(xError === "access_denied" ? "access_denied" : "login_failed");

  const code = url.searchParams.get("code");
  if (!code) return done("login_failed");

  try {
    await connectWithCode(code, verifier);
  } catch (error) {
    console.error("X token exchange failed", error instanceof XError ? `${error.code} ${error.message}` : error);
    return done("token_failed");
  }
  return done();
}
