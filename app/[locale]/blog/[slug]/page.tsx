import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts, getBlogPost } from "@/lib/blogData";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import { Link } from "@/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

// Always visible (not hover-only) so touch users on phones — who can't hover —
// can tell the image is tappable to open at full size.
function ZoomHint() {
  return (
    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-espresso-800/70 text-white group-hover:bg-espresso-800/90 transition-colors">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const t = await getTranslations({ locale, namespace: "blog.posts" });
  const title = post.translationKey ? t(`${post.translationKey}.title`) : post.title;
  const description = post.translationKey ? t(`${post.translationKey}.description`) : undefined;

  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description: description ?? title,
    ...(post.image ? { image: post.image } : {}),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("blog.posts");
  const tBlog = await getTranslations("blog");
  const openImageLabel = tBlog("openImage");
  const tServices = await getTranslations("services");
  const tNav = await getTranslations("navigation");

  const title = post.translationKey ? t(`${post.translationKey}.title`) : post.title;
  const description = post.translationKey ? t(`${post.translationKey}.description`) : undefined;

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("blog"), path: "/blog" },
    { name: title, path: `/blog/${slug}` },
  ]);

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <StructuredData data={breadcrumbSchema} />

      <h1 className="text-4xl font-bold text-espresso-800 mb-6">{title}</h1>

      {post.image && (
        <div className={post.secondImage ? "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" : "mb-6"}>
          <a
            href={post.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={openImageLabel}
            title={openImageLabel}
            className="group relative block h-64 md:h-80 rounded-xl overflow-hidden bg-cream-100"
          >
            <Image src={post.image} alt={title} fill unoptimized className="object-contain p-6" priority />
            <ZoomHint />
          </a>
          {post.secondImage && (
            <a
              href={post.secondImage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={openImageLabel}
              title={openImageLabel}
              className="group relative block h-64 md:h-80 rounded-xl overflow-hidden bg-cream-100"
            >
              <Image
                src={post.secondImage}
                alt={`${title} – detail produktu`}
                fill
                unoptimized
                className="object-contain p-6"
              />
              <ZoomHint />
            </a>
          )}
        </div>
      )}

      <div className="mb-6">
        <ShareButtons variant="compact" url={`/blog/${slug}`} title={title} />
      </div>

      {description && <p className="text-gray-600 text-lg leading-relaxed mb-10">{description}</p>}

      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        {tServices("cta")} →
      </a>

      <p className="mt-10">
        <Link href="/blog" className="text-amber-700 font-semibold hover:underline">
          ← {tBlog("title")}
        </Link>
      </p>
    </div>
  );
}
