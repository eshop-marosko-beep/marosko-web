import { DEFAULT_OG_IMAGE, toAbsoluteImageUrl } from "@/lib/seo";
import { galleryCategories } from "@/lib/galleryData";

/** Absolute image URLs per internal (locale-agnostic) path, shared by the
 * main sitemap and the dedicated image sitemap. */
export const imagesByPath: Record<string, string[]> = {
  "/": [toAbsoluteImageUrl(DEFAULT_OG_IMAGE)],
  ...Object.fromEntries(
    galleryCategories.map(({ slug, images }) => [
      `/galeria/${slug}`,
      images.map(({ src }) => toAbsoluteImageUrl(src)),
    ])
  ),
};
