import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema, buildItemListSchema } from "@/lib/structuredData";
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

type CategoryCard = {
  key: string;
  url: string;
  /** eshop.marosko.sk Romanian version of this category, when one exists
   * (verified via that page's own hreflang="ro" alternate link). Falls back
   * to `url` (Slovak) when absent, since eshop.marosko.sk doesn't cover
   * every category in every language. */
  roUrl?: string;
  image: string;
  slug: string | null;
};

const categoryKeys: CategoryCard[] = [
  {
    key: "angleGrinder",
    url: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky",
    roUrl: "https://eshop.marosko.sk/ro/c/discuri-pentru-sculpta-in-polizor",
    image:
      "https://eshop.marosko.sk/resize/e/1600/1600/files/na-drevo/arbortech/arbortech-skrabka/arbortech-turbo-scraper-flex.jpg",
    slug: "nastroje-do-uhlovej-brusky",
  },
  {
    key: "drill",
    url: "https://eshop.marosko.sk/c/nastroje-do-vrtacky",
    roUrl: "https://eshop.marosko.sk/ro/c/accesorii-bormasini-sculptura",
    image: "/kategorie/nastroje-do-vrtacky.png",
    slug: "nastroje-do-vrtacky",
  },
  {
    key: "straightGrinder",
    url: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky",
    roUrl: "https://eshop.marosko.sk/ro/c/biaxuri-sculptura-polizoarele-drepte",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/18c14/18c14-40-%281%29-02.jpeg",
    slug: "prislusenstva-do-priamej-brusky-frezky",
  },
  {
    key: "miniMill",
    url: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50",
    roUrl: "https://eshop.marosko.sk/ro/c/mini-discuri-50mm",
    image: "/kategorie/nastroje-do-mini-frezky.jpg",
    slug: "mini-kotuce-pre-mini-frezky-50",
  },
  {
    key: "powerTools",
    url: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov",
    roUrl: "https://eshop.marosko.sk/ro/c/prelucrarea-lemnului",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/elektricke-naradie/extol/extol-craft.jpg",
    slug: "elektricke-naradie-pre-rezbarov",
  },
  {
    key: "cordless",
    url: "https://eshop.marosko.sk/c/akumulatorove-naradie",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/aku-mini-grinder-/mg-1000-aku-mini-grinder-.jpg",
    slug: "akumulatorove-naradie",
  },
  {
    key: "customAbrasive",
    url: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno",
    roUrl: "https://eshop.marosko.sk/ro/c/smirghel-abraziv-de-granulatii-variate",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/brusne-vyseky/samolepiace-podlozky/img-20210924-120931-03.jpeg",
    slug: "brusne-vyseky-brusny-papier-platno",
  },
  {
    key: "handTools",
    url: "https://eshop.marosko.sk/c/rucne-naradie",
    roUrl: "https://eshop.marosko.sk/ro/c/unelte-manuale",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/rucne-naradie/diamantovy-blok.jpg",
    slug: "rucne-naradie",
  },
  {
    key: "coatings",
    url: "https://eshop.marosko.sk/c/lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    roUrl: "https://eshop.marosko.sk/ro/c/produse-intretinere-finisare-lemn",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/natery--tmely-brusiva/politury/lopticka-na-selak.jpg",
    slug: "lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
  },
  {
    key: "protective",
    url: "https://eshop.marosko.sk/c/ochranne-pomocky-pri-praci",
    roUrl: "https://eshop.marosko.sk/ro/c/unelte-si-accesorii-de-protectie",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/oregon-/ladvinovy-pas/or295488-m.jpg",
    slug: "ochranne-pomocky-pri-praci",
  },
  {
    key: "spareParts",
    url: "https://eshop.marosko.sk/c/nahradne-noze-nastrojov-diely-arbortech",
    roUrl: "https://eshop.marosko.sk/ro/c/nahradne-noze-nastrojov-diely-arbortech",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/unasac-s-drazkami-chladiaci-efekt-.jpg",
    slug: "nahradne-noze-nastrojov-diely-arbortech",
  },
  {
    key: "stands",
    url: "https://eshop.marosko.sk/c/zveraky-svorky-drziaky-vrtacky-naradie",
    roUrl: "https://eshop.marosko.sk/ro/c/dispozitive-pentru-sculptura-lemn",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/grinder-holder-/grinder--holder.jpg",
    slug: "zveraky-svorky-drziaky-vrtacky-naradie",
  },
  {
    key: "misc",
    url: "https://eshop.marosko.sk/c/rezbarske-prislusenstvo-doplnky",
    roUrl: "https://eshop.marosko.sk/ro/c/accesorii-universale-scule",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/rucne-naradie/brusny-kamen.jpg",
    slug: "rezbarske-prislusenstvo-doplnky",
  },
  {
    key: "carvingBlanks",
    url: "https://eshop.marosko.sk/c/listy-carvingove-vytvarnicke",
    image: "https://eshop.marosko.sk/resize/e/440/440/files/oregon-/lista/oregon-carving-535044.jpg",
    slug: "listy-carvingove-vytvarnicke",
  },
  {
    key: "shankTools",
    url: "https://eshop.marosko.sk/c/stopkove-nastroje",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/stopkove-frezky/50mm/8025-2-hrcovnik-50-mm-titan-silverline.webp",
    slug: "stopkove-nastroje",
  },
  {
    key: "airTools",
    url: "https://eshop.marosko.sk/c/vzduchove-naradie",
    roUrl: "https://eshop.marosko.sk/ro/c/vzduchove-naradie",
    image:
      "https://eshop.marosko.sk/resize/e/440/440/files/pneumaticke-naradie/priama-bruska-/fortum/fortum-balenie-priama-pneumaticka-bruska.webp",
    slug: "vzduchove-naradie",
  },
];

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
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4"
                    />
                  </Link>
                ) : (
                  <Image
                    src={image}
                    alt={t(`categories.${key}.name`)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
