export type GuideArticle = {
  slug: string;
  translationKey: string;
  image: string;
  /** Natural image dimensions, when known to be small (e.g. a book cover) so it isn't stretched full-width. */
  imageIsCover?: boolean;
  /** Prominent external CTA, e.g. a specific eshop product page — shown above the closing links. */
  primaryCta?: { href: string };
};

/** Long-form written guides, shown alongside the videos on /navody. Slovak only for now. */
export const guideArticles: GuideArticle[] = [
  {
    slug: "ako-vyrezat-sochu-motorovou-pilou",
    translationKey: "sochaMotorovouPilou",
    image: "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg",
  },
  {
    slug: "kniha-rezba-motorovou-pilou",
    translationKey: "knihaRezbaMotorovouPilou",
    image: "/brand/logos/andrejIrsa.jpg",
    imageIsCover: true,
    primaryCta: { href: "https://eshop.marosko.sk/p/800/rezba-motorovou-pilou-prirucka-pre-vytvarnikov?pp=c3e878e2" },
  },
];

export function getGuideArticle(slug: string) {
  return guideArticles.find((article) => article.slug === slug);
}
