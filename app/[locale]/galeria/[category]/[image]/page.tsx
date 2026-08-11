import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { galleryCategories, getGalleryImage } from "@/lib/galleryData";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

export function generateStaticParams() {
  return galleryCategories.flatMap((category) =>
    category.images.map((image) => ({ category: category.slug, image: image.altKey }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; image: string }>;
}): Promise<Metadata> {
  const { locale, category, image } = await params;
  const found = getGalleryImage(category, image);
  if (!found) return {};

  const t = await getTranslations({ locale, namespace: "gallery" });
  const isProduct = found.category.cardStyle === "product";
  const title = isProduct
    ? t(`${found.category.translationKey}.products.${image}.title`)
    : t(`${found.category.translationKey}.${image}`);
  const description =
    (isProduct && t(`${found.category.translationKey}.products.${image}.description`)) ||
    t(`${found.category.translationKey}.short`);

  return buildMetadata({
    locale,
    path: `/galeria/${category}/${image}`,
    title: `${title} | Marián s.r.o.`,
    description,
    image: found.image.src,
  });
}

export default async function GalleryImagePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; image: string }>;
}) {
  const { locale, category, image } = await params;
  const found = getGalleryImage(category, image);
  if (!found) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("gallery");
  const tNav = await getTranslations("navigation");
  const { category: galleryCategory, image: img } = found;
  const isProduct = galleryCategory.cardStyle === "product";
  const title = isProduct
    ? t(`${galleryCategory.translationKey}.products.${image}.title`)
    : t(`${galleryCategory.translationKey}.${image}`);
  const description = isProduct
    ? t(`${galleryCategory.translationKey}.products.${image}.description`)
    : "";
  const categoryTitle = t(`${galleryCategory.translationKey}.title`);

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("gallery"), path: "/galeria" },
    { name: categoryTitle, path: `/galeria/${category}` },
    { name: title, path: `/galeria/${category}/${image}` },
  ]);

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <StructuredData data={breadcrumbSchema} />

      <Link
        href={`/galeria/${category}`}
        className="text-amber-700 font-semibold hover:underline mb-6 inline-block"
      >
        ← {t(`${galleryCategory.translationKey}.title`)}
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-72 sm:h-96 bg-cream-100">
          <Image
            src={img.src}
            alt={title}
            fill
            unoptimized
            className="object-contain p-6"
            priority
          />
          {img.badge && (
            <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {t(`badges.${img.badge}`)}
            </span>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-espresso-800 mb-2">{title}</h1>
          {description && <p className="text-gray-600 leading-relaxed mb-4">{description}</p>}
          {img.price && (
            <p className="mb-4">
              <span className="text-lg font-bold text-espresso-800">{img.price}</span>
              {img.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">{img.originalPrice}</span>
              )}
            </p>
          )}
          {img.productUrl && (
            <a
              href={img.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-6"
            >
              {t("productCta")} →
            </a>
          )}
          <div className="pt-4 border-t border-amber-100">
            <ShareButtons variant="compact" url={`/galeria/${category}/${image}`} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
