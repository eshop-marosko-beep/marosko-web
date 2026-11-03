import { apiError, str } from "@/lib/rental/api";
import { getGuideVideos } from "@/lib/guidesCatalog";
import {
  creatorInfo,
  disconnect,
  isAllowedVideoUrl,
  isConfigured,
  MAX_PHOTOS,
  mutedVideoUrl,
  PHOTO_DESCRIPTION_MAX,
  PHOTO_TITLE_MAX,
  postStatus,
  startPhotoPost,
  startPost,
  TikTokError,
  tiktokPhotoUrl,
  userInfo,
} from "@/lib/tiktok";
import { getEshopProducts, searchEshopProducts } from "@/lib/eshopProducts";

/* Shared by /api/tiktok (admin in the browser) and /api/tiktok/agent
 * (Claude with a bearer token). Callers check access first. */

const SITE = "https://www.marosko.sk";

function tiktokFailure(error: unknown) {
  if (error instanceof TikTokError) {
    return Response.json({ success: false, error: error.code, message: error.message }, { status: 400 });
  }
  console.error("TikTok request failed", error);
  return apiError("tiktok_failed", 500);
}

/** Connection state, the connected creator and the site videos to pick from. */
export async function tiktokOverview(): Promise<Response> {
  const videos = (await getGuideVideos())
    .filter((v) => v.source === "file" && v.file)
    .map((v) => ({ title: v.titles.sk, url: `${SITE}/videos/${v.file}.mp4`, poster: `${SITE}${v.poster}` }));

  if (!isConfigured()) return Response.json({ success: true, configured: false, connected: false, videos });

  try {
    const [user, creator] = await Promise.all([userInfo(), creatorInfo()]);
    return Response.json({ success: true, configured: true, connected: true, user, creator, videos });
  } catch (error) {
    if (error instanceof TikTokError && error.code === "not_connected") {
      return Response.json({ success: true, configured: true, connected: false, videos });
    }
    return tiktokFailure(error);
  }
}

/** Caption line pointing to the product (TikTok captions are not
 * clickable, so it is the short address to type or the profile link). */
function withProductLink(description: string, shortLink: string): string {
  if (description.includes(shortLink)) return description;
  const line = `🛒 ${shortLink}`;
  return description ? `${description}\n\n${line}` : line;
}

/** Actions: "post" (video), "photo", "products" (eshop search), "status",
 * and (when allowed) "disconnect". */
export async function tiktokAction(
  body: Record<string, unknown>,
  { allowDisconnect }: { allowDisconnect: boolean }
): Promise<Response> {
  try {
    switch (body.action) {
      case "post": {
        let videoUrl = str(body.videoUrl, 500);
        if (!isAllowedVideoUrl(videoUrl)) return apiError("bad_video_url", 400);
        if (body.mute === true) {
          const muted = mutedVideoUrl(videoUrl);
          if (!muted) return apiError("mute_unavailable", 400);
          videoUrl = muted;
        }
        const direct = body.direct !== false;
        const privacyLevel = str(body.privacyLevel, 40);
        if (direct && !privacyLevel) return apiError("privacy_required", 400);
        const publishId = await startPost({
          videoUrl,
          title: str(body.title, 2200),
          privacyLevel,
          disableComment: body.disableComment === true,
          disableDuet: body.disableDuet === true,
          disableStitch: body.disableStitch === true,
          brandContent: body.brandContent === true,
          brandOrganic: body.brandOrganic === true,
          direct,
        });
        return Response.json({ success: true, publishId, videoUrl });
      }
      case "products": {
        const query = str(body.q, 200);
        return Response.json({ success: true, products: await searchEshopProducts(query) });
      }
      case "photo": {
        const productId = str(body.productId, 40);
        const product = productId ? (await getEshopProducts()).find((p) => p.id === productId) : undefined;
        if (productId && !product) return apiError("unknown_product", 400);

        const given = Array.isArray(body.photoUrls) ? body.photoUrls.filter((u): u is string => typeof u === "string") : [];
        const sources = given.length ? given : (product?.images ?? []);
        if (!sources.length) return apiError("photos_required", 400);
        if (sources.length > MAX_PHOTOS) return apiError("too_many_photos", 400);
        const photoUrls = sources.map((u) => tiktokPhotoUrl(u));
        if (photoUrls.some((u) => !u)) return apiError("bad_photo_url", 400);

        const direct = body.direct !== false;
        const privacyLevel = str(body.privacyLevel, 40);
        if (direct && !privacyLevel) return apiError("privacy_required", 400);

        const title = str(body.title, PHOTO_TITLE_MAX) || (product?.title ?? "").slice(0, PHOTO_TITLE_MAX);
        let description = str(body.description, PHOTO_DESCRIPTION_MAX);
        if (product && body.addLink !== false) description = withProductLink(description, product.shortLink);
        if (description.length > PHOTO_DESCRIPTION_MAX) return apiError("description_too_long", 400);

        const cover = Number(body.coverIndex ?? 0);
        const coverIndex = Number.isInteger(cover) && cover >= 0 && cover < photoUrls.length ? cover : 0;

        const publishId = await startPhotoPost({
          photoUrls: photoUrls as string[],
          coverIndex,
          title,
          description,
          privacyLevel,
          disableComment: body.disableComment === true,
          autoAddMusic: body.autoAddMusic !== false,
          brandContent: body.brandContent === true,
          brandOrganic: body.brandOrganic === true,
          direct,
        });
        return Response.json({ success: true, publishId, photoUrls, title, description });
      }
      case "status": {
        const publishId = str(body.publishId, 100);
        if (!publishId) return apiError("invalid_request", 400);
        return Response.json({ success: true, ...(await postStatus(publishId)) });
      }
      case "disconnect":
        if (!allowDisconnect) return apiError("forbidden", 403);
        await disconnect();
        return Response.json({ success: true });
      default:
        return apiError("invalid_request", 400);
    }
  } catch (error) {
    return tiktokFailure(error);
  }
}
