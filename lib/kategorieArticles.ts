export type KategorieSubcategory = {
  translationKey: string;
  /** Slugs into /galeria/[slug] for subcategories we already cover with a dedicated gallery page. */
  galleryLinks?: string[];
};

export type KategorieArticle = {
  slug: string;
  translationKey: string;
  eshopUrl: string;
  subcategories: KategorieSubcategory[];
};

export const kategorieArticles: KategorieArticle[] = [
  {
    slug: "nastroje-do-uhlovej-brusky",
    translationKey: "nastrojeDoUhlovejBrusky",
    eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky",
    subcategories: [
      {
        translationKey: "naDrevo",
        galleryLinks: ["frezovacie-kotuce", "hoblovacie-naradie", "ihlickove-brusne-kotuce"],
      },
      {
        translationKey: "manpaRameno",
        galleryLinks: ["manpa-predlzovacie-rameno"],
      },
      { translationKey: "diamantoveKotuce" },
      { translationKey: "nadstavce" },
      { translationKey: "kamenTehla" },
      { translationKey: "plastoveKompozity" },
    ],
  },
  {
    slug: "nastroje-do-vrtacky",
    translationKey: "nastrojeDoVrtacky",
    eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky",
    subcategories: [
      {
        translationKey: "frezovanie",
        galleryLinks: ["frezovacie-nastroje-do-vrtacky"],
      },
      { translationKey: "brusenie" },
      { translationKey: "ostrenie" },
      { translationKey: "nastavce" },
      { translationKey: "vrtaky" },
    ],
  },
  {
    slug: "prislusenstva-do-priamej-brusky-frezky",
    translationKey: "nastrojeDoPriamejBrusky",
    eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky",
    subcategories: [
      { translationKey: "stopky24mm" },
      { translationKey: "stopky3mm" },
      { translationKey: "stopky32mm" },
      {
        translationKey: "stopky6mm",
        galleryLinks: ["prislusenstvo-priamej-brusky"],
      },
      { translationKey: "stopky64mm" },
    ],
  },
  {
    slug: "mini-kotuce-pre-mini-frezky-50",
    translationKey: "nastrojeDoMiniFrezky",
    eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50",
    subcategories: [
      { translationKey: "arbortech" },
      { translationKey: "ideaImport" },
      {
        translationKey: "saburrtooth",
        galleryLinks: ["mini-kotuce-pre-mini-frezky"],
      },
      { translationKey: "manpa" },
      { translationKey: "merlin" },
    ],
  },
  {
    slug: "brusne-vyseky-brusny-papier-platno",
    translationKey: "brusneVysekyNaMieru",
    eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno",
    subcategories: [
      { translationKey: "maleVyseky" },
      { translationKey: "strednePriemery" },
      { translationKey: "velkePriemery" },
      { translationKey: "papier115mm" },
      { translationKey: "podlozky" },
    ],
  },
  {
    slug: "elektricke-naradie-pre-rezbarov",
    translationKey: "elektrickeNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov",
    subcategories: [
      { translationKey: "arbortech" },
      { translationKey: "extolPremium" },
      { translationKey: "kirjes" },
      { translationKey: "tusonPriamaBruska" },
      { translationKey: "proxxon" },
      { translationKey: "silverline" },
      { translationKey: "total" },
    ],
  },
  {
    slug: "akumulatorove-naradie",
    translationKey: "akumulatoroveNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/akumulatorove-naradie",
    subcategories: [{ translationKey: "bruskyAku" }, { translationKey: "pilyAku" }],
  },
  {
    slug: "rucne-naradie",
    translationKey: "rucneNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie",
    subcategories: [
      { translationKey: "pilniky" },
      { translationKey: "dlata" },
      { translationKey: "noze" },
      { translationKey: "rydla" },
      { translationKey: "tesarskeDlata" },
    ],
  },
  {
    slug: "lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    translationKey: "nateryTmelyBrusiva",
    eshopUrl: "https://eshop.marosko.sk/c/lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    subcategories: [
      { translationKey: "pozlacovanie" },
      { translationKey: "protiCervotocom" },
      { translationKey: "riedenie" },
      { translationKey: "selakyMoridla" },
      { translationKey: "vosky", galleryLinks: ["selaky-vosky-natery-na-drevo"] },
      { translationKey: "zivice" },
    ],
  },
  {
    slug: "ochranne-pomocky-pri-praci",
    translationKey: "ochrannePomocky",
    eshopUrl: "https://eshop.marosko.sk/c/ochranne-pomocky-pri-praci",
    subcategories: [
      { translationKey: "obuv" },
      { translationKey: "ruky" },
      { translationKey: "telo" },
      { translationKey: "tvarDychanieSluch" },
    ],
  },
  {
    slug: "nahradne-noze-nastrojov-diely-arbortech",
    translationKey: "nahradneDiely",
    eshopUrl: "https://eshop.marosko.sk/c/nahradne-noze-nastrojov-diely-arbortech",
    subcategories: [{ translationKey: "arbortechDiely" }, { translationKey: "manpaDiely" }],
  },
  {
    slug: "zveraky-svorky-drziaky-vrtacky-naradie",
    translationKey: "podstavceZveraky",
    eshopUrl: "https://eshop.marosko.sk/c/zveraky-svorky-drziaky-vrtacky-naradie",
    subcategories: [],
  },
  {
    slug: "rezbarske-prislusenstvo-doplnky",
    translationKey: "drobnySortiment",
    eshopUrl: "https://eshop.marosko.sk/c/rezbarske-prislusenstvo-doplnky",
    subcategories: [],
  },
  {
    slug: "listy-carvingove-vytvarnicke",
    translationKey: "carvingoveListy",
    eshopUrl: "https://eshop.marosko.sk/c/listy-carvingove-vytvarnicke",
    subcategories: [],
  },
  {
    slug: "stopkove-nastroje",
    translationKey: "stopkoveNastroje",
    eshopUrl: "https://eshop.marosko.sk/c/stopkove-nastroje",
    subcategories: [],
  },
];

export function getKategorieArticle(slug: string) {
  return kategorieArticles.find((article) => article.slug === slug);
}
