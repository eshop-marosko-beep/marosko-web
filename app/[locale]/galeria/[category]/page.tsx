import Image from "next/image";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { galleryCategories, getGalleryCategory } from "@/lib/galleryData";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export function generateStaticParams() {
  return galleryCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const galleryCategory = getGalleryCategory(category);
  if (!galleryCategory) return {};
  const t = await getTranslations({ locale, namespace: "gallery" });
  return buildMetadata({
    locale,
    path: `/galeria/${category}`,
    title: `${t(`${galleryCategory.translationKey}.title`)} | Marián s.r.o.`,
    description: t(`${galleryCategory.translationKey}.description`),
  });
}

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const galleryCategory = getGalleryCategory(category);
  if (!galleryCategory) {
    notFound();
  }

  const t = await getTranslations("gallery");
  const { translationKey, images, eshopUrl, cardStyle } = galleryCategory;

  return (
    <div className="py-8">
      <Link
        href="/galeria"
        className="text-amber-700 font-semibold hover:underline mb-6 inline-block"
      >
        ← {t("backToGallery")}
      </Link>
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">
        {t(`${translationKey}.title`)}
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">
        {t(`${translationKey}.description`)}
      </p>

      {cardStyle === "product" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {images.map(({ src, altKey, productUrl, price, originalPrice, badge }) => (
            <div
              key={src}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-48 bg-cream-100">
                <Image
                  src={src}
                  alt={t(`${translationKey}.products.${altKey}.title`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
                {badge && (
                  <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {t(`badges.${badge}`)}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-espresso-800 mb-2">
                  {t(`${translationKey}.products.${altKey}.title`)}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  {t(`${translationKey}.products.${altKey}.description`)}
                </p>
                <div className="flex items-center justify-between gap-3 mt-auto">
                  <div>
                    {originalPrice && (
                      <span className="text-gray-400 line-through text-sm mr-2">{originalPrice}</span>
                    )}
                    <span className="text-amber-700 font-bold text-lg">{price}</span>
                  </div>
                  {productUrl && (
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm whitespace-nowrap"
                    >
                      {t("productCta")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {images.map(({ src, altKey, productUrl }) => {
            const image = (
              <Image
                src={src}
                alt={t(`${translationKey}.${altKey}`)}
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            );

            return productUrl ? (
              <a
                key={src}
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-gray-200 rounded-lg h-40 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
              >
                {image}
              </a>
            ) : (
              <div
                key={src}
                className="relative bg-white border border-gray-200 rounded-lg h-40 overflow-hidden"
              >
                {image}
              </div>
            );
          })}
        </div>
      )}

      <a
        href={eshopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        {t(`${translationKey}.cta`)} →
      </a>
    </div>
  );
}
