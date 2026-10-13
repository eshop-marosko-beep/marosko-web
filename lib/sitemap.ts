import { SITE_URL, alternateLanguageUrls } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { galleryCategories } from "@/lib/galleryData";
import { kategorieArticles } from "@/lib/kategorieArticles";
import { guideArticles } from "@/lib/guideArticles";
import { blogPosts } from "@/lib/blogData";

const staticPaths = ["/", "/o-nas", "/kategorie", "/akcie", "/znacky", "/galeria", "/navody", "/blog", "/obchody", "/kontakt", "/gdpr"];

/** Every indexable path (locale-independent `href`s) on the site. */
export function sitemapPaths(): string[] {
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
  const blogPostPaths = blogPosts.map(({ slug }) => `/blog/${slug}`);

  return [
    ...staticPaths,
    ...galleryCategoryPaths,
    ...galleryImagePaths,
    ...kategorieDetailPaths,
    ...kategorieSubcategoryPaths,
    ...guideArticlePaths,
    ...blogPostPaths,
  ];
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Sitemap of one language version, with hreflang alternates for each URL. */
export function localeSitemapResponse(locale: string): Response {
  const lastmod = new Date().toISOString();
  const urls = sitemapPaths().map((path) => {
    const loc = `${SITE_URL}${getPathname({ locale, href: path })}`;
    const alternates = Object.entries(alternateLanguageUrls(path))
      .map(([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`)
      .join("");
    return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod>${alternates}</url>`;
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
    urls.join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
