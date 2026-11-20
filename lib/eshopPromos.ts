/* Live promotions for /akcie, read from the sale category of
 * eshop.marosko.sk (BiznisWeb). The category page is the single source of
 * truth: whatever the shop shows there — products, sale and original
 * prices, discount, stock, "TOP produkt mesiaca" label — is what /akcie
 * shows, so prices can no longer drift from the shop the way the old
 * hand-made PNG banners did.
 *
 * The shop paginates the category 20 products at a time (?cProdPage=0, 20,
 * 40, ...). Pages are fetched one after another and cached by Next for
 * REVALIDATE_SECONDS (24 h), so the shop sees only a few requests a day. */

const ESHOP_BASE_URL = "https://eshop.marosko.sk";
export const PROMOS_REVALIDATE_SECONDS = 86400;
const PAGE_SIZE = 20;
/** Safety cap against a pagination loop if the shop markup changes. */
const MAX_PAGES = 15;

/** Sale category of each e-shop language version. The site's "en" locale
 * has no shop counterpart and uses the Slovak one, like getEshopUrl(). */
const SALE_CATEGORY_PATHS: Record<string, string> = {
  sk: "/c/akcia-naradie-vypredaj",
  cz: "/cz/c/akce-naradi-vyprodej",
  ro: "/ro/c/promotii-oferte-reduceri",
};

/** BiznisWeb indicator id of the "TOP produkt mesiaca" label (same id in
 * every language version; the label text is translated). */
const TOP_PRODUCT_INDICATOR = "indicator-11";

export type PromoLabel = { text: string; background?: string; color?: string };

export type EshopPromo = {
  id: string;
  title: string;
  /** Absolute product URL on eshop.marosko.sk. */
  url: string;
  /** Absolute image URL (440×440 resize served by the shop). */
  image?: string;
  /** Shop warehouse code, e.g. "701-M". */
  code?: string;
  description?: string;
  /** Prices exactly as the shop formats them, e.g. "384 €", "1041,10 Kč". */
  price: string;
  originalPrice?: string;
  /** e.g. "20%" */
  discountPercent?: string;
  /** e.g. "-82 €" */
  discountAmount?: string;
  /** e.g. "Skladom", "Na objednávku" */
  stockStatus?: string;
  /** e.g. "3 ks" */
  stockQuantity?: string;
  labels: PromoLabel[];
  isTopProduct: boolean;
};

export type EshopPromos = {
  /** Link to the full sale category in the matching shop language. */
  categoryUrl: string;
  /** Product count reported by the shop for the category. */
  total: number;
  products: EshopPromo[];
};

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Strips tags, decodes entities and collapses whitespace. */
function text(html: string | undefined): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Inner HTML of the first element whose class list contains `className`.
 * Only for leaf-ish elements (span/p/h3) — not for nested same-tag blocks. */
