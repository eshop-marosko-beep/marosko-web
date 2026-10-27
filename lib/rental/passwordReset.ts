import { randomId } from "@/lib/rental/crypto";
import { key, kv } from "@/lib/rental/kv";

/** One-time password reset links: a random token per email, valid for an
 * hour and deleted as soon as it is used. */
const TOKEN_SECONDS = 60 * 60;

export async function createResetToken(email: string): Promise<string> {
  const token = randomId(24);
  await kv(["SET", key("reset", email), token, "EX", TOKEN_SECONDS]);
  return token;
}

/** True and the token is gone when it matched; false otherwise. */
export async function consumeResetToken(email: string, token: string): Promise<boolean> {
  if (!token) return false;
  const stored = await kv<string | null>(["GET", key("reset", email)]);
  if (!stored || stored !== token) return false;
  await kv(["DEL", key("reset", email)]);
  return true;
}
