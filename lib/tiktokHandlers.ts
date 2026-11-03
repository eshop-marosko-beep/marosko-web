import { apiError, str } from "@/lib/rental/api";
import { getGuideVideos } from "@/lib/guidesCatalog";
import {
  creatorInfo,
  disconnect,
  isAllowedVideoUrl,
  isConfigured,
  mutedVideoUrl,
  postStatus,
  startPost,
  TikTokError,
  userInfo,
} from "@/lib/tiktok";

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

/** Actions: "post", "status", and (when allowed) "disconnect". */
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
