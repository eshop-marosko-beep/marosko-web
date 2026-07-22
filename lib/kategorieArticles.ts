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
];

export function getKategorieArticle(slug: string) {
  return kategorieArticles.find((article) => article.slug === slug);
}
