/** Password hashing and signed tokens on Web Crypto (built into Node), so
 * no extra package is needed. */

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

/** Constant-time comparison, so a wrong signature or password doesn't leak
 * how many leading characters were right. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function randomId(bytes = 12): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

const PBKDF2_ITERATIONS = 210_000;

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

/** Stored as "pbkdf2$<iterations>$<salt>$<hash>". */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) return false;
  const candidate = await pbkdf2(password, fromBase64Url(salt), Number(iterations));
  return timingSafeEqual(candidate, fromBase64Url(hash));
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("Chýba env premenná AUTH_SECRET (aspoň 16 znakov)");
  }
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
}

export async function sign(data: string): Promise<string> {
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export async function verifySignature(data: string, signature: string): Promise<boolean> {
  const expected = fromBase64Url(await sign(data));
  return timingSafeEqual(expected, fromBase64Url(signature));
}
