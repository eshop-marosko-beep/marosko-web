import { randomId } from "@/lib/rental/crypto";
import { getJson, key, kv } from "@/lib/rental/kv";

/** Tool photos uploaded in the admin panel. The browser shrinks them to a
 * JPEG of a few hundred kB first, so they fit in the database and no extra
 * file storage is needed. Served by /api/rental/image/[id]. */

type StoredImage = { type: string; data: string };

const MAX_BASE64 = 1_400_000; // about 1 MB of image

export async function saveImage(dataUrl: string): Promise<string | null> {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match || match[2].length > MAX_BASE64) return null;
  const id = randomId(12);
  await kv(["SET", key("image", id), JSON.stringify({ type: match[1], data: match[2] } satisfies StoredImage)]);
  return `/api/rental/image/${id}`;
}

export async function getImage(id: string): Promise<{ type: string; bytes: Uint8Array } | null> {
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(id)) return null;
  const image = await getJson<StoredImage>(key("image", id));
  if (!image) return null;
  return { type: image.type, bytes: Uint8Array.from(Buffer.from(image.data, "base64")) };
}
