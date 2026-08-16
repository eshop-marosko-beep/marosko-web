import { DEFAULT_OG_IMAGE, toAbsoluteImageUrl } from "@/lib/seo";
import { galleryCategories } from "@/lib/galleryData";
import { blogPosts } from "@/lib/blogData";
import { videos } from "@/lib/videoData";
import { kategorieArticles } from "@/lib/kategorieArticles";
import { guideArticles } from "@/lib/guideArticles";

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
  ...Object.fromEntries(
    galleryCategories.flatMap(({ slug, images }) =>
      images.map(({ altKey, src }) => [`/galeria/${slug}/${altKey}`, [toAbsoluteImageUrl(src)]])
    )
  ),
  ...Object.fromEntries(
    kategorieArticles
      .filter((article) => article.image)
      .map((article) => [`/kategorie/${article.slug}`, [toAbsoluteImageUrl(article.image!)]])
  ),
  ...Object.fromEntries(
    kategorieArticles.flatMap((article) =>
      article.subcategories
        .filter((sub): sub is typeof sub & { slug: string } => Boolean(sub.slug) && Boolean(sub.image))
        .map((sub) => [`/kategorie/${article.slug}/${sub.slug}`, [toAbsoluteImageUrl(sub.image!)]])
    )
  ),
  ...Object.fromEntries(
    guideArticles.map(({ slug, image }) => [`/navody/clanky/${slug}`, [toAbsoluteImageUrl(image)]])
  ),
};
