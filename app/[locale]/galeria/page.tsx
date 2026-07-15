import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { galleryCategories } from "@/lib/galleryData";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.gallery" });
  return buildMetadata({ locale, path: "/galeria", title: t("title"), description: t("description") });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery");

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">
        {t("title")}
      </h1>
      <p className="text-gray-600 mb-12">
        {t("description")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryCategories.map(({ slug, translationKey, images }, index) => (
          <Link
            key={slug}
            href={`/${locale}/galeria/${slug}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-56 bg-cream-100">
              <Image
                src={images[0].src}
                alt={t(`${translationKey}.title`)}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-espresso-800 mb-2">
                {t(`${translationKey}.title`)}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                {t(`${translationKey}.short`)}
              </p>
              <span className="text-amber-700 font-semibold">
                {t(`${translationKey}.viewAll`, { count: images.length })} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
