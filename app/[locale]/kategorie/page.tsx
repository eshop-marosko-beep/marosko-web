import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
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
    image: categoryKeys[0].image,
  });
}

const categoryKeys = [
  {
    key: "angleGrinder",
    url: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/contour-sander-sada/random-sander/arbortech-contour-sander-gallery-5.jpg",
  },
  {
    key: "drill",
    url: "https://eshop.marosko.sk/c/nastroje-do-vrtacky",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-vrtacky/465-sada-dlabacich-vrtakov-/dlabaci-vrtak-stvorcove-otvory.jpg",
  },
  {
    key: "straightGrinder",
    url: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/18c14/18c14-40-%281%29-02.jpeg",
  },
  {
    key: "miniMill",
    url: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/predlzovaci-nadstavec.jpg",
  },
  {
    key: "powerTools",
    url: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/elektricke-naradie/extol/extol-craft.jpg",
  },
  {
    key: "cordless",
    url: "https://eshop.marosko.sk/c/akumulatorove-naradie",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/aku-mini-grinder-/mg-1000-aku-mini-grinder-.jpg",
  },
  {
    key: "customAbrasive",
    url: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/brusne-vyseky/samolepiace-podlozky/img-20210924-120931-03.jpeg",
  },
  {
    key: "handTools",
    url: "https://eshop.marosko.sk/c/rucne-naradie",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/rucne-naradie/diamantovy-blok.jpg",
  },
  {
    key: "coatings",
    url: "https://eshop.marosko.sk/c/lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/natery--tmely-brusiva/politury/lopticka-na-selak.jpg",
  },
  {
    key: "protective",
    url: "https://eshop.marosko.sk/c/ochranne-pomocky-pri-praci",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/oregon-/ladvinovy-pas/or295488-m.jpg",
  },
  {
    key: "spareParts",
    url: "https://eshop.marosko.sk/c/nahradne-noze-nastrojov-diely-arbortech",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/unasac-s-drazkami-chladiaci-efekt-.jpg",
  },
  {
    key: "stands",
    url: "https://eshop.marosko.sk/c/zveraky-svorky-drziaky-vrtacky-naradie",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/grinder-holder-/grinder--holder.jpg",
  },
  {
    key: "misc",
    url: "https://eshop.marosko.sk/c/rezbarske-prislusenstvo-doplnky",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/rucne-naradie/brusny-kamen.jpg",
  },
  {
    key: "carvingBlanks",
    url: "https://eshop.marosko.sk/c/listy-carvingove-vytvarnicke",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/oregon-/lista/oregon-carving-535044.jpg",
  },
  {
    key: "shankTools",
    url: "https://eshop.marosko.sk/c/stopkove-nastroje",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/stopkove-frezky/50mm/8025-2-hrcovnik-50-mm-titan-silverline.webp",
  },
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
        {categoryKeys.map(({ key, url, image }) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
          >
            <div className="relative h-40 bg-cream-100">
              <Image
                src={image}
                alt={t(`categories.${key}.name`)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-4"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-xl font-bold text-espresso-800 mb-2">
                {t(`categories.${key}.name`)}
              </h2>
              <p className="text-gray-600 leading-relaxed flex-1">
                {t(`categories.${key}.description`)}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-amber-700 font-semibold hover:underline"
              >
                {t("cta")} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
