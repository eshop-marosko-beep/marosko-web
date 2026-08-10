import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { getKategorieSubcategory, kategorieArticles } from "@/lib/kategorieArticles";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

export function generateStaticParams() {
  return kategorieArticles.flatMap((article) =>
    article.subcategories
      .filter((sub): sub is typeof sub & { slug: string } => Boolean(sub.slug))
      .map((sub) => ({ slug: article.slug, subcategory: sub.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subcategory: string }>;
}): Promise<Metadata> {
  const { locale, slug, subcategory } = await params;
  const found = getKategorieSubcategory(slug, subcategory);
  if (!found) return {};

  const t = await getTranslations({
    locale,
    namespace: `meta.kategorieSubcategoryDetail.${found.article.translationKey}.${found.subcategory.translationKey}`,
  });
  return buildMetadata({
    locale,
    path: `/kategorie/${slug}/${subcategory}`,
    title: t("title"),
    description: t("description"),
    ...(found.subcategory.image ? { image: found.subcategory.image } : {}),
  });
}

export default async function KategorieSubcategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subcategory: string }>;
}) {
  const { locale, slug, subcategory } = await params;
  const found = getKategorieSubcategory(slug, subcategory);
  if (!found) notFound();
  setRequestLocale(locale);

  const { article, subcategory: sub } = found;
  const t = await getTranslations(
    `kategorieSubcategoryDetail.${article.translationKey}.${sub.translationKey}`
  );
  const tParent = await getTranslations(`kategorieDetail.${article.translationKey}`);
  const tCommon = await getTranslations("kategorieSubcategoryDetail.common");
  const tNav = await getTranslations("navigation");

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("services"), path: "/kategorie" },
    { name: tParent("title"), path: `/kategorie/${slug}` },
    { name: t("title"), path: `/kategorie/${slug}/${subcategory}` },
  ]);

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <StructuredData data={breadcrumbSchema} />

      <Link
        href={`/kategorie/${slug}`}
        className="text-amber-700 font-semibold hover:underline mb-6 inline-block"
      >
        ← {tParent("title")}
      </Link>
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">{t("title")}</h1>
      {sub.image && (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-cream-100">
          <Image
            src={sub.image}
            alt={t("title")}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-contain p-6"
            priority
          />
        </div>
      )}
      <div className="mb-6">
        <ShareButtons variant="compact" url={`/kategorie/${slug}/${subcategory}`} title={t("title")} />
      </div>
      <p className="text-gray-600 text-lg leading-relaxed mb-10">{t("intro")}</p>

      {sub.products && sub.products.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-espresso-800 mb-6">{tCommon("productsTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {sub.products.map(({ id, url, image }) => (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-32 sm:h-36 bg-cream-100">
                  <Image
                    src={image}
                    alt={t(`products.${id}`)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-3 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-espresso-800">{t(`products.${id}`)}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {sub.eshopUrl && (
        <a
          href={sub.eshopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {tCommon("eshopCta")} →
        </a>
      )}
    </div>
  );
}
