import { DEFAULT_OG_IMAGE, toAbsoluteImageUrl } from "@/lib/seo";
import { galleryCategories } from "@/lib/galleryData";
import { blogPosts } from "@/lib/blogData";
import { videos } from "@/lib/videoData";

/** Absolute image URLs per internal (locale-agnostic) path, shared by the
 * main sitemap and the dedicated image sitemap. */
export const imagesByPath: Record<string, string[]> = {
  "/": [toAbsoluteImageUrl(DEFAULT_OG_IMAGE)],
  "/blog": blogPosts
    .filter((post) => post.image)
    .map(({ image }) => toAbsoluteImageUrl(image!)),
  "/navody": videos.map(({ file }) => toAbsoluteImageUrl(`/videos/${file}.jpg`)),
  ...Object.fromEntries(
    galleryCategories.map(({ slug, images }) => [
      `/galeria/${slug}`,
      images.map(({ src }) => toAbsoluteImageUrl(src)),
    ])
  ),
};
