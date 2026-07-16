export type HeurekaReview = {
  id: string;
  name: string | null;
  timestamp: number;
  rating: number;
  text: string;
};

const HEUREKA_REVIEWS_ENDPOINT = "https://www.heureka.sk/direct/dotaznik/export-review.php";
const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MIN_RATING = 4;
const MAX_REVIEWS = 20;
// Heureka regenerates the "Overené zákazníkmi" export roughly every 6 hours, so there is
// no point revalidating more often than that.
const REVALIDATE_SECONDS = 21600;

// Reviews on heureka.sk are always written in Slovak; map each site locale to the
// MyMemory language code to translate into (sk itself needs no translation).
const LOCALE_TO_TRANSLATE_LANG: Record<string, string> = {
  cz: "cs",
  en: "en",
  ro: "ro",
};

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractField(block: string, tag: string): string | undefined {
  const match = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`)
  );
  if (!match) return undefined;
  const raw = match[1] ?? match[2] ?? "";
  const value = decodeXmlEntities(raw).trim();
  return value.length > 0 ? value : undefined;
}

export function parseHeurekaReviewsXml(xml: string): HeurekaReview[] {
  const blocks = xml.match(/<review>[\s\S]*?<\/review>/g) ?? [];
  const reviews: HeurekaReview[] = [];

  for (const block of blocks) {
    const id = extractField(block, "rating_id");
    const timestampRaw = extractField(block, "unix_timestamp");
    const ratingRaw = extractField(block, "total_rating");
    const name = extractField(block, "name");
    // "summary" is Heureka's field for the customer's overall opinion text; pros/cons
    // are shorter bullet-style fallbacks used only when no summary was given.
    const text = extractField(block, "summary") ?? extractField(block, "pros") ?? extractField(block, "cons");

    if (!id || !timestampRaw || !ratingRaw || !text) continue;

    const rating = parseFloat(ratingRaw);
    const timestamp = parseInt(timestampRaw, 10);
    if (Number.isNaN(rating) || Number.isNaN(timestamp)) continue;

    reviews.push({ id, name: name ?? null, timestamp, rating, text });
  }

  return reviews;
}

// Translates Slovak review text via the free MyMemory API. Best-effort only: any
// failure (network error, quota exceeded, empty result) silently falls back to the
// original Slovak text rather than breaking the section.
async function translateFromSlovak(text: string, locale: string): Promise<string> {
  const targetLang = LOCALE_TO_TRANSLATE_LANG[locale];
  if (!targetLang) return text;

  try {
    const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=sk|${targetLang}`;
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return text;

    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    return typeof translated === "string" && translated.trim().length > 0 ? translated : text;
  } catch {
    return text;
  }
}

/**
 * Fetches shop reviews from Heureka's "Overené zákazníkmi" export, server-side only
 * (the API key must never reach the client). Returns null on any failure — missing key,
 * network/HTTP error, unparseable response, or zero qualifying reviews — so callers can
 * fall back to static content instead of rendering an empty/broken section.
 *
 * For non-Slovak locales, review text is machine-translated (best-effort, falls back
 * to the Slovak original on failure).
 */
export async function getHeurekaReviews(locale: string): Promise<HeurekaReview[] | null> {
  const apiKey = process.env.HEUREKA_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${HEUREKA_REVIEWS_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const xml = await response.text();
    const reviews = parseHeurekaReviewsXml(xml)
      .filter((review) => review.rating >= MIN_RATING)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_REVIEWS);

    if (reviews.length === 0) return null;

    const translated = await Promise.all(
      reviews.map(async (review) => ({
        ...review,
        text: await translateFromSlovak(review.text, locale),
      }))
    );

    return translated;
  } catch {
    return null;
  }
}
