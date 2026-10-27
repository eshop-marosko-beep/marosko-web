import type { MetadataRoute } from "next";
import { SITE_URL, alternateLanguageUrls } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { sitemapPaths } from "@/lib/sitemap";
import { getCatalog } from "@/lib/rental/catalog";
import { getCustomArticles } from "@/lib/guidesCatalog";

// Rental tools and guide articles are added in the admin panel, so rebuild the list hourly.
export const revalidate = 3600;

async function customArticlePaths(): Promise<string[]> {
  return (await getCustomArticles()).filter((a) => a.active).map((a) => `/navody/clanky/${a.slug}`);
}

async function rentalToolPaths(): Promise<string[]> {
  try {
    return (await getCatalog()).filter((tool) => tool.active).map((tool) => `/pozicovna/${tool.slug}`);
  } catch {
    // Without the rental database the rest of the sitemap still works.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [...sitemapPaths(), ...(await rentalToolPaths()), ...(await customArticlePaths())];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      lastModified: new Date(),
      alternates: { languages: alternateLanguageUrls(path) },
    }))
  );
}
