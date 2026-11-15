import { NextResponse } from "next/server";
import { routing } from "@/routing";
import { getEshopPromos, pickTopPromos } from "@/lib/eshopPromos";

/** A few top sale products for the site footer. The footer is a client
 * component shared by every page, so it loads these after render instead
 * of making every page depend on the e-shop. One static response per
 * locale, regenerated at most hourly (like /akcie). */
export const dynamic = "force-static";
export const revalidate = 3600;
export const dynamicParams = false;

const COUNT = 3;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const promos = await getEshopPromos(locale);
  const products = (promos ? pickTopPromos(promos.products, COUNT) : []).map(
    ({ id, title, url, image, price, originalPrice, discountPercent }) => ({
      id,
      title,
      url,
      image,
      price,
      originalPrice,
      discountPercent,
    })
  );
  return NextResponse.json(
    { products, total: promos?.products.length ?? 0 },
    // Data for the footer only — keep it out of search results.
    { headers: { "X-Robots-Tag": "noindex" } }
  );
}
