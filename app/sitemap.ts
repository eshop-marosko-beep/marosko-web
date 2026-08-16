import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { galleryCategories } from "@/lib/galleryData";
import { kategorieArticles } from "@/lib/kategorieArticles";
import { guideArticles } from "@/lib/guideArticles";

const staticPaths = ["/", "/o-nas", "/kategorie", "/znacky", "/galeria", "/navody", "/blog", "/obchody", "/kontakt", "/gdpr"];

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryCategoryPaths = galleryCategories.map(({ slug }) => `/galeria/${slug}`);
  const galleryImagePaths = galleryCategories.flatMap(({ slug, images }) =>
    images.map(({ altKey }) => `/galeria/${slug}/${altKey}`)
  );
  const kategorieDetailPaths = kategorieArticles.map(({ slug }) => `/kategorie/${slug}`);
  const kategorieSubcategoryPaths = kategorieArticles.flatMap(({ slug, subcategories }) =>
    subcategories
      .filter((sub): sub is typeof sub & { slug: string } => Boolean(sub.slug))
      .map((sub) => `/kategorie/${slug}/${sub.slug}`)
  );
  const guideArticlePaths = guideArticles.map(({ slug }) => `/navody/clanky/${slug}`);

  const paths = [
    ...staticPaths,
    ...galleryCategoryPaths,
    ...galleryImagePaths,
    ...kategorieDetailPaths,
    ...kategorieSubcategoryPaths,
    ...guideArticlePaths,
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      lastModified: new Date(),
    }))
  );
}
