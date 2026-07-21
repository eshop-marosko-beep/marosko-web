import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { videos } from "@/lib/videoData";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

const messagesByLocale: Record<string, typeof skMessages> = {
  sk: skMessages,
  cz: czMessages,
  en: enMessages,
  ro: roMessages,
};

/** Kept in sync with lib/structuredData.ts's VIDEOS_UPLOAD_DATE. */
const UPLOAD_DATE = "2026-07-20";

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
  const urls = routing.locales.map((locale) => {
    const items = messagesByLocale[locale].videos.items as Record<
      string,
      { title: string; description: string }
    >;
    const loc = `${SITE_URL}${getPathname({ locale, href: "/navody" })}`;
    const videoTags = videos
      .map(({ file, duration, translationKey }) => {
        const { title, description } = items[translationKey];
        return (
          `<video:video>` +
          `<video:thumbnail_loc>${escapeXml(`${SITE_URL}/videos/${file}.jpg`)}</video:thumbnail_loc>` +
          `<video:title>${escapeXml(title)}</video:title>` +
          `<video:description>${escapeXml(description)}</video:description>` +
          `<video:content_loc>${escapeXml(`${SITE_URL}/videos/${file}.mp4`)}</video:content_loc>` +
          `<video:duration>${isoDurationToSeconds(duration)}</video:duration>` +
          `<video:publication_date>${UPLOAD_DATE}</video:publication_date>` +
          `<video:family_friendly>yes</video:family_friendly>` +
          `</video:video>`
        );
      })
      .join("");
    return `<url><loc>${escapeXml(loc)}</loc>${videoTags}</url>`;
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
