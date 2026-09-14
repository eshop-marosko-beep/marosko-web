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
 * it once the promotion ends. */
export const promos: Promo[] = [];
