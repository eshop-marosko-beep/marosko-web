import type { NextRequest } from "next/server";

export const maxDuration = 60;

/** Each Pinterest catalog feed wraps the matching BiznisWeb Google Shopping
 * feed. The source URL lives in an env variable so it can be changed without
 * a deploy (and so any access token in it stays out of the repo). */
const COUNTRIES: Record<string, { envVar: string; currency: string }> = {
  sk: { envVar: "BIZNISWEB_FEED_URL_SK", currency: "EUR" },
  cz: { envVar: "BIZNISWEB_FEED_URL_CZ", currency: "CZK" },
  ro: { envVar: "BIZNISWEB_FEED_URL_RO", currency: "RON" },
};

/** Fields passed through to Pinterest. Anything else in the source feed
 * (shipping rules, custom labels, ...) is dropped. */
const SINGLE_FIELDS = [
  "id",
  "item_group_id",
  "title",
  "description",
  "link",
  "image_link",
  "price",
  "sale_price",
  "availability",
  "condition",
  "brand",
  "gtin",
  "mpn",
  "google_product_category",
  "product_type",
] as const;

type Item = Record<string, string>;
type ParsedItem = { fields: Record<string, string>; extraImages: string[] };

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

function unwrap(raw: string): string {
  const cdata = raw.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return cdata ? cdata[1] : decodeEntities(raw);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // Characters that are illegal in XML 1.0 make Pinterest reject the whole file.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

/** Reads <item> (RSS) or <entry> (Atom) elements, accepting both `g:field`
 * and bare `field` tag names. */
function parseFeed(xml: string): ParsedItem[] {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => m[2]);
  return blocks.map((block) => {
    const fields: Record<string, string> = {};
    const extraImages: string[] = [];
    const tagRe = /<(?:g:)?([a-z_]+)\b[^>]*>([\s\S]*?)<\/(?:g:)?\1>/gi;
    let m: RegExpExecArray | null;
    while ((m = tagRe.exec(block))) {
      const name = m[1].toLowerCase();
      const value = unwrap(m[2]).trim();
      if (!value) continue;
      if (name === "additional_image_link") extraImages.push(value);
      else if (!(name in fields)) fields[name] = value;
    }
    // Atom feeds put the product URL in <link href="...">.
    if (!fields.link) {
      const href = block.match(/<link\b[^>]*href="([^"]+)"/i);
      if (href) fields.link = decodeEntities(href[1]);
    }
    return { fields, extraImages };
  });
}

