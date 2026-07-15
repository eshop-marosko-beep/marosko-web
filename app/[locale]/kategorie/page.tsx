import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.categories" });
  return buildMetadata({ locale, path: "/kategorie", title: t("title"), description: t("description") });
}

const categoryKeys = [
  { key: "angleGrinder", url: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky" },
  { key: "drill", url: "https://eshop.marosko.sk/c/nastroje-do-vrtacky" },
  { key: "straightGrinder", url: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky" },
  { key: "miniMill", url: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50" },
  { key: "powerTools", url: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov" },
  { key: "cordless", url: "https://eshop.marosko.sk/c/akumulatorove-naradie" },
  { key: "customAbrasive", url: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno" },
  { key: "handTools", url: "https://eshop.marosko.sk/c/rucne-naradie" },
  { key: "coatings", url: "https://eshop.marosko.sk/c/lak-selak-natery-tmely-brusiva-pripravky-na-drevo" },
  { key: "protective", url: "https://eshop.marosko.sk/c/ochranne-pomocky-pri-praci" },
  { key: "spareParts", url: "https://eshop.marosko.sk/c/nahradne-noze-nastrojov-diely-arbortech" },
  { key: "stands", url: "https://eshop.marosko.sk/c/zveraky-svorky-drziaky-vrtacky-naradie" },
  { key: "misc", url: "https://eshop.marosko.sk/c/rezbarske-prislusenstvo-doplnky" },
  { key: "carvingBlanks", url: "https://eshop.marosko.sk/c/listy-carvingove-vytvarnicke" },
  { key: "shankTools", url: "https://eshop.marosko.sk/c/stopkove-nastroje" },
] as const;

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryKeys.map(({ key, url }) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-transparent hover:border-amber-200 transition-colors"
          >
            <div>
              <h2 className="text-xl font-bold text-espresso-800 mb-2">
                {t(`categories.${key}.name`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(`categories.${key}.description`)}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-amber-700 font-semibold hover:underline"
            >
              {t("cta")} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
