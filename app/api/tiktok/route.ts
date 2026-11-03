import { apiError, readJson, str } from "@/lib/rental/api";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { getGuideVideos } from "@/lib/guidesCatalog";
import {
  creatorInfo,
  disconnect,
  isAllowedVideoUrl,
  isConfigured,
  postStatus,
  startPost,
  TikTokError,
  userInfo,
} from "@/lib/tiktok";

/** Admin page data and actions for the TikTok connection. */

const SITE = "https://www.marosko.sk";

async function requireAdmin() {
  if (isPreviewDeployment()) return null;
  const user = await getCurrentUser();
  return user?.isAdmin ? user : null;
}

function tiktokFailure(error: unknown) {
  if (error instanceof TikTokError) {
    return Response.json({ success: false, error: error.code, message: error.message }, { status: 400 });
  }
  console.error("TikTok request failed", error);
  return apiError("tiktok_failed", 500);
}

export async function GET() {
  if (!(await requireAdmin())) return apiError("forbidden", 403);

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

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("forbidden", 403);
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);

  try {
    switch (body.action) {
      case "post": {
        const videoUrl = str(body.videoUrl, 500);
        if (!isAllowedVideoUrl(videoUrl)) return apiError("bad_video_url", 400);
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
        return Response.json({ success: true, publishId });
      }
      case "status": {
        const publishId = str(body.publishId, 100);
        if (!publishId) return apiError("invalid_request", 400);
        return Response.json({ success: true, ...(await postStatus(publishId)) });
      }
      case "disconnect":
        await disconnect();
        return Response.json({ success: true });
      default:
        return apiError("invalid_request", 400);
    }
  } catch (error) {
    return tiktokFailure(error);
  }
}
