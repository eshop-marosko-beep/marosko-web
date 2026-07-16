import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { imagesByPath } from "@/lib/sitemapImages";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const urls = routing.locales.flatMap((locale) =>
    Object.entries(imagesByPath).map(([path, images]) => {
      const loc = `${SITE_URL}${getPathname({ locale, href: path })}`;
      const imageTags = images
        .map((src) => `<image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`)
        .join("");
      return `<url><loc>${escapeXml(loc)}</loc>${imageTags}</url>`;
    })
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    urls.join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
