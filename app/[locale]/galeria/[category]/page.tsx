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
  const { translationKey, images, eshopUrl } = galleryCategory;

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {images.map(({ src, altKey }) => (
          <div
            key={src}
            className="relative bg-white border border-gray-200 rounded-lg h-40 overflow-hidden"
          >
            <Image
              src={src}
              alt={t(`${translationKey}.${altKey}`)}
              fill
              sizes="(min-width: 768px) 20vw, 50vw"
              className="object-contain p-2"
            />
          </div>
        ))}
      </div>
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
