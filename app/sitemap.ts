import type { MetadataRoute } from "next";
import { SITE_URL, alternateLanguageUrls } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { sitemapPaths } from "@/lib/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = sitemapPaths();

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      lastModified: new Date(),
      alternates: { languages: alternateLanguageUrls(path) },
    }))
  );
}
