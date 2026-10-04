export type Promo = {
  slug: string;
  /** Banner image (e.g. under /public/promos), sized for both desktop and mobile via CSS. */
  image: string;
  alt: string;
  /** Direct link to the promoted product/category on eshop.marosko.sk. */
  productUrl: string;
};

/** Active promotions/clearance banners shown on /akcie. Add an entry here
 * (and its banner image under public/promos) to publish a new one; remove
 * it once the promotion ends.
 *
 * If a product's price changes but the promo itself is still running,
 * don't hand-edit the banner PNG — the price text was pulled back out of
 * the image into `scripts/update-promo-banner-price.mjs`, e.g.:
 *   node scripts/update-promo-banner-price.mjs \
 *     --file public/promos/manpa-multi-cutter-master.png \
 *     --original 413 --sale 369
 * and update `alt` below to match. */
export const promos: Promo[] = [
  {
    slug: "manpa-multi-cutter-master",
    image: "/promos/manpa-multi-cutter-master.png",
    alt: "MANPA Multi Cutter Master – výpredaj zásob, 413 € teraz za 369 €",
    productUrl:
      "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
  },
];
