import sharp from "sharp";

/* Eshop product photos served from www.marosko.sk, the domain verified in
 * the TikTok app, so TikTok can pull them for photo posts.
 *
 *   /tiktok-foto/<path under eshop.marosko.sk/files/>.jpg
 *
 * TikTok takes only JPEG or WebP up to 1080p, and some eshop photos are PNG
 * (often transparent), so every photo is converted: at most 1080 px on the
 * longer side, transparency on white, JPEG. Only eshop /files/ images are
 * served, nothing else. */

const ESHOP_FILES = "https://eshop.marosko.sk/files/";
const MAX_SIDE = 1080;

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const parts = path.map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  const last = parts.length - 1;
  if (last < 0 || !parts[last].endsWith(".jpg")) return new Response("Not found", { status: 404 });
  parts[last] = parts[last].slice(0, -4);
  if (parts.some((p) => !p || p === "." || p === ".." || p.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }
  if (!/\.(jpe?g|png|webp)$/i.test(parts[last])) return new Response("Not found", { status: 404 });

  const source = ESHOP_FILES + parts.map(encodeURIComponent).join("/");
  const res = await fetch(source, { cache: "no-store" });
  if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
      .rotate()
      .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 90, mozjpeg: true, progressive: false })
      .toBuffer();
    return new Response(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
