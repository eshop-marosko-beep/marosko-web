import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { getKategorieArticle, kategorieArticles } from "@/lib/kategorieArticles";
import { getGalleryCategory } from "@/lib/galleryData";
import type { Metadata } from "next";

export function generateStaticParams() {
  return kategorieArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getKategorieArticle(slug);
  if (!article) return {};

  const t = await getTranslations({ locale, namespace: `meta.kategorieDetail.${article.translationKey}` });
  return buildMetadata({
    locale,
    path: `/kategorie/${slug}`,
    title: t("title"),
    description: t("description"),
  });
}

export default async function KategorieDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getKategorieArticle(slug);
  if (!article) notFound();
  setRequestLocale(locale);

  const t = await getTranslations(`kategorieDetail.${article.translationKey}`);
  const tGallery = await getTranslations("gallery");
  const tServices = await getTranslations("services");

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">{t("title")}</h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-4">{t("lead")}</p>
      <p className="text-gray-600 leading-relaxed mb-10">{t("brands")}</p>

      {article.subcategories.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-espresso-800 mb-6">{t("subcategoriesTitle")}</h2>
          <div className="space-y-6 mb-10">
            {article.subcategories.map(({ translationKey, galleryLinks }) => (
              <div key={translationKey} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-espresso-800 mb-2">
                  {t(`subcategories.${translationKey}.name`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`subcategories.${translationKey}.description`)}
                </p>
                {galleryLinks && galleryLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                    {galleryLinks.map((gallerySlug) => {
                      const category = getGalleryCategory(gallerySlug);
                      if (!category) return null;
                      return (
                        <Link
                          key={gallerySlug}
                          href={`/galeria/${gallerySlug}`}
                          className="text-amber-700 font-semibold hover:underline text-sm"
                        >
                          {tGallery(`${category.translationKey}.title`)} →
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <a
        href={article.eshopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        {tServices("cta")} →
      </a>
    </div>
  );
}
