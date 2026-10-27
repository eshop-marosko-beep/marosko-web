import { SITE_URL, toAbsoluteImageUrl } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { youTubeEmbedUrl } from "@/lib/videoData";
import { getGuideVideos, localized } from "@/lib/guidesCatalog";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Video sitemap duration must be whole seconds; our data stores ISO 8601 (e.g. "PT1M1S"). */
function isoDurationToSeconds(iso: string): number {
  const match = /^PT(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  const minutes = Number(match?.[1] ?? 0);
  const seconds = Number(match?.[2] ?? 0);
  return minutes * 60 + seconds;
}

export async function GET() {
  const videos = (await getGuideVideos()).filter((video) => video.active);
  const urls = routing.locales.flatMap((locale) => {
    return videos.map((video) => {
      const title = localized(video.titles, locale);
      const description = localized(video.descriptions, locale);
      const loc = `${SITE_URL}${getPathname({ locale, href: `/navody/${video.slug}` })}`;
      // Self-hosted clips declare the file itself; embedded YouTube videos
      // declare the player instead (Google accepts either).
      const locationTags =
        video.source === "youtube" && video.youtubeId
          ? `<video:player_loc>${escapeXml(youTubeEmbedUrl(video.youtubeId))}</video:player_loc>`
          : `<video:content_loc>${escapeXml(`${SITE_URL}/videos/${video.file}.mp4`)}</video:content_loc>` +
            `<video:duration>${isoDurationToSeconds(video.duration ?? "")}</video:duration>`;
      const videoTag =
        `<video:video>` +
        `<video:thumbnail_loc>${escapeXml(toAbsoluteImageUrl(video.poster))}</video:thumbnail_loc>` +
        `<video:title>${escapeXml(title)}</video:title>` +
        `<video:description>${escapeXml(description)}</video:description>` +
        locationTags +
        `<video:family_friendly>yes</video:family_friendly>` +
        `</video:video>`;
      return `<url><loc>${escapeXml(loc)}</loc>${videoTag}</url>`;
    });
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">` +
    urls.join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
