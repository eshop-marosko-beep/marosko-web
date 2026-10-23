import { clearSessionCookieHeader } from "@/lib/rental/users";

export async function POST() {
  return Response.json({ success: true }, { headers: { "Set-Cookie": clearSessionCookieHeader() } });
}
