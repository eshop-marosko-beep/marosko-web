/* Products of eshop.marosko.sk, read from the daily AI product feed (the
 * same file served at www.marosko.sk/agent-feed.json). Used to pick photos
 * and the product link for TikTok photo posts.
 *
 * The feed is ~2 MB, too large for Next's fetch cache, so each server
 * instance keeps a parsed copy for an hour. */

const FEED_URL = "https://www.rezbarskenaradie.sk/marosko/agent-feed.json";
const TTL_MS = 60 * 60 * 1000;

type FeedProduct = {
  id: string;
  title: string;
  link: string;
  image_link?: string;
  additional_image_link?: string[];
  brand?: string;
  price?: { value: string; currency: string };
  availability?: string;
};

export type EshopProduct = {
  id: string;
  title: string;
  /** Full product page URL. */
  link: string;
  /** Short form for captions, e.g. eshop.marosko.sk/p/210 (redirects to link). */
  shortLink: string;
  images: string[];
  brand: string;
  price: string;
  availability: string;
};

let cache: { at: number; products: EshopProduct[] } | null = null;

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export async function getEshopProducts(): Promise<EshopProduct[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.products;
  const res = await fetch(FEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Product feed: HTTP ${res.status}`);
  const feed = (await res.json()) as { products?: FeedProduct[] };
  const products = (feed.products ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    link: p.link,
    shortLink: `eshop.marosko.sk/p/${p.id}`,
    images: [p.image_link, ...(p.additional_image_link ?? [])].filter((u): u is string => Boolean(u)),
    brand: p.brand ?? "",
    price: p.price ? `${p.price.value} ${p.price.currency}` : "",
    availability: p.availability ?? "",
  }));
  cache = { at: Date.now(), products };
  return products;
}

/** Products whose title, brand or id match every word of the query. */
export async function searchEshopProducts(query: string, limit = 20): Promise<EshopProduct[]> {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const products = await getEshopProducts();
  return products
    .filter((p) => {
      const hay = normalize(`${p.title} ${p.brand} ${p.id}`);
      return words.every((w) => hay.includes(w));
    })
    .slice(0, limit);
}
