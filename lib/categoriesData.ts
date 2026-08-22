export type CategoryCard = {
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

export const categoryKeys: CategoryCard[] = [
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
