import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { galleryCategories } from "@/lib/galleryData";

const locales = ["sk", "cz", "en", "ro"];
const staticPaths = ["", "/o-nas", "/kategorie", "/galeria", "/blog", "/obchody", "/kontakt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPaths = galleryCategories.map(({ slug }) => `/galeria/${slug}`);
  const paths = [...staticPaths, ...galleryPaths];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );
}
