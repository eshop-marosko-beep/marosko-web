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
];

export function getKategorieArticle(slug: string) {
  return kategorieArticles.find((article) => article.slug === slug);
}
