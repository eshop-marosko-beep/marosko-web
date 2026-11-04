import { apiError, str } from "@/lib/rental/api";
import { getEshopProducts, searchEshopProducts } from "@/lib/eshopProducts";
import {
  createPost,
  deletePost,
  disconnect,
  isConfigured,
  MAX_PHOTOS,
  me,
  photoSourceUrl,
  TEXT_MAX,
  XError,
} from "@/lib/x";

/* Shared by /api/x (admin in the browser) and /api/x/agent (Claude with a
 * bearer token). Callers check access first. */

function xFailure(error: unknown) {
  if (error instanceof XError) {
    return Response.json({ success: false, error: error.code, message: error.message }, { status: 400 });
  }
  console.error("X request failed", error);
  return apiError("x_failed", 500);
}

/** Connection state and the connected account. */
export async function xOverview(): Promise<Response> {
  if (!isConfigured()) return Response.json({ success: true, configured: false, connected: false });
  try {
    return Response.json({ success: true, configured: true, connected: true, user: await me() });
  } catch (error) {
    if (error instanceof XError && error.code === "not_connected") {
      return Response.json({ success: true, configured: true, connected: false });
    }
    return xFailure(error);
  }
}

/** Product link on its own line at the end (links on X are clickable). */
function withProductLink(text: string, link: string): string {
  if (text.includes(link)) return text;
  return text ? `${text}\n\n${link}` : link;
}

/** Actions: "post", "products" (eshop search), "delete", and (when
 * allowed) "disconnect". */
export async function xAction(
  body: Record<string, unknown>,
  { allowDisconnect }: { allowDisconnect: boolean }
): Promise<Response> {
  try {
    switch (body.action) {
      case "post": {
        const productId = str(body.productId, 40);
        const product = productId ? (await getEshopProducts()).find((p) => p.id === productId) : undefined;
        if (productId && !product) return apiError("unknown_product", 400);

        // Photos: the ones given, else the product's first ones only when asked.
        const given = Array.isArray(body.photoUrls) ? body.photoUrls.filter((u): u is string => typeof u === "string") : [];
        const productPhotos = body.productPhotos === true ? (product?.images ?? []).slice(0, MAX_PHOTOS) : [];
        const sources = given.length ? given : productPhotos;
        if (sources.length > MAX_PHOTOS) return apiError("too_many_photos", 400);
        const photoUrls = sources.map((u) => photoSourceUrl(u));
        if (photoUrls.some((u) => !u)) return apiError("bad_photo_url", 400);

        let text = str(body.text, TEXT_MAX);
        if (product && body.addLink !== false) text = withProductLink(text, product.link);
        if (!text && !photoUrls.length) return apiError("text_required", 400);

        const replyTo = str(body.replyTo, 30);
        if (replyTo && !/^\d+$/.test(replyTo)) return apiError("bad_reply_to", 400);

        const user = await me();
        const post = await createPost({ text, photoUrls: photoUrls as string[], replyTo: replyTo || undefined }, user.username);
        return Response.json({ success: true, ...post, photoUrls });
      }
      case "products": {
        const query = str(body.q, 200);
        return Response.json({ success: true, products: await searchEshopProducts(query) });
      }
      case "delete": {
        const id = str(body.id, 30);
        if (!/^\d+$/.test(id)) return apiError("invalid_request", 400);
        return Response.json({ success: true, deleted: await deletePost(id) });
      }
      case "disconnect":
        if (!allowDisconnect) return apiError("forbidden", 403);
        await disconnect();
        return Response.json({ success: true });
      default:
        return apiError("invalid_request", 400);
    }
  } catch (error) {
    return xFailure(error);
  }
}
