/** Shared bits of the admin panel (rental and guides). */

export type LocaleText = { sk: string; cz?: string; en?: string; ro?: string };

/** Sends one admin action; resolves with the response on success, null on failure. */
export type Act = (payload: Record<string, unknown>, success?: string) => Promise<Record<string, unknown> | null>;

export const input = "border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
export const button = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50";

export const LANGS = [
  ["cz", "česky"],
  ["en", "anglicky"],
  ["ro", "rumunsky"],
] as const;

/** Shrinks a photo in the browser to a JPEG of at most 1200 px, small
 * enough to store in the database. */
async function shrinkImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let quality = 0.85;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 1_300_000 && quality > 0.4) {
    quality -= 0.15;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  return url;
}

/** Uploads a photo and returns the address to store with the item. */
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await shrinkImage(file);
  const res = await fetch("/api/rental/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "uploadImage", dataUrl }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error);
  return data.url as string;
}