function byClass(html: string, className: string): string | undefined {
  const re = new RegExp(
    `<(\\w+)\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`
  );
  return html.match(re)?.[2];
}

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${ESHOP_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function parseLabels(html: string): PromoLabel[] {
  const block = byClass(html, "indicators") ?? "";
  return [...block.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/g)]
    .map(([, attrs, inner]) => {
      const style = attrs.match(/style="([^"]*)"/)?.[1] ?? "";
      return {
        text: text(inner),
        background: style.match(/background-color:\s*(#[0-9a-f]{3,8})/i)?.[1],
        color: style.match(/(?:^|;)\s*color:\s*(#[0-9a-f]{3,8})/i)?.[1],
      };
    })
    .filter((label) => label.text);
}

function parseProduct(item: string): EshopPromo | null {
  const id = item.match(/data-pid="(\d+)"/)?.[1];
  const href = item.match(/data-href="([^"]+)"/)?.[1];
  const titleHtml = byClass(item, "s1-listProductTitle");
  const price = text(item.match(/<p class="price">([\s\S]*?)<\/p>/)?.[1]);
  if (!id || !href || !titleHtml || !price) return null;

  const image = item.match(/data-src="([^"]+)"/)?.[1] ?? item.match(/<img[^>]*class="no-js-image"[^>]*src="([^"]+)"/)?.[1];
  const quantity = text(byClass(item, "s1-gridItem-whQty")).replace(/^\(|\)$/g, "");
  const labels = parseLabels(item);

  return {
    id,
    title: text(titleHtml),
    url: absolute(decodeEntities(href)),
    image: image ? absolute(decodeEntities(image)) : undefined,
    code: text(byClass(item, "productListGridWarehouseNumber")).replace(/^\(|\)$/g, "") || undefined,
    description: text(byClass(item, "s1-gridItem-description")) || undefined,
    price,
    originalPrice: text(byClass(item, "s1-discountBedge-title")) || undefined,
    discountPercent: text(byClass(item, "s1-discountBedge-value")) || undefined,
    discountAmount: text(byClass(item, "s1-discountBedge-priceValue")) || undefined,
    stockStatus: text(byClass(item, "s1-gridItem-status")).replace(/^[^\p{L}\d]+/u, "") || undefined,
    stockQuantity: quantity || undefined,
    labels,
    isTopProduct: new RegExp(`\\b${TOP_PRODUCT_INDICATOR}\\b`).test(byClass(item, "indicators") ?? ""),
  };
}

/** Parses one category page: its products and the total product count. */
export function parseCategoryPage(html: string): { total: number; products: EshopPromo[] } {
  const total = Number(html.match(/class="productCount">\s*(\d+)/)?.[1] ?? 0);
  const list = html.match(/<ul class="productListFGrid[\s\S]*?<\/ul>\s*<div class="productsLoadingAppend/)?.[0] ?? "";
  const products = list
    .split(/<li class="s1-gridItem\b/)
    .slice(1)
    .map((chunk) => parseProduct(chunk))
    .filter((p): p is EshopPromo => p !== null);
  return { total, products };
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    next: { revalidate: PROMOS_REVALIDATE_SECONDS, tags: ["eshop-promos"] },
    headers: { "User-Agent": "marosko.sk promotions (+https://www.marosko.sk/akcie)" },
  });
  if (!res.ok) throw new Error(`E-shop sale category ${url}: HTTP ${res.status}`);
  return res.text();
}

export function getSaleCategoryUrl(locale: string): string {
  return `${ESHOP_BASE_URL}${SALE_CATEGORY_PATHS[locale] ?? SALE_CATEGORY_PATHS.sk}`;
}

/** All products of the shop's sale category for the locale, in the shop's
 * own order. Returns null when the shop can't be read, so the page can fall
 * back to a plain link instead of showing stale or made-up prices. */
export async function getEshopPromos(locale: string): Promise<EshopPromos | null> {
  const categoryUrl = getSaleCategoryUrl(locale);
  try {
    const first = parseCategoryPage(await fetchPage(categoryUrl));
    const products = [...first.products];
    const seen = new Set(products.map((p) => p.id));
    const pages = Math.min(Math.ceil(first.total / PAGE_SIZE), MAX_PAGES);

    for (let page = 1; page < pages; page++) {
      const { products: more } = parseCategoryPage(await fetchPage(`${categoryUrl}?cProdPage=${page * PAGE_SIZE}`));
      if (!more.length) break;
      for (const p of more) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          products.push(p);
        }
      }
    }

    return { categoryUrl, total: first.total || products.length, products };
  } catch (error) {
    console.error("[akcie] Could not load e-shop promotions:", error);
    return null;
  }
}

/** The shop's "TOP produkt mesiaca", else its first sale product. */
export function pickFeaturedPromo(products: EshopPromo[]): EshopPromo | undefined {
  return products.find((p) => p.isTopProduct) ?? products[0];
}

/** Products for a short "top deals" teaser: the shop's TOP products first,
 * then the rest in the shop's order. */
export function pickTopPromos(products: EshopPromo[], count: number): EshopPromo[] {
  return [...products.filter((p) => p.isTopProduct), ...products.filter((p) => !p.isTopProduct)].slice(0, count);
}
