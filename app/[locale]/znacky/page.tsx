import { getTranslations, setRequestLocale } from "next-intl/server";
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

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {brands.map(({ id, slug, name }) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-lg p-6 border border-transparent hover:border-amber-200 transition-colors"
          >
            <h2 className="text-lg font-bold text-espresso-800 mb-2">{name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t(`items.${slug}.description`)}
            </p>
          </div>
        ))}
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
