import { getImage } from "@/lib/rental/images";

/** A tool photo uploaded in the admin panel. Each upload gets a new id, so
 * the response never changes and can be cached for good. */
export async function GET(request: Request) {
  const id = new URL(request.url).pathname.split("/").pop() ?? "";
  const image = await getImage(id);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(image.bytes, {
    headers: { "Content-Type": image.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
