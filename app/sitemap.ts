import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { galleryCategories } from "@/lib/galleryData";

const staticPaths = ["/", "/o-nas", "/kategorie", "/galeria", "/blog", "/obchody", "/kontakt", "/gdpr"];

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPaths = galleryCategories.map(({ slug }) => `/galeria/${slug}`);
  const paths = [...staticPaths, ...galleryPaths];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      lastModified: new Date(),
    }))
  );
}
