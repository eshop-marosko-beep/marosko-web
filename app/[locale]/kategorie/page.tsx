import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema, buildItemListSchema } from "@/lib/structuredData";
import { categoryKeys, type CategoryCard } from "@/lib/categoriesData";
import StructuredData from "@/components/StructuredData";
import { Link } from "@/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.categories" });
  return buildMetadata({
    locale,
    path: "/kategorie",
    title: t("title"),
    description: t("description"),
    image: "/brand/marosko-share-logo.jpg",
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tNav = await getTranslations("navigation");

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("services"), path: "/kategorie" },
  ]);
  const itemListSchema = buildItemListSchema(
    locale,
    categoryKeys
      .filter((c): c is CategoryCard & { slug: string } => c.slug !== null)
      .map(({ key, slug }) => ({ name: t(`categories.${key}.name`), path: `/kategorie/${slug}` }))
  );

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={itemListSchema} />

      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryKeys.map(({ key, url, roUrl, image, slug }) => {
          const eshopUrl = locale === "ro" && roUrl ? roUrl : url;
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-40 bg-cream-100">
                {slug ? (
                  <Link href={`/kategorie/${slug}`} className="block h-full">
                    <Image
                      src={image}
                      alt={t(`categories.${key}.name`)}
                      fill
                      unoptimized
                      className="object-contain p-4"
                    />
                  </Link>
                ) : (
                  <Image
                    src={image}
                    alt={t(`categories.${key}.name`)}
                    fill
                    unoptimized
                    className="object-contain p-4"
                  />
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-espresso-800 mb-2">
                  {slug ? (
                    <Link href={`/kategorie/${slug}`} className="hover:text-amber-700 transition-colors">
                      {t(`categories.${key}.name`)}
                    </Link>
                  ) : (
                    t(`categories.${key}.name`)
                  )}
                </h2>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {t(`categories.${key}.description`)}
                </p>
                <a
                  href={eshopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-amber-700 font-semibold hover:underline"
                >
                  {t("cta")} →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
