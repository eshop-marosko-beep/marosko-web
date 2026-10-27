import { getCurrentUser } from "@/lib/rental/users";

/** Who is signed in, for the account link in the site menu. */
export async function GET() {
  const user = await getCurrentUser();
  return Response.json(
    user ? { signedIn: true, name: user.name, isAdmin: user.isAdmin } : { signedIn: false },
    { headers: { "Cache-Control": "no-store" } }
  );
}
