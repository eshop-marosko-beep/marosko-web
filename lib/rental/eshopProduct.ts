/** Product name, code and price read from the tool's page on
 * eshop.marosko.sk, so the rental contract always shows what the eshop
 * currently says. The product feed URL is set only for production, while
 * product pages are public everywhere, so they are the source here. */

export type EshopProduct = { title: string; code: string; price: number | null };

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function clean(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Returns null when the page can't be read; the documents then leave the
 * fields blank to fill in by hand. */
export async function getEshopProduct(url: string): Promise<EshopProduct | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 21_600 }, signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return null;
    const html = await res.text();
    const title = html.match(/<h1 class="detailTitle">([\s\S]*?)<\/h1>/)?.[1];
    if (!title) return null;
    const price = Number.parseFloat(html.match(/data-price-tax="([\d.]+)"/)?.[1] ?? "");
    return {
      title: clean(title),
      code: clean(html.match(/kód:\s*<strong>([^<]+)/)?.[1] ?? ""),
      price: Number.isFinite(price) && price > 0 ? price : null,
    };
  } catch {
    return null;
  }
}
