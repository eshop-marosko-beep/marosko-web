export type GuideArticle = {
  slug: string;
  translationKey: string;
  image: string;
};

/** Long-form written guides, shown alongside the videos on /navody. Slovak only for now. */
export const guideArticles: GuideArticle[] = [
  {
    slug: "ako-vyrezat-sochu-motorovou-pilou",
    translationKey: "sochaMotorovouPilou",
    image: "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg",
  },
];

export function getGuideArticle(slug: string) {
  return guideArticles.find((article) => article.slug === slug);
}