function toHttps(url: string): string {
  return url.replace(/^http:\/\//i, "https://");
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<(br|\/p|\/li|\/div|\/h\d)\b[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** "12,50 €", "12.5", "12.50 EUR" -> "12.50 EUR" */
function normalizePrice(raw: string | undefined, currency: string): string | undefined {
  if (!raw) return undefined;
  const code = raw.match(/\b([A-Z]{3})\b/)?.[1] ?? currency;
  const number = raw.replace(/[^\d.,]/g, "").replace(/\s/g, "");
  if (!number) return undefined;
  // A comma is the decimal separator in SK/CZ/RO exports; dots before it are thousands separators.
  const normalized = number.includes(",") ? number.replace(/\./g, "").replace(",", ".") : number;
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return `${value.toFixed(2)} ${code}`;
}

function normalizeAvailability(raw: string | undefined): string {
  const value = (raw ?? "").toLowerCase().replace(/[_-]/g, " ").trim();
  if (value === "out of stock" || value.includes("vypredan") || value.includes("nedostup")) return "out of stock";
  if (value === "preorder" || value === "pre order") return "preorder";
  if (value === "backorder") return "backorder";
  return value === "" || value === "in stock" || value.includes("sklad") ? "in stock" : "out of stock";
}

/** JPEG and PNG are the formats Pinterest catalogs reliably accept. */
function isSupportedImage(url: string): boolean {
  return !/\.(webp|avif|gif|svg)(\?|$)/i.test(url);
}

function toPinterestItem({ fields, extraImages }: ParsedItem, currency: string): { item?: Item; images: string[]; problem?: string } {
  const id = fields.id;
  const title = fields.title ? stripHtml(fields.title).slice(0, 500) : "";
  const link = fields.link ? toHttps(fields.link) : "";
  const price = normalizePrice(fields.price, currency);
  if (!id) return { images: [], problem: "chýba id" };
  if (!title) return { images: [], problem: `${id}: chýba názov` };
  if (!link) return { images: [], problem: `${id}: chýba odkaz` };
  if (!price) return { images: [], problem: `${id}: chýba alebo je neplatná cena` };

  const images = [fields.image_link, ...extraImages].filter(Boolean).map(toHttps);
  if (!images.length) return { images: [], problem: `${id}: chýba obrázok` };
  // Prefer a JPG/PNG; a WebP-only product is still exported so Pinterest reports it per item
  // instead of the product silently disappearing.
  const mainImage = images.find(isSupportedImage) ?? images[0];

  const item: Record<string, string> = {
    ...Object.fromEntries(SINGLE_FIELDS.map((f) => [f, fields[f]]).filter(([, v]) => v)),
    id,
    title,
    link,
    image_link: mainImage,
    price,
    availability: normalizeAvailability(fields.availability),
    condition: (fields.condition ?? "new").toLowerCase(),
    description: (fields.description ? stripHtml(fields.description) : "").slice(0, 10000) || title,
  };
  // BiznisWeb double-escapes the category separator ("&amp;gt;"), so Pinterest would see a literal
  // "&gt;" and could not split the category path into levels for product groups.
  if (fields.product_type) {
    item.product_type = decodeEntities(fields.product_type)
      .split(">")
      .map((level) => level.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" > ");
  }
  const salePrice = normalizePrice(fields.sale_price, currency);
  if (salePrice) item.sale_price = salePrice;
  else delete item.sale_price;

  return {
    item,
    images: images.filter((url) => url !== mainImage && isSupportedImage(url)).slice(0, 10),
  };
}

/** The CZ export leaves google_product_category empty (or as Czech text) for most
 * products, which Pinterest flags as limiting visibility. Product ids are shared
 * across the language versions, so borrow the numeric category from the SK feed. */
async function fillCategoriesFromSk(country: string, items: ParsedItem[]): Promise<void> {
  const skUrl = process.env[COUNTRIES.sk.envVar];
  if (country === "sk" || !skUrl) return;
  if (items.every(({ fields }) => /^\d+$/.test(fields.google_product_category ?? ""))) return;

  const sk = await fetch(skUrl, { cache: "no-store" }).catch(() => undefined);
  if (!sk?.ok) return;
  const skCategories = new Map(
    parseFeed(await sk.text())
      .filter(({ fields }) => fields.id && /^\d+$/.test(fields.google_product_category ?? ""))
      .map(({ fields }) => [fields.id, fields.google_product_category]),
  );
  for (const { fields } of items) {
    if (/^\d+$/.test(fields.google_product_category ?? "")) continue;
    const category = skCategories.get(fields.id);
    if (category) fields.google_product_category = category;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const config = COUNTRIES[country.toLowerCase()];
  if (!config) {
    return new Response(`Neznáma krajina "${country}". Použi sk, cz alebo ro.`, { status: 404 });
  }
  const sourceUrl = process.env[config.envVar];
  if (!sourceUrl) {
    return new Response(`Chýba env premenná ${config.envVar}`, { status: 500 });
  }

  const source = await fetch(sourceUrl, { cache: "no-store" });
  if (!source.ok) {
    return new Response(`Zdrojový feed vrátil HTTP ${source.status}`, { status: 502 });
  }
  const parsed = parseFeed(await source.text());
  await fillCategoriesFromSk(country.toLowerCase(), parsed);

  const problems: string[] = [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of parsed) {
    const { item, images, problem } = toPinterestItem(entry, config.currency);
    if (!item) {
      problems.push(problem!);
      continue;
    }
    if (seen.has(item.id)) {
      problems.push(`${item.id}: duplicitné id`);
      continue;
    }
    seen.add(item.id);
    const tags = Object.entries(item).map(([k, v]) => `<g:${k}>${escapeXml(v)}</g:${k}>`);
    tags.push(...images.map((url) => `<g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`));
    out.push(`<item>${tags.join("")}</item>`);
  }

  // ?report=1 shows what was dropped and why, instead of the feed itself.
  if (request.nextUrl.searchParams.get("report")) {
    return Response.json({
      country,
      sourceItems: parsed.length,
      exportedItems: out.length,
      droppedItems: problems.length,
      problems,
    });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>` +
    `<title>eshop.marosko.sk (${country.toUpperCase()})</title>` +
    `<link>https://eshop.marosko.sk</link>` +
    `<description>Pinterest katalóg eshop.marosko.sk</description>` +
    out.join("\n") +
    `</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
