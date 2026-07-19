import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { brands } from "@/lib/brandsData";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

const ESHOP_BRANDS_URL = "https://eshop.marosko.sk/drevorezba-naradie-rezbarske-naradie/vyrobcovia-znacky";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.brands" });
  return buildMetadata({ locale, path: "/znacky", title: t("title"), description: t("description") });
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("brands");

  // Richest cards first: logo + description, then description only, then name only.
  const rankedBrands = brands
    .map((brand) => {
      const description = t(`items.${brand.slug}.description`);
      const rank = brand.logo && description ? 0 : description ? 1 : 2;
      return { ...brand, description, rank };
    })
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {rankedBrands.map(({ id, name, url, logo, description }) => {
          return (
            <div
              key={id}
              className="bg-white rounded-xl shadow-lg p-6 border border-transparent hover:border-amber-200 transition-colors"
            >
              {logo && (
                <div className="relative h-10 w-28 mb-3">
                  <Image src={logo} alt={`Logo ${name}`} fill className="object-contain object-left" />
                </div>
              )}
              <h2 className="text-lg font-bold text-espresso-800 mb-2">
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">
                  {name}
                </a>
              </h2>
              {description && (
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <a
          href={ESHOP_BRANDS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("cta")} →
        </a>
      </div>
    </div>
  );
}
