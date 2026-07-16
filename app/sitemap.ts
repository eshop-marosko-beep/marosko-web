import type { MetadataRoute } from "next";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { galleryCategories } from "@/lib/galleryData";

const staticPaths = ["/", "/o-nas", "/kategorie", "/galeria", "/blog", "/obchody", "/kontakt", "/gdpr"];

// Images per path (absolute URLs), so Google can index product photos via
// the sitemap's image extension. Keyed by the same internal path used above.
const imagesByPath: Record<string, string[]> = {
  "/": [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  ...Object.fromEntries(
    galleryCategories.map(({ slug, images }) => [
      `/galeria/${slug}`,
      images.map(({ src }) => `${SITE_URL}${src}`),
    ])
  ),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPaths = galleryCategories.map(({ slug }) => `/galeria/${slug}`);
  const paths = [...staticPaths, ...galleryPaths];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      lastModified: new Date(),
      ...(imagesByPath[path] ? { images: imagesByPath[path] } : {}),
    }))
  );
}
